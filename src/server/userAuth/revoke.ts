import {APIGatewayEvent} from "aws-lambda";
    const AWS = require('aws-sdk');
    AWS.config.update({region: 'us-east-1'});

    const dynamoClient = new AWS.DynamoDB.DocumentClient();
    const cognitoClient = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

    const sessionsDB = process.env.VINERESERVE_DB_SESSIONS || '';
    const cognitoClientID = process.env.VINERESERVE_COGNITO_CLIENTID || '';
    if (!sessionsDB) { throw new Error('env var required for sessionsDB') } 
    if (!cognitoClientID) { throw new Error('env var required for cognitoClientID') }

    type headers = {
        "Access-Control-Allow-Origin": string | undefined,
        "Content-Type": string,
        'Access-Control-Allow-Credentials': boolean,
    }

    type errorType = { message: any, time: string | undefined, requestId: string, statusCode: number }
    function errorResponse(error: errorType, headers: headers) {
        console.log(error);                                         // Log Errors

        const response = {
            statusCode: 400,
            headers,
            body: JSON.stringify(error),
        }

        return response;
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
        if (!reqHeaders.Cookie) {
            throw new Error('requested token is not present')
        }

        if (!reqHeaders.Cookie.match(/(?<=mibarrio_tk=)[^;\s$]+/)) {
            throw new Error('requested token is not present');
        }

        const token = reqHeaders.Cookie.match(/(?<=mibarrio_tk=)[^;\s$]+/);

        if (token && token.length > 0) {
            const { authorizer } = event.requestContext;

            if (authorizer && authorizer.username && authorizer.origin_jti) {
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
                    throw new Error(error)
                }

                if (!tokensResult.Item) {
                    throw new Error('User has not session open');
                }

                const refreshToken = tokensResult.Item.refreshToken

                const params = {
                    ClientId: cognitoClientID,
                    Token: refreshToken,
                };

                await cognitoClient.revokeToken(params).promise();

                // Deleting old session

                await dynamoClient.delete(dynamoParams).promise();

            } else { throw new Error('Token has not all the needed params') }

        } else { throw new Error('requested token is not present') }

        const response = {
            statusCode: 200,
            headers: {
                ...headers,
                // "Set-Cookie":  "vrc_idtk="+data.AuthenticationResult.IdToken+"; domain=vinereserveclub.smartssi.net; expires="+date.toGMTString()+"; HttpOnly;",
                // "Set-Cookie":  "vrc_idtk="+data.AuthenticationResult.IdToken+"; domain=vinereserveclub.smartssi.net; path=/; HttpOnly;",
                "Set-Cookie":  "vrc_idtk=revoked; domain=vinereserveclub.smartssi.net; path=/; Secure; SameSite=None",
            },
            body: JSON.stringify({
                reuslt: 'revoked',
            }),
        };

        return response;

    } catch(error) {
        const errorObject = {
            message: error.message,
            time: event.requestContext.requestTime,
            requestId: event.requestContext.requestId,
            statusCode: 400,
        };

        errorResponse(errorObject, headers)
    }
};

