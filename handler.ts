import "source-map-support/register";
import {Context, APIGatewayEvent, APIGatewayProxyResultV2} from "aws-lambda";


import authCognito from "src/server/auth";


export const serve = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResultV2> => {
    try {
        const path = event.path
        console.log("PATH::", path)

        console.log('hola')
        const render = (await import("./src/server/render")).default;
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html",
            },
            body: await render(event),
        };
    } catch (error) {
        // Custom error handling for server-side errors
        // TODO: Prettify the output, include the callstack, e.g. by using `youch` to generate beautiful error pages
        console.error(error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "text/html",
            },
            body: `<html><body>${error.toString()}</body></html>`,
        };
    }
};


export const auth = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResultV2> => {
    return authCognito(event, _context)
}