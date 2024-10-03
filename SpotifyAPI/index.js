document.querySelector('button').addEventListener('click', authorize);

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const codeVerifier = generateRandomString(64);

const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}


const hashed = await sha256(codeVerifier)
const codeChallenge = base64encode(hashed);


async function authorize() {
    const clientId = "003e413536ef443289571ec1bd987207"; // add your clientId here from the spotify dashboard
    const redirectUri = 'http://localhost:3000/SpotifyAPI/callback.html'; // must be in the list of redirect uris in the spotify dashboard

    const scope = 'user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state playlist-read-private playlist-read-collaborative';
    const authUrl = new URL("https://accounts.spotify.com/authorize")

    // generated in the previous step
    window.localStorage.setItem('code_verifier', codeVerifier);

    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    }

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}