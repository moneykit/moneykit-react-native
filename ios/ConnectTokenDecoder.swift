import Foundation

struct ConnectTokenDecoder {

    struct JWTToken {
        let header: [String: Any]
        let body: [String: Any]
        let signature: String?
        let string: String
    }

    // MARK: - Private properties

    private let jwtString: String

    // MARK: - Static functions

    static func decodeToken(_ jwt: String) throws -> JWTToken {
        let parts = jwt.components(separatedBy: ".")

        guard parts.count == 3 else { throw MalformedLinkSessionTokenException() }

        let header = try decodeJWTPart(parts[0])
        let body = try decodeJWTPart(parts[1])
        let signature = parts[2]

        return JWTToken(
            header: header,
            body: body,
            signature: signature,
            string: jwt
        )
    }

    // MARK: - Private functions

    private static func base64Decode(_ value: String) -> Data? {
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

    private static func decodeJWTPart(_ value: String) throws -> [String: Any] {
        guard let bodyData = base64Decode(value) else {
            throw MalformedLinkSessionTokenException()
        }

        guard let json = try? JSONSerialization.jsonObject(with: bodyData, options: []), let payload = json as? [String: Any] else {
            throw MalformedLinkSessionTokenException()
        }

        return payload
    }
}
