import "source-map-support/register";
import {Context, PreSignUpTriggerEvent, Callback } from "aws-lambda";

export const defaultRole = async (event: PreSignUpTriggerEvent, _context: Context, callback: Callback ) => {
    
    interface payload {
        message: string,
    }

    const payload = {
        message: 'Hello World deployed from Serverless Framework!',
    }

    console.log(JSON.stringify(event, null, 4))
    console.log(JSON.stringify(_context, null, 4))
    
    callback(null, event);
}
