import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import authConfig from "../../config/auth_config.json";

/*
A piece of middleware. When it is used on an API endpoint,
then that endpoint will required the correct authorization token
in order for the correct response to be returned by the endpoint.
*/
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
});

export default checkJwt;
