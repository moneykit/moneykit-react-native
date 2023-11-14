import ExpoModulesCore

internal class MissingCurrentViewControllerException: Exception {
    override var reason: String {
        "Cannot determine currently presented view controller"
    }
}

internal class InvalidOauthURLException: Exception {
    override var reason: String {
        "`continueFlow` called with invalid OAuth URL"
    }
}