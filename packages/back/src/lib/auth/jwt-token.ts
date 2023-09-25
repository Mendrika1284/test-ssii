import cookie, { CookieSerializeOptions } from "cookie";
import { IncomingMessage } from "connect";
import config from "config";
import jsonWebToken, { SignOptions } from "jsonwebtoken";
import { MetaUser, Payload } from "@edmp/api";

export enum JwtType {
  Bearer = "Bearer",
  Cookie = "Cookie",
}

const JWT_OPTIONS: SignOptions = {
  expiresIn: config.get("moleculer.$settings.gateway.token.expiresIn"),
  audience: config.get("moleculer.$settings.gateway.token.audience"),
  issuer: config.get("moleculer.$settings.gateway.token.issuer"),
};

const COOKIE_OPTIONS: CookieSerializeOptions = config.get("moleculer.$settings.gateway.cookie");

const COOKIE_NAME: string = config.get("moleculer.$settings.gateway.token.cookieName");
const JWT_MAX_AGE: string = config.get("moleculer.$settings.gateway.token.maxAge");
const JWT_SECRET: string = config.get("moleculer.$settings.gateway.token.secret");

/**
 * This method allow to retrieve Type and AccessToken from request headers.
 *
 * We manage both Cookie and Authorization header with JWT Bearer.
 *
 * @param req API request
 * @return [type, accessToken] type is Bearer or cookie, accessToken is a JWT token
 *
 */
export const extractAccessToken = (req: IncomingMessage): string[] => {
  let token;
  let auth;

  switch (false) {
    case !("authorization" in req.headers):
      // Manage Authentication with JWT Bearer Header Authentication
      auth = req.headers.authorization as string;
      if (auth) {
        token = auth.split(/\s+/);
      }
      break;
    case !("cookie" in req.headers):
      // Manage Authentication with cookie propagation
      if (typeof req.headers.cookie === "string") {
        const cookies = cookie.parse(req.headers.cookie);
        token = [];
        token[0] = JwtType.Cookie;
        token[1] = cookies[COOKIE_NAME];
      }
  }
  return token ?? [];
};

/**
 * This method verify JWT (secret & expiration) and throw exception is jwt is invalid
 *
 * @param accessToken Jwt Token
 * @return user MetaUser Decoded JWT Token
 *
 */
export const verifyJwt = (accessToken: string): MetaUser => {
  // JWT validation
  return jsonWebToken.verify(accessToken, JWT_SECRET, { maxAge: JWT_MAX_AGE }) as MetaUser;
};

/**
 * This method verify JWT (secret & expiration) and return User or null if invalid.
 * It doesn't throw exception.
 *
 * @param accessToken Jwt Token
 * @return user MetaUser Decoded JWT Token, or null if invalid or incorrect
 *
 */
export const retrieveJwt = (req: IncomingMessage): MetaUser | null => {
  // Retrieve access Token
  const [, accessToken] = extractAccessToken(req);

  try {
    return verifyJwt(accessToken);
  } catch (e) {
    // Do not throw exception
    return null;
  }
};
/**
 * This method renew Token with current date + delay
 *
 * @param user MetaUser Current decoded JWT Token
 * @return jwtToken MetaUser New encoded JWT token
 *
 */
export const renewJwt = (metaUser: MetaUser): string => {
  // Renew Token with current date + delay
  const payload: Payload = { id: metaUser.id, username: metaUser.username, scope: metaUser.scope };
  return jsonWebToken.sign(payload, JWT_SECRET, JWT_OPTIONS);
};

/**
 * This method format Http Headers to propagate to Http Client
 *
 * @param type Jwt Type
 * @param accessToken Jwt Token
 * @return user MetaUser Decoded JWT Token
 *
 */
export const getJwtHeaders = (type: string, accessToken: string): Record<string, string> => {
  if (JwtType.Cookie === type) {
    // Propagation for Cookie
    const setCookie = cookie.serialize(COOKIE_NAME, accessToken, COOKIE_OPTIONS);
    return {
      "Set-Cookie": setCookie,
    };
  } else {
    return {
      authorization: "Bearer " + accessToken,
    };
  }
};
