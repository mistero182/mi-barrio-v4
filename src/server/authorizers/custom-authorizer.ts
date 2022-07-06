const promisify = require('util').promisify;
const Axios = require('axios');
const jsonwebtoken = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');

const verifyPromised = promisify(jsonwebtoken.verify.bind(jsonwebtoken));

    const cognitoPoolId = process.env.COGNITO_POOL_ID || '';
    if (!cognitoPoolId) {
      throw new Error('env var required for cognito pool');
    }

    const cognitoIssuer = `https://cognito-idp.us-east-1.amazonaws.com/${cognitoPoolId}`;
    let cacheKeys;
    
    const getPublicKeys = async () => {
        if (!cacheKeys) {
            console.log('No Cache keys');
            const url = `${cognitoIssuer}/.well-known/jwks.json`;
            const publicKeys = await Axios.default.get(url);
            cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
                const pem = jwkToPem(current);
                agg[current.kid] = {instance: current, pem};

                return agg;
            }, {} );

            return cacheKeys;
        } else {
            console.log('Cached keys');
            return cacheKeys;
        }
    };

    function logError(errorMessage) {
        console.log(errorMessage)
    }

    export const handler = async (request, context) => {
        console.log(JSON.stringify(context, null, 4));
        let result;

        try {
            console.log(`user claim verify invoked for ${JSON.stringify(request)}`);
            // const token = request.authorizationToken.replace('Bearer ', '');

            let error = null;
            if (!request.headers.Cookie.match(/(?<=mibarrio_tk=)[^;\s$]+/)) {
                logError('requested token is not present.')
                throw new Error('requested token is not present');
            }

            const [token] = request.headers.Cookie.match(/(?<=mibarrio_tk=)[^;\s$]+/);
            const tokenSections = (token || '').split('.');

            if (tokenSections.length < 2) {
                logError('requested token is invalid');
                throw new Error('requested token is invalid');
            }

            const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
            const header = JSON.parse(headerJSON);
            const keys = await getPublicKeys();
            const key = keys[header.kid];

            if (key === undefined) {
                logError('claim made for unknown kid')
                throw new Error('claim made for unknown kid');
            }

            const claim = await verifyPromised(token, key.pem);
            const currentSeconds = Math.floor( (new Date()).valueOf() / 1000);

            if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
                logError('claim is expired or invalid')
                throw new Error('claim is expired or invalid');
            }

            if (claim.iss !== cognitoIssuer) {
                logError('claim issuer is invalid');
                throw new Error('claim issuer is invalid');
            }

            if (claim.token_use !== 'access') {
                logError('claim use is not access');
                throw new Error('claim use is not access');
            }

            console.log(JSON.stringify(claim, null, 4));
            console.log(`claim confirmed for ${ claim.username }`);
            
            result = {
                "principalId": claim.username, // The principal user identification associated with the token sent by the client.
                "policyDocument": {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Action": "execute-api:Invoke",
                            "Effect": "Allow",
                            "Resource": request.methodArn
                        }
                    ]
                },
                "context": {
                    username: claim.username,
                    sub: claim.sub,
                    tokenType: claim.token_use,
                    exp: claim.exp,
                    auth_time: claim.auth_time,
                    iat: claim.iat,
                    jti: claim.jti,
                    origin_jti: claim.origin_jti,
                    isValid: error ? false : true,
                    message: error ? error : undefined,
                },
            }

        } catch (error) {
            console.log('error');
            console.log(error);

            result = {
                "principalId": 'Not_Allowed',
                "policyDocument": {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Action": "execute-api:Invoke",
                            "Effect": "Deny",
                            "Resource": request.methodArn
                        }
                    ]
                },
                "context": {
                    message: 'Not Found access key',
                },
            }
        }

        return result;
    };
