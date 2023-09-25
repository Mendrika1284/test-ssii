"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtHeaders = exports.renewJwt = exports.retrieveJwt = exports.verifyJwt = exports.extractAccessToken = exports.JwtType = void 0;
const cookie_1 = __importDefault(require("cookie"));
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var JwtType;
(function (JwtType) {
    JwtType["Bearer"] = "Bearer";
    JwtType["Cookie"] = "Cookie";
})(JwtType = exports.JwtType || (exports.JwtType = {}));
const JWT_OPTIONS = {
    expiresIn: config_1.default.get("moleculer.$settings.gateway.token.expiresIn"),
    audience: config_1.default.get("moleculer.$settings.gateway.token.audience"),
    issuer: config_1.default.get("moleculer.$settings.gateway.token.issuer"),
};
const COOKIE_OPTIONS = config_1.default.get("moleculer.$settings.gateway.cookie");
const COOKIE_NAME = config_1.default.get("moleculer.$settings.gateway.token.cookieName");
const JWT_MAX_AGE = config_1.default.get("moleculer.$settings.gateway.token.maxAge");
const JWT_SECRET = config_1.default.get("moleculer.$settings.gateway.token.secret");
/**
 * This method allow to retrieve Type and AccessToken from request headers.
 *
 * We manage both Cookie and Authorization header with JWT Bearer.
 *
 * @param req API request
 * @return [type, accessToken] type is Bearer or cookie, accessToken is a JWT token
 *
 */
const extractAccessToken = (req) => {
    let token;
    let auth;
    switch (false) {
        case !("authorization" in req.headers):
            // Manage Authentication with JWT Bearer Header Authentication
            auth = req.headers.authorization;
            if (auth) {
                token = auth.split(/\s+/);
            }
            break;
        case !("cookie" in req.headers):
            // Manage Authentication with cookie propagation
            if (typeof req.headers.cookie === "string") {
                const cookies = cookie_1.default.parse(req.headers.cookie);
                token = [];
                token[0] = JwtType.Cookie;
                token[1] = cookies[COOKIE_NAME];
            }
    }
    return token !== null && token !== void 0 ? token : [];
};
exports.extractAccessToken = extractAccessToken;
/**
 * This method verify JWT (secret & expiration) and throw exception is jwt is invalid
 *
 * @param accessToken Jwt Token
 * @return user MetaUser Decoded JWT Token
 *
 */
const verifyJwt = (accessToken) => {
    // JWT validation
    return jsonwebtoken_1.default.verify(accessToken, JWT_SECRET, { maxAge: JWT_MAX_AGE });
};
exports.verifyJwt = verifyJwt;
/**
 * This method verify JWT (secret & expiration) and return User or null if invalid.
 * It doesn't throw exception.
 *
 * @param accessToken Jwt Token
 * @return user MetaUser Decoded JWT Token, or null if invalid or incorrect
 *
 */
const retrieveJwt = (req) => {
    // Retrieve access Token
    const [, accessToken] = (0, exports.extractAccessToken)(req);
    try {
        return (0, exports.verifyJwt)(accessToken);
    }
    catch (e) {
        // Do not throw exception
        return null;
    }
};
exports.retrieveJwt = retrieveJwt;
/**
 * This method renew Token with current date + delay
 *
 * @param user MetaUser Current decoded JWT Token
 * @return jwtToken MetaUser New encoded JWT token
 *
 */
const renewJwt = (metaUser) => {
    // Renew Token with current date + delay
    const payload = { id: metaUser.id, username: metaUser.username, scope: metaUser.scope };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, JWT_OPTIONS);
};
exports.renewJwt = renewJwt;
/**
 * This method format Http Headers to propagate to Http Client
 *
 * @param type Jwt Type
 * @param accessToken Jwt Token
 * @return user MetaUser Decoded JWT Token
 *
 */
const getJwtHeaders = (type, accessToken) => {
    if (JwtType.Cookie === type) {
        // Propagation for Cookie
        const setCookie = cookie_1.default.serialize(COOKIE_NAME, accessToken, COOKIE_OPTIONS);
        return {
            "Set-Cookie": setCookie,
        };
    }
    else {
        return {
            authorization: "Bearer " + accessToken,
        };
    }
};
exports.getJwtHeaders = getJwtHeaders;
//# sourceMappingURL=jwt-token.js.map