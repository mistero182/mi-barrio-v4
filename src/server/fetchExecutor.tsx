const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*'
}

const post = async function (url: string, body: any) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(body),
        headers: headers
    });
    return await response.json();
};

const get = async function (url: string) {
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });
    return await response.json();
};

export {post, get}