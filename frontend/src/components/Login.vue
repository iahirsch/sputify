<template>
    <div>
        <h1>Login</h1>
        <p>{{ message }}</p>
        <button @click="authorize">Authorize with Spotify</button>
    </div>
</template>

<script>
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
export default {
    data() {
        return {
            message: ''
        };
    },
    methods: {
        async fetchMessage() {
            try {
                const response = await fetch('http://localhost:3000/');
                const text = await response.text();
                this.message = text;
            } catch (error) {
                this.message = 'Error fetching message from server';
            }
        },
        async authorize() {
            const clientId = "003e413536ef443289571ec1bd987207";
            const redirectUri = 'http://localhost:5173/journey';

            const scope = 'streaming user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state playlist-read-private playlist-read-collaborative';
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
    }
};
</script>

<style scoped>
h1 {
    color: #42b983;
}
</style>