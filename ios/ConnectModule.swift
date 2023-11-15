import ExpoModulesCore
import MoneyKit

struct Configuration: Record {
    @Field var linkSessionToken: String
}

public class ConnectModule: Module {

    // MARK: - Private properties

    private var linkHandler: MKLinkHandler?

    private let onSuccess = "onSuccess"
    private let onEvent = "onEvent"
    private let onExit = "onExit"

    // MARK: - Public functions

    public func definition() -> ModuleDefinition {
        Name("Connect")

        Events(
            onSuccess,
            onEvent,
            onExit
        )

        AsyncFunction("presentInstitutionSelectionFlow") { (value: Configuration) in
            self.linkHandler = self.createLinkHandler(for: value.linkSessionToken)

            guard let currentViewcontroller = appContext?.utilities?.currentViewController() else { 
                throw MissingCurrentViewControllerException()
            }

            self.linkHandler?.presentInstitutionSelectionFlow(using: .modal(presentingViewController: currentViewcontroller))
        }
        .runOnQueue(.main)

        AsyncFunction("presentLinkFlow") { (value: Configuration) in
            self.linkHandler = self.createLinkHandler(for: value.linkSessionToken)

            guard let currentViewcontroller = appContext?.utilities?.currentViewController() else {
                throw MissingCurrentViewControllerException()
            }

            self.linkHandler?.presentLinkFlow(on: currentViewcontroller)
        }
        .runOnQueue(.main)

         AsyncFunction("continueFlow") { (from: String) in
            guard let url = URL(string: from) else {
                throw InvalidOauthURLException()
            }

            self.linkHandler?.continueFlow(from: url)
        }
        .runOnQueue(.main)
    }

    // MARK: - Private functions

    private func createLinkHandler(for linkSessionToken: String) -> MKLinkHandler? {
        do {
            let linkConfiguration =  try MKConfiguration(
                sessionToken: linkSessionToken,
                onSuccess: handleConnectSuccess(successType:),
                onExit: handleConnectExit(error:),
                onEvent: handleConnectEvent(event:)
            )

            return MKLinkHandler(configuration: linkConfiguration)
        } catch let error {
            sendEvent(self.onExit)
            return nil
        }
    }

    private func handleConnectSuccess(successType: MKLinkSuccessType) {
        switch successType {
        case let .linked(linkedInstitution):
            self.sendEvent(self.onSuccess, [
                "institution": linkedInstitution.institution.dictionary,
                "accounts": linkedInstitution.accounts.dictionary,
                "token": linkedInstitution.token.dictionary,
                "trackedScreens": linkedInstitution.trackedScreens.dictionary
            ])
        case let .relinked(relinkedInstitution):
            self.sendEvent(self.onSuccess, [
                "institution": relinkedInstitution.institution.dictionary,
                "accounts": relinkedInstitution.accounts.dictionary,
                "trackedScreens": relinkedInstitution.trackedScreens.dictionary
            ])
        @unknown default:
            break
        }
    }

    private func handleConnectExit(error: MKLinkError?) {
        if let error = error {
            sendEvent(self.onExit, [
                "identifier": error.identifier,
                "displayedMessage": error.displayedMessage,
                "requestId": error.requestId
            ])
        } else {
            sendEvent(self.onExit)
        }
    }

    private func handleConnectEvent(event: MKLinkEvent) {
        sendEvent(self.onEvent, [
            "name": event.name,
            "sessionId": event.sessionId,
            "properties": event.properties
        ])
    }
}

extension Encodable {
    var dictionary: [String: Any]? {
        guard let data = try? JSONEncoder().encode(self) else { return nil }
        return (try? JSONSerialization.jsonObject(with: data, options: .allowFragments)).flatMap { $0 as? [String: Any] }
    }
}
