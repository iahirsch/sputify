<template>

    <head>
        <title>Spütify Login</title>
        <link rel="icon" href="assets/favicon.ico" type="image/x-icon">
    </head>

    <body>
        <div class="container">
            <div>
                <h1>SPUTIFY</h1>
            </div>
            <div>
                <p>Discover your music DNA.</p>
            </div>
            <div class="intro">
                <p>Let your Spotify data speak for you and get unique visualizations of your favorite artists and songs.
                    Immerse yourself in your personal music history.</p>
            </div>
            <div>
                <button @click="authorize" class="button">CONNECT TO SPOTIFY</button>
            </div>
            <div>
                <img src="../assets/bubble_dark.png" alt="bubble-black-and-white" class="bubbleBlackWhite" />
            </div>
        </div>
    </body>

</template>

<script>
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
            let response = await fetch('http://localhost:3000/api/spotify/authorize', { credentials: 'include' })
            let data = await response.json()
            console.log(data)
            console.log(response)
            window.location.href = data.url;
        }
    }
};
</script>
<style scoped>
body {
    overflow: hidden;
}

h1 {
    font-weight: 700;
    font-style: normal;
    font-size: 4rem;
    background: linear-gradient(90deg, #1DB954 0%, #4DD4AC 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-color: #000000;
    color: #ffffff;
    height: 100vh;
    width: 100vw;
}

.intro {
    font-size: 1rem;
    width: 40vw;
    padding-bottom: 5vh;
}

.bubbleBlackWhite {
    padding-top: 10vh;
    width: auto;
    height: 70vh;
}

.button {
    cursor: pointer;
    background-color: #1DB954;
    justify-content: center;
    align-items: center;
    border-radius: 5rem;
    padding: 1.5rem 3rem;
    border: none;
    transition-duration: 0.4s;
    font-size: 1rem;
    font-weight: 900;
}

.button:hover {
    background-color: #4DD4AC;
    transform: scale(1.1);
}
</style>
