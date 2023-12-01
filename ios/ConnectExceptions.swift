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

internal class MalformedLinkSessionTokenException: Exception {
    override var reason: String {
        "Malformed link session token"
    }
}

internal class InvalidLinkSessionTokenException: Exception {
    override var reason: String {
        "Invalid link session token"
    }
}