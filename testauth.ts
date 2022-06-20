import {Context, APIGatewayEvent, APIGatewayProxyResultV2} from "aws-lambda";

export const test = async (event: APIGatewayEvent, _context: Context) => {
    console.log('email context');
    console.log(JSON.stringify(event, null, 4));
    console.log(JSON.stringify(_context, null, 4))

    interface payload {
        message: string,
    }

    const payload = {
        message: 'Hello World deployed from Serverless Framework!',
    }

    const payloadStringify = JSON.stringify( payload, null, 2);

    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        statusCode: 200,
        body: payloadStringify
    };
}
