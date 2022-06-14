import {Context, APIGatewayEvent, APIGatewayProxyResultV2} from "aws-lambda";

const authCognito = async (event: APIGatewayEvent, _context: Context) => {
    
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

export default authCognito