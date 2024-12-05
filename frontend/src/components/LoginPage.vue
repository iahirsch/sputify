<template>

    <head>
        <title>Spütify Login</title>
        <link rel="icon" href="assets/favicon.ico" type="image/x-icon">
    </head>

    <body>
        <div class="container">
            <div>
                <img class="logo" src="../assets/spütify_logo.png" />
            </div>
            <div class="intro">
                <h2>Discover Your Music Journey.</h2>
                <p>Let your Spotify data speak for you and get unique visualizations of your favorite songs.
                <br>See how your taste has evolved over the years.</p>
            </div>
            <div>
                <button @click="authorize" class="button">
                    <p>Connect to Spotify</p>
                </button>
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
            try {
                const response = await fetch('http://localhost:3000/authorize', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    console.log(response);
                    window.location.href = data.url;
                } else {
                    console.error('Error authorizing with Spotify:', response.statusText);
                }
            } catch (error) {
                console.error('Error authorizing with Spotify:', error);
            }
        }
    }
};
</script>

<style scoped>
body {
    overflow: hidden;
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
    font-size: 1.2rem;
    width: 80vw;
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
    border: none;
    transition-duration: 0.4s;
}

.button:hover {
    background-color: #4DD4AC;
    transform: scale(1.1);
}

.logo {
    position: relative;
    width: 400px;
    max-width: 80vw;
    padding-top: 10vh;
    padding-bottom: 5vh;
}
</style>
