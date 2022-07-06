import {APIGatewayEvent} from "aws-lambda";
    const AWS = require('aws-sdk');
    AWS.config.update({region: 'us-east-1'});

    const dynamoClient = new AWS.DynamoDB.DocumentClient();
    const cognitoClient = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

    const sessionsDB = process.env.VINERESERVE_DB_SESSIONS || '';
    const cognitoClientID = process.env.VINERESERVE_COGNITO_CLIENTID || '';
    if (!sessionsDB) { throw new Error('env var required for sessionsDB') } 
    if (!cognitoClientID) { throw new Error('env var required for cognitoClientID') };

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

    type saveSsesionData = { username: string, jti: string, accessToken: string, refreshToken: string, expiresIn: string };
    async function saveSession( data: saveSsesionData ) {
        const params = {
            TableName : sessionsDB,
            Item: {
                ...data,
            }
        }

        let result = await dynamoClient.put(params).promise();
        return result;
    }

export const handler = async (event: APIGatewayEvent) => {
    const headers =  {
        "Access-Control-Allow-Origin": event.headers.origin,
        // "Access-Control-Allow-Origin": 'https://vinereserveclub.smartssi.com',
        "Content-Type": "application/json",
        'Access-Control-Allow-Credentials': true,
    };

    
    try {
        let bodyData: { username: string, password: string }

        if (event.body) { bodyData = JSON.parse(event.body) }
        else { throw new Error('Payload is not present in request') }
    

        // Get Token from Cognito UserPool
        const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: cognitoClientID,
        AuthParameters: {
            "USERNAME": bodyData.username,
            "PASSWORD": bodyData.password,
        }
        };

        let tokensData;
        try {
            tokensData = await cognitoClient.initiateAuth(params).promise();
        } catch (error) {
            throw new Error(error);
        }

        if (!tokensData.AuthenticationResult) {
            throw new Error('Bad response from authentification server, "AuthenticationResult" props is not present in response');
        }

        const { AuthenticationResult } = tokensData;

        if (!AuthenticationResult.AccessToken || !AuthenticationResult.RefreshToken || !AuthenticationResult.IdToken) {
            throw new Error('Bad response from authentification server, No tokens presentes in "AuthenticationResult" prop');
        }

        const { AccessToken, RefreshToken, IdToken, ExpiresIn: TokensExpiresIn } = AuthenticationResult;

    // ------------- Gettin User Data from COGNITO

        let userInfo;

        const gerUserParams = {
            AccessToken
        };

        try {
            userInfo = await cognitoClient.getUser(gerUserParams).promise();
        } catch (error) {
            throw new Error(error);
        }

        let userInfoObject;
        if (userInfo.UserAttributes) {
            userInfoObject = userInfo.UserAttributes.reduce((a: {}, v:{Name: string, Value: string}) => ({ ...a, [v.Name]: v.Value}), {});
            userInfoObject['username'] = userInfo['Username'];
        }

    // ---------------  SAVE SESSION in dynamoDB

        const [,accessPayload] = AccessToken.split('.');

        let accessPayloadBuff = Buffer.from(accessPayload.replace(/\./g, ''), 'base64');
        let accessPayloadText = accessPayloadBuff.toString('ascii');

        const payloadTokenData = JSON.parse(accessPayloadText);

        await saveSession({ jti: payloadTokenData.origin_jti, accessToken: AccessToken, refreshToken: RefreshToken, expiresIn: TokensExpiresIn, username: userInfoObject.username })

        let date = new Date();
        date.setTime(+ date + (TokensExpiresIn * 400)); // seconds * 100 = miliseconds

    // ---------------  RESPONSE

        const response = {
            statusCode: 200,
            headers: {
                ...headers,
                // "Set-Cookie":  "mibarrio_tk="+tokensData.AuthenticationResult.IdToken+"; domain=apo.ocuba.net; expires="+date.toGMTString()+"; HttpOnly;",
                // "Set-Cookie":  "mibarrio_tk="+tokensData.AuthenticationResult.IdToken+"; domain=apo.ocuba.net; path=/; HttpOnly;",
                "Set-Cookie":  "mibarrio_tk="+tokensData.AuthenticationResult.AccessToken+"; domain=apo.ocuba.net; path=/; Secure; SameSite=None",
            },
            body: JSON.stringify({
                ...userInfoObject,
                ...tokensData
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

        return errorResponse(errorObject, headers)
    }



};

