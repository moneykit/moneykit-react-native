package expo.modules.moneykitconnectreactnative

import android.net.Uri
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.moneykit.connect.MkConfiguration
import com.moneykit.connect.MkLinkHandler
import com.moneykit.connect.entities.MkLinkError
import com.moneykit.connect.entities.MkLinkSuccessType
import com.moneykit.connect.entities.MkLinkedInstitution
import com.moneykit.connect.entities.MkRelinkedInstitution
import com.moneykit.connect.entities.MkLinkEvent

class ConnectModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  private var linkHandler: MkLinkHandler? = null

  private val onSuccess = "onSuccess"
  private val onEvent = "onEvent"
  private val onExit = "onExit"

  override fun getName(): String {
    return "Connect"
  }

  @ReactMethod
  @Suppress("UNUSED_PARAMETER")
  fun addListener(eventName: String) {
    // Required for RN built-in Event Emitter Calls
  }

  @ReactMethod
  @Suppress("UNUSED_PARAMETER")
  fun removeListeners(count: Int) {
    // Required for RN built-in Event Emitter Calls
  }

  @ReactMethod
  fun presentLinkFlow(config: ReadableMap, promise: Promise) {
    if (!config.hasKey("linkSessionToken")) {
      promise.reject("INVALID_CONFIG", "linkSessionToken is required")
      return
    }

    val linkSessionToken = config.getString("linkSessionToken")
    if (linkSessionToken == null) {
      promise.reject("INVALID_CONFIG", "linkSessionToken is required")
      return
    }

    val activity = currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "Activity doesn't exist")
      return
    }

    linkHandler = createLinkHandler(linkSessionToken)

    activity.runOnUiThread {
      linkHandler?.presentLinkFlow(activity)
      promise.resolve(null)
    }
  }

  @ReactMethod
  fun continueFlow(urlString: String, promise: Promise) {
    val activity = currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "Activity doesn't exist")
      return
    }

    val url = Uri.parse(urlString)

    activity.runOnUiThread {
      linkHandler?.continueFlow(activity, url)
      promise.resolve(null)
    }
  }

  private fun sendEvent(eventName: String, params: WritableMap?) {
    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  private fun createLinkHandler(linkSessionToken: String): MkLinkHandler? {
    try {
      val configuration = MkConfiguration(
        sessionToken = linkSessionToken,
        onSuccess = { handleConnectSuccess(it) },
        onExit = { handleConnectExit(null) },
        onEvent = { handleConnectEvent(it) }
      )

      return MkLinkHandler(configuration)
    } catch (error: MkConfiguration.ConfigurationError) {
      val params = Arguments.createMap()
      params.putString("displayedMessage", error.message)
      sendEvent(onExit, params)
      return null
    } catch (error: Exception) {
      val params = Arguments.createMap()
      params.putString("displayedMessage", error.message)
      sendEvent(onExit, params)
      return null
    }
  }

  private fun handleConnectSuccess(successType: MkLinkSuccessType) {
    when (successType) {
      is MkLinkSuccessType.Linked ->
        sendEvent(onSuccess, successType.institution.toWritableMap())

      is MkLinkSuccessType.Relinked ->
        sendEvent(onSuccess, successType.institution.toWritableMap())
    }
  }

  private fun handleConnectExit(error: MkLinkError?) {
    if (error == null) {
      sendEvent(onExit, null)
      return
    }

    val params = Arguments.createMap()
    params.putString("displayedMessage", error.displayedMessage)
    error.requestId?.let { params.putString("requestId", it) }
    sendEvent(onExit, params)
  }

  private fun handleConnectEvent(event: MkLinkEvent) {
    val params = Arguments.createMap()
    params.putString("name", event.name)

    val properties = Arguments.createMap()
    event.properties.forEach { (key, value) ->
      if (value != null) {
        properties.putString(key, value)
      }
    }
    params.putMap("properties", properties)

    sendEvent(onEvent, params)
  }

  private fun MkLinkedInstitution.toWritableMap(): WritableMap {
    val map = Arguments.createMap()

    val linkIdMap = Arguments.createMap()
    linkIdMap.putString("value", linkId)
    map.putMap("linkIdentifier", linkIdMap)

    val institutionMap = Arguments.createMap()
    institutionMap.putString("id", institution.id)
    institutionMap.putString("name", institution.name)
    map.putMap("institution", institutionMap)

    val tokenMap = Arguments.createMap()
    tokenMap.putString("value", token.value)
    map.putMap("token", tokenMap)

    val accountsArray = Arguments.createArray()
    accounts.forEach { account ->
      val accountMap = Arguments.createMap()
      accountMap.putString("id", account.id)
      accountMap.putString("name", account.name)
      account.mask?.let { accountMap.putString("mask", it) }
      accountMap.putString("type", account.type)
      accountsArray.pushMap(accountMap)
    }
    map.putArray("accounts", accountsArray)

    val trackedScreensArray = Arguments.createArray()
    trackedScreens.forEach { trackedScreen ->
      val screenMap = Arguments.createMap()
      screenMap.putString("name", trackedScreen.name)
      screenMap.putString("tag", trackedScreen.tag)
      trackedScreensArray.pushMap(screenMap)
    }
    map.putArray("trackedScreens", trackedScreensArray)

    return map
  }

  private fun MkRelinkedInstitution.toWritableMap(): WritableMap {
    val map = Arguments.createMap()

    val linkIdMap = Arguments.createMap()
    linkIdMap.putString("value", linkId)
    map.putMap("linkIdentifier", linkIdMap)

    val institutionMap = Arguments.createMap()
    institutionMap.putString("id", institution.id)
    institutionMap.putString("name", institution.name)
    map.putMap("institution", institutionMap)

    val accountsArray = Arguments.createArray()
    accounts.forEach { account ->
      val accountMap = Arguments.createMap()
      accountMap.putString("id", account.id)
      accountMap.putString("name", account.name)
      account.mask?.let { accountMap.putString("mask", it) }
      accountMap.putString("type", account.type)
      accountsArray.pushMap(accountMap)
    }
    map.putArray("accounts", accountsArray)

    val trackedScreensArray = Arguments.createArray()
    trackedScreens.forEach { trackedScreen ->
      val screenMap = Arguments.createMap()
      screenMap.putString("name", trackedScreen.name)
      screenMap.putString("tag", trackedScreen.tag)
      trackedScreensArray.pushMap(screenMap)
    }
    map.putArray("trackedScreens", trackedScreensArray)

    return map
  }
}
