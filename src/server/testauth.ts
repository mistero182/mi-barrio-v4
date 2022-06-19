import "source-map-support/register";
import {Context, APIGatewayEvent, APIGatewayProxyResultV2} from "aws-lambda";

export const test = async (event: APIGatewayEvent, _context: Context) => {
    
    interface payload {
        message: string,
    }

    const payload = {
        message: 'Hello World deployed from Serverless Framework!',
    }

    const payloadStringify = JSON.stringify( payload, null, 2);

    return {
        statusCode: 200,
        body: payloadStringify
    };
}
