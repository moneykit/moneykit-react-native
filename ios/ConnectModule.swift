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

            if self.requiresInstitutionSelection(for: value.linkSessionToken) {
                self.linkHandler?.presentInstitutionSelectionFlow(using: .modal(presentingViewController: currentViewcontroller))
            } else {
                self.linkHandler?.presentLinkFlow(on: currentViewcontroller)
            }
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
            "meta": event.meta,
            "properties": event.properties
        ])
    }

    private func requiresInstitutionSelection(for token: String) -> Bool {
        let parts = token.components(separatedBy: ".")

        if let header = self.decodeJWTPart(parts[0]) {
            return header["institution_id"] as? String == nil
        } else {
            return true
        }
    }

    private func base64Decode(_ value: String) -> Data? {
        var base64 = value
            .replacingOccurrences(of: "-", with: "+")
            .replacingOccurrences(of: "_", with: "/")
        let length = Double(base64.lengthOfBytes(using: String.Encoding.utf8))
        let requiredLength = 4 * ceil(length / 4.0)
        let paddingLength = requiredLength - length
        if paddingLength > 0 {
            let padding = "".padding(toLength: Int(paddingLength), withPad: "=", startingAt: 0)
            base64 += padding
        }
        return Data(base64Encoded: base64, options: .ignoreUnknownCharacters)
    }

    private func decodeJWTPart(_ value: String) -> [String: Any]? {
        guard let bodyData = base64Decode(value),
              let json = try? JSONSerialization.jsonObject(with: bodyData, options: []), 
              let payload = json as? [String: Any] else {
            return nil
        }

        return payload
    }

    private func serialize(_ object: Codable) -> [String: Any]? {
        guard let data = try? JSONEncoder().encode(object) else { return nil }

        return (try? JSONSerialization.jsonObject(with: data, options: .allowFragments)).flatMap { $0 as? [String: Any] }
    }
}
