import {APIGatewayEvent} from "aws-lambda";
const AWS = require('aws-sdk');
    AWS.config.update({region: 'us-east-1'});

    const client = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});
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

export const handler = async (event: APIGatewayEvent) => {
    // TODO implement
    console.log(JSON.stringify(event, null, 4));

    const headers =  {
        "Access-Control-Allow-Origin": event.headers.origin,
        "Content-Type": "application/json",
        'Access-Control-Allow-Credentials': true,
    };

    
    try {
        if (!event) {
            throw new Error('Internal Error, No auth context');
        }

        let userInfo;

        let userInfoObject;
        if (event.headers.Cookie) {
            const accesToken = event.headers.Cookie.match(/(?<=mibarrio_tk=)[^;\s$]+/);

            if (accesToken) {
                const gerUserParams = {
                    AccessToken: accesToken[0]
                };

                try {
                    userInfo = await client.getUser(gerUserParams).promise();
                } catch (error) {
                    throw new Error(error);
                }
            
                if (userInfo.UserAttributes) {
                    userInfoObject = userInfo.UserAttributes.reduce((a: {}, v:{Name: string, Value: string}) => ({ ...a, [v.Name]: v.Value}), {});
                    userInfoObject['username'] = userInfo['Username'];
                }

            } else {
                throw new Error('Not found valid cookie value for token');
            }
        } else {
            throw new Error('"Cookie" is not presente in headers');
        }

        const response = {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                ...userInfoObject,
            })
        };
        return response;

    } catch(error) {
        const errorObject = {
            message: error.message,
            time: event.requestContext.requestTime,
            requestId: event.requestContext.requestId,
            statusCode: 400,
        };

        return errorResponse(errorObject, headers);
    }


};
