import React
import MoneyKit

@objc(Connect)
class ConnectModule: RCTEventEmitter {

    // MARK: - Private properties

    private var linkHandler: MKLinkHandler?
    private var hasListeners = false

    private let onSuccess = "onSuccess"
    private let onEvent = "onEvent"
    private let onExit = "onExit"

    // MARK: - RCTEventEmitter overrides

    override init() {
        super.init()
    }

    @objc
    override static func moduleName() -> String! {
        return "Connect"
    }

    override func supportedEvents() -> [String]! {
        return [onSuccess, onEvent, onExit]
    }

    override func startObserving() {
        hasListeners = true
    }

    override func stopObserving() {
        hasListeners = false
    }

    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    // MARK: - Public functions

    @objc
    func presentLinkFlow(_ config: NSDictionary,
                        resolver resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let linkSessionToken = config["linkSessionToken"] as? String else {
            reject("INVALID_CONFIG", "linkSessionToken is required", nil)
            return
        }

        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }

            self.linkHandler = self.createLinkHandler(for: linkSessionToken)

            guard let viewController = RCTPresentedViewController() else {
                reject("NO_VIEW_CONTROLLER", "Unable to find current view controller", nil)
                return
            }

            self.linkHandler?.presentLinkFlow(on: viewController)
            resolve(nil)
        }
    }

    @objc
    func continueFlow(_ urlString: String,
                     resolver resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let url = URL(string: urlString) else {
            reject("INVALID_URL", "Invalid OAuth URL", nil)
            return
        }

        DispatchQueue.main.async { [weak self] in
            self?.linkHandler?.continueFlow(from: url)
            resolve(nil)
        }
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
            sendEvent(withName: self.onExit, body: [
                "identifier": error.identifier,
                "displayedMessage": error.localizedDescription,
                "requestId": nil
            ])
            return nil
        } catch {
            sendEvent(withName: self.onExit, body: [
                "identifier": "unknown",
                "displayedMessage": "Session token malformed",
                "requestId": nil
            ])
            return nil
        }
    }

    private func handleConnectSuccess(successType: MKLinkSuccessType) {
        guard hasListeners else { return }

        switch successType {
        case let .linked(linkedInstitution):
            self.sendEvent(withName: self.onSuccess, body: self.serialize(linkedInstitution) ?? [:])
        case let .relinked(relinkedInstitution):
            self.sendEvent(withName: self.onSuccess, body: self.serialize(relinkedInstitution) ?? [:])
        @unknown default:
            break
        }
    }

    private func handleConnectExit(error: MKLinkError?) {
        guard hasListeners else { return }

        if let error = error {
            sendEvent(withName: self.onExit, body: [
                "identifier": error.errorId,
                "displayedMessage": error.displayedMessage,
                "requestId": error.requestId
            ])
        } else {
            sendEvent(withName: self.onExit, body: nil)
        }
    }

    private func handleConnectEvent(event: MKLinkEvent) {
        guard hasListeners else { return }

        sendEvent(withName: self.onEvent, body: [
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
