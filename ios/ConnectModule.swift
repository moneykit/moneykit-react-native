import ExpoModulesCore
import MoneyKit

struct Configuration: Record {
    @Field var linkSessionToken: String
}

public class ConnectModule: Module {

    // MARK: - Private properties

    private var linkHandler: MKLinkHandler?

    private let onSuccessEventName = "onSuccess"
    private let onExitEventName = "onExit"

    // MARK: - Public functions

    public func definition() -> ModuleDefinition {
        Name("Connect")

        Events(
            onSuccessEventName,
            onExitEventName
        )

        AsyncFunction("presentInstitutionSelectionFlow") { (value: Configuration) in
            self.linkHandler = self.createLinkHandler(for: value.linkSessionToken)

            guard let currentViewcontroller = appContext?.utilities?.currentViewController() else { return }

            self.linkHandler?.presentInstitutionSelectionFlow(using: .modal(presentingViewController: currentViewcontroller))
        }
        .runOnQueue(.main)

        AsyncFunction("presentLinkFlow") { (value: Configuration) in
            self.linkHandler = self.createLinkHandler(for: value.linkSessionToken)

            guard let currentViewcontroller = appContext?.utilities?.currentViewController() else { return }

            self.linkHandler?.presentLinkFlow(on: currentViewcontroller)
        }
        .runOnQueue(.main)
    }

    // MARK: - Private functions

    private func createLinkHandler(for linkSessionToken: String) -> MKLinkHandler? {
        do {
            let linkConfiguration =  try MKConfiguration(
                sessionToken: linkSessionToken,
                onSuccess: { [weak self] successType in
                    guard let self = self else { return }

                    switch successType {
                    case let .linked(linkedInstitution):
                        self.sendEvent(self.onSuccessEventName, [
                            "institution_id": linkedInstitution.institution.id
                        ])
                    case let .relinked(relinkedInstitution):
                        self.sendEvent(self.onSuccessEventName, [
                            "institution_id": relinkedInstitution.institution.id
                        ])
                    @unknown default:
                        break
                    }
                },
                onExit: {
                    self.sendEvent(self.onExitEventName)
                }
            )

            return MKLinkHandler(configuration: linkConfiguration)
        } catch let error {
            print("Configuration error - \(error.localizedDescription)")

            return nil
        }
    }
}
