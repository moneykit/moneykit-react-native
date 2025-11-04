import Foundation

internal enum ConnectError: LocalizedError {
    case missingCurrentViewController
    case invalidOauthURL
    case malformedLinkSessionToken

    var errorDescription: String? {
        switch self {
        case .missingCurrentViewController:
            return "Cannot determine currently presented view controller"
        case .invalidOauthURL:
            return "`continueFlow` called with invalid OAuth URL"
        case .malformedLinkSessionToken:
            return "Malformed link session token"
        }
    }
}
