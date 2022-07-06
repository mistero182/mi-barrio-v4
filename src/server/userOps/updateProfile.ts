import {APIGatewayEvent} from "aws-lambda";
    const AWS = require('aws-sdk');
    AWS.config.update({region: 'us-east-1'});

    const dynamoClient = new AWS.DynamoDB.DocumentClient();
    const cognitoClient = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

    const sessionsDB = process.env.VINERESERVE_DB_SESSIONS || '';
    const cognitoClientID = process.env.VINERESERVE_COGNITO_CLIENTID || '';
    const usersDB = process.env.VINERESERVE_DB_USERS || '';
    if (!sessionsDB) { throw new Error('env var required for sessionsDB') };
    if (!cognitoClientID) { throw new Error('env var required for cognitoClientID') };
    if (!usersDB) { throw new Error('env var required for useresDB') } ;

    type headers = {
        "Access-Control-Allow-Origin": string | undefined,
        "Content-Type": string,
        'Access-Control-Allow-Credentials': boolean,
    }

    type errorType = { message: any, time: string | undefined, requestId: string, statusCode: number }
    function errorResponse(error: errorType, headers: headers) {
        console.log(error);

        const response = {
            statusCode: 400,
            headers,
            body: JSON.stringify(error),
        }

        return response;
    }

    type tokensRefresh = {
        AccessToken: string,
        ExpiresIn: Number,
        TokenType: string,
        IdToken: string
    };

    async function checkSession(event: APIGatewayEvent, headers: headers) : Promise<tokensRefresh> {
        if (!event.headers.Cookie) {
            throw new Error('requested token is not present')
        }

        if (!event.headers.Cookie.match(/(?<=mibarrio_tk=)[^;\s$]+/)) {
            throw new Error('requested token is not present');
        }

        const token = event.headers.Cookie.match(/(?<=mibarrio_tk=)[^;\s$]+/);

        if (token && token.length > 0) {
            const { authorizer } = event.requestContext;

            if (authorizer && authorizer.username && authorizer.jti) {
                const { username, origin_jti: jti } = authorizer;

                const dynamoParams = {
                    TableName : sessionsDB,
                    Key: {
                        'username': username,
                        'jti': jti
                    }
                };

                let tokensResult;
                try {
                    tokensResult = await dynamoClient.get(dynamoParams).promise();
                } catch(error) {
                    throw new Error(error);
                }

                if (!tokensResult.Item) {
                    throw new Error('User has not a session open');
                }

                const refreshToken = tokensResult.Item.refreshToken;

                const  refreshParams = {
                    AuthFlow: 'REFRESH_TOKEN',
                    ClientId: cognitoClientID,
                    AuthParameters: {
                        'REFRESH_TOKEN': refreshToken,
                    }
                };

                let newsTokens;
                try {
                    newsTokens = await cognitoClient.initiateAuth(refreshParams).promise();
                } catch(error) {
                    if (error.message && error.message === 'Refresh Token has been revoked') {
                        throw new Error('Refresh Token has been revoked');
                    } else {
                        throw new Error(error);
                    }
                };

                const { AuthenticationResult } = newsTokens;

                if (!AuthenticationResult.AccessToken || !AuthenticationResult.IdToken) {
                    throw new Error('Bad response from authentification server, No tokens presents in "AuthenticationResult" prop');
                }

                // Saving new session
                const [,accessPayload] = AuthenticationResult.AccessToken.split('.');

                let accessPayloadBuff = Buffer.from(accessPayload.replace(/\./g, ''), 'base64');
                let accessPayloadText = accessPayloadBuff.toString('ascii');

                const payloadTokenData = JSON.parse(accessPayloadText);

                try {
                    const params = {
                        TableName : sessionsDB,
                        Item: {
                            jti: payloadTokenData.origin_jti,
                            accessToken: AuthenticationResult.AccessToken,
                            refreshToken,
                            expiresIn: AuthenticationResult.TokensExpiresIn,
                            username: username,
                        }
                    }
            
                    await dynamoClient.put(params).promise();
                }  catch (error) {
                    throw new Error(error);
                }

                return {
                    ...AuthenticationResult
                };

            } else { throw new Error('Token has not all the needed params') }
        }  else { throw new Error('requested token is not present') }
    }

export const handler = async (event: APIGatewayEvent) => {
    const { headers: reqHeaders } = event;

    const headers =  {
        "Access-Control-Allow-Origin": reqHeaders.origin,
        // "Access-Control-Allow-Origin": 'https://vinereserveclub.smartssi.com',
        "Content-Type": "application/json",
        'Access-Control-Allow-Credentials': true,
    };

    try {
        const session = await checkSession(event, headers).catch(err => {throw new Error(err.message)});

        const { AccessToken, IdToken, ExpiresIn: TokensExpiresIn } = session;




        const response = {
            statusCode: 200,
            headers: {
                ...headers,
                // "Set-Cookie":  "vrc_idtk="+data.AuthenticationResult.IdToken+"; domain=vinereserveclub.smartssi.net; expires="+date.toGMTString()+"; HttpOnly;",
                // "Set-Cookie":  "vrc_idtk="+data.AuthenticationResult.IdToken+"; domain=vinereserveclub.smartssi.net; path=/; HttpOnly;",
                // "Set-Cookie":  "vrc_idtk=revoked; domain=vinereserveclub.smartssi.net; Secure; SameSite=None",
                "Set-Cookie":  "mibarrio_tk="+AccessToken+"; domain=apo.ocuba.net; path=/; Secure; SameSite=None",
            },
            body: JSON.stringify({
                reuslt: 'revoked',
            }),
        };

        return response;

    } catch(error) {
        console.log('Catched');

        const errorObject = {
            message: error.message,
            time: event.requestContext.requestTime,
            requestId: event.requestContext.requestId,
            statusCode: 400,
        };

        return errorResponse(errorObject, headers)
    }
};

