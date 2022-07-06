import {Context, CognitoUserPoolTriggerEvent} from "aws-lambda";
    const AWS = require('aws-sdk');
    const dynamoClient = new AWS.DynamoDB.DocumentClient();

    const usersDB = process.env.VINERESERVE_DB_USERS || '';
    if (!usersDB) { throw new Error('env var required for useresDB') } 



export const handler = async (event: CognitoUserPoolTriggerEvent, context : Context, callback: (nulo: null, event: CognitoUserPoolTriggerEvent) => void ) => {
    // TODO implement
    console.log(JSON.stringify(event, null, 4));

    try {
        if (event.triggerSource ===  'PreSignUp_SignUp') {
            const payload = {
                username: event.userName,
                email: event.request.userAttributes.email,
                emailVerified: false,
                role: event.request.userAttributes['custom:role'],
            };

            const params = {
                TableName : usersDB,
                Item: payload,
            }

            await dynamoClient.put(params).promise();

        } else if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
            const params = {
                TableName: usersDB,
                Key: { username: event.userName },
                ExpressionAttributeNames: { "#emailVerified": "emailVerified" },
                UpdateExpression: "set #emailVerified = :p",
                ExpressionAttributeValues: {
                  ":p": event.request.userAttributes.email_verified,
                },
            };

            await dynamoClient.update(params).promise();

            
        } else {
            throw new Error(`Unhandled event source: ${event.triggerSource}`)
        }

    } catch(error) {
        console.log(error);
    }

    callback(null, event);
};
