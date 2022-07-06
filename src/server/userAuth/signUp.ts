import {APIGatewayEvent } from "aws-lambda";
    const AWS = require('aws-sdk');
    AWS.config.update({region: 'us-east-1'});

    const client = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});
    const cognitoClientID = process.env.VINERESERVE_COGNITO_CLIENTID || '';
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



export const handler = async (event: APIGatewayEvent ) => {
    console.log(1);
    const headers =  {
        "Access-Control-Allow-Origin": event.headers.origin,
        "Content-Type": "application/json",
        'Access-Control-Allow-Credentials': true,
    };

    let bodyData: { type: string, username: string, password: undefined|string, email: undefined|string, verificationCode: undefined|string };

    try {
        if (event.body) { bodyData = JSON.parse(event.body) }
        else { throw new Error('Payload is not present in request') }

        console.log('event.body');
        console.log(event.body);
        console.log(JSON.stringify(event.body, null, 4));
        console.log(JSON.stringify(bodyData, null, 4));


        let signUpSuccess;
  
        if ( bodyData.type === 'signup' ) {
            if (bodyData.password && bodyData.email) {
                const params = {
                    ClientId: cognitoClientID,
                    Password: bodyData.password,
                    Username: bodyData.username,
                    UserAttributes: [
                        {
                            Name: 'email',
                            Value: bodyData.email,
                        },
                        {
                            Name: 'custom:role',
                            Value: 'user',
                        },
                    ]
                };

                signUpSuccess = await client.signUp(params).promise();

            } else {
                throw new Error('Not was provided email or password properties in payload');
            }

        } else if ( bodyData.type === 'verification' && bodyData.verificationCode ) {
            const params = {
                ClientId: cognitoClientID,
                ConfirmationCode: bodyData.verificationCode,
                Username: bodyData.username,
                ForceAliasCreation: false,
            };

            await client.confirmSignUp(params).promise();

        } else {
            throw new Error('Invalid type of operation provided or verifcation code not provided, only "singup" or "verification"');
        }

        console.log(6);
        const response = {
            statusCode: 200,
            headers: {
                ...headers,
            },
            body: JSON.stringify(signUpSuccess),
        };

        return response;

    }  catch(error) {
        const errorObject = {
            message: error.message,
            time: event.requestContext.requestTime,
            requestId: event.requestContext.requestId,
            statusCode: 400,
        };

        return errorResponse(errorObject, headers)
    }
};

