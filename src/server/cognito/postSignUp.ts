import "source-map-support/register";
import {Context, PostConfirmationConfirmSignUpTriggerEvent } from "aws-lambda";
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();


const createItem = async (event: PostConfirmationConfirmSignUpTriggerEvent, _context: Context) => {

    let content = {
        ...event.request.userAttributes
    };

    if ({}.hasOwnProperty.call(content, 'email_verified')) {

    }

    const params = {
        TableName : 'mibarrio-users',
        Item: content
    }

    console.log(params)

    // Check if email is already registered
    let checkIfExist = {}
    try {
        checkIfExist = await docClient.get({
            TableName : 'mibarrio-users',
            Key: {
                email: content.email,
            }
        }).promise();
        console.log('chekifexist');
    } catch (err) {
        console.log('err');
        checkIfExist = err
    }

    console.log(checkIfExist);


    // Proceed to copy register to db
    let response = {};
    try {
        console.log('requesting')
        await docClient.put(params).promise();
        response = {
            content: {
                message: 'success'
            }
        }

    } catch (err) {
        response = err;
        console.log('error')
        response = {
            errors: {
                message: 'err'
            }
        }
    }

    console.log('finally')
    console.log(response)
}

export { createItem }