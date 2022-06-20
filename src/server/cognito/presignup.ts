import "source-map-support/register";
import {Context, PreSignUpTriggerEvent, Callback } from "aws-lambda";

export const defaultRole = async (event: PreSignUpTriggerEvent, _context: Context, callback: Callback ) => {
    
    if ({}.hasOwnProperty.call(event.request.userAttributes, 'role' )) {

        // Seting role user by default if role is not provided
        event.request.userAttributes['role'] = 'user'
    }

    callback(null, event);
}
