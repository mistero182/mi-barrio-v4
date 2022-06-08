import "source-map-support/register";
import {Context, APIGatewayEvent, APIGatewayProxyResultV2} from "aws-lambda";
import {findAll, insertDocument} from "./src/server/services/NewsLetter";
import dbConnect from "./src/server/database";
const dbInstance = null

export const serve = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResultV2> => {
    try {
        const path = event.path
        console.log("PATH::", path)
        if (path.includes('/newsletters/')) {
            const db = await dbConnect(dbInstance)
            let response: any;
            if (path === "/newsletters/create") {
                response = await insertDocument(JSON.parse(event.body), db)
            } else {
                response = await findAll(db)
            }
            console.log(response)
            return {
                statusCode: 200,
                headers: {
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': false,
                },
                body: JSON.stringify(response),
            };
        } else {
            const render = (await import("./src/server/render")).default;
            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "text/html",
                },
                body: await render(event),
            };
        }
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