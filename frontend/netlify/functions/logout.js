exports.handler = async function (event, context) {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Credentials': 'true',
            'Set-Cookie': 'spotify_auth_state=; HttpOnly; Max-Age=0'
        },
        body: JSON.stringify({ message: 'Logged out' })
    };
};