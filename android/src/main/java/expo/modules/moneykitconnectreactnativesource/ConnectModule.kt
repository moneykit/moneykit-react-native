package expo.modules.moneykitconnectreactnative

import android.content.Context
import android.net.Uri
import com.moneykit.connect.MkConfiguration
import com.moneykit.connect.MkLinkHandler
import com.moneykit.connect.core.internal.models.MkLinkSessionEventData
import com.moneykit.connect.entities.MkLinkError
import com.moneykit.connect.entities.MkLinkSuccessType
import com.moneykit.connect.entities.MkLinkedInstitution
import com.moneykit.connect.entities.MkRelinkedInstitution
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class Configuration: Record {
  @Field
  var linkSessionToken: String = ""
}

class ConnectModule : Module() {
  private val currentActivity
    get() = appContext.currentActivity ?: throw Exceptions.MissingActivity()

  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  private var linkHandler: MkLinkHandler? = null

  private val onSuccess = "onSuccess"
  private val onEvent = "onEvent"
  private val onExit = "onExit"

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('Connect')` in JavaScript.
    Name("Connect")

    // Defines event names that the module can send to JavaScript.
    Events(
      "onSuccess",
      "onEvent",
      "onExit",
    )

    AsyncFunction("presentLinkFlow") { config: Configuration ->
      linkHandler = createLinkHandler(config.linkSessionToken)

      linkHandler?.presentLinkFlow(currentActivity)
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("continueFlow") { urlString: String ->
      val url = Uri.parse(urlString)
      linkHandler?.continueFlow(context, url)
    }.runOnQueue(Queues.MAIN)
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
      sendEvent(onExit, mapOf(
//      "identifier" to error.identifier,
        "displayedMessage" to error.message,
//        "requestId" to error.requestId
      ))
      return null
    } catch (error: Exception) {
      sendEvent(onExit, mapOf(
//      "identifier" to error.identifier,
        "displayedMessage" to error.message,
//        "requestId" to error.requestId
      ))
      return null
    }
  }

  private fun handleConnectSuccess(successType: MkLinkSuccessType) {
    when (successType) {
      is MkLinkSuccessType.Linked ->
        sendEvent(onSuccess, successType.institution.toMap())

      is MkLinkSuccessType.Relinked ->
        sendEvent(onSuccess, successType.institution.toMap())
    }
  }

  private fun handleConnectExit(error: MkLinkError?) {
    if (error == null) {
      sendEvent(onExit)
      return
    }

    sendEvent(onExit, mapOf(
      "displayedMessage" to error.displayedMessage,
      "requestId" to error.requestId
    ))
  }

  private fun handleConnectEvent(event: MkLinkSessionEventData) {
    sendEvent(onEvent, mapOf(
      "name" to event.name,
      "properties" to event.properties
    ))
  }

  private fun MkLinkedInstitution.toMap() = mapOf(
    "institution" to mapOf(
      "id" to institution.id,
      "name" to institution.name,
    ),
    "token" to token.value,
    "accounts" to accounts.map { account ->
      mapOf(
        "id" to account.id,
        "name" to account.name,
        "mask" to account.mask,
        "type" to account.type,
      )
    },
    "trackedScreens" to trackedScreens.map { trackedScreen ->
      mapOf(
        "name" to trackedScreen.name,
        "tag" to trackedScreen.tag,
      )
    },
  )

  private fun MkRelinkedInstitution.toMap() = mapOf(
    "institution" to mapOf(
      "id" to institution.id,
      "name" to institution.name,
    ),
    "accounts" to accounts.map { account ->
      mapOf(
        "id" to account.id,
        "name" to account.name,
        "mask" to account.mask,
        "type" to account.type,
      )
    },
    "trackedScreens" to trackedScreens.map { trackedScreen ->
      mapOf(
        "name" to trackedScreen.name,
        "tag" to trackedScreen.tag,
      )
    },
  )
}
