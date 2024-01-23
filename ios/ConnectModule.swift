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
        } catch let error as MKConfiguration.ConfigurationError {
            sendEvent(self.onExit, [
                "identifier": error.identifier,
                "displayedMessage": error.localizedDescription,
                "requestId": nil
            ])
            return nil
        } catch {
            sendEvent(self.onExit, [
                "identifier": "unknown",
                "displayedMessage": "Session token malformed",
                "requestId": nil
            ])
            return nil
        }
    }

    private func handleConnectSuccess(successType: MKLinkSuccessType) {
        switch successType {
        case let .linked(linkedInstitution):
            self.sendEvent(self.onSuccess, self.serialize(linkedInstitution) ?? [:])
        case let .relinked(relinkedInstitution):
            self.sendEvent(self.onSuccess, self.serialize(relinkedInstitution) ?? [:])
        @unknown default:
            break
        }
    }

    private func handleConnectExit(error: MKLinkError?) {
        if let error = error {
            sendEvent(self.onExit, [
                "identifier": error.errorId,
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
            "meta": event.meta,
            "properties": event.properties
        ])
    }

    private func serialize(_ object: Codable) -> [String: Any]? {
        guard let data = try? JSONEncoder().encode(object) else { return nil }

        return (try? JSONSerialization.jsonObject(with: data, options: .allowFragments)).flatMap { $0 as? [String: Any] }
    }
}
