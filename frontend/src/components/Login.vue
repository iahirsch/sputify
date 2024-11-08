<template>
    <div>
        <h1>Login</h1>
        <p>{{ message }}</p>
        <button @click="authorize">Authorize with Spotify</button>
    </div>
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
            let response = await fetch('http://localhost:3000/api/spotify/authorize', {credentials: 'include'})
            let data = await response.json()
            console.log(data)
            console.log(response)
            window.location.href = data.url;
        }
    }
};
</script>

<style scoped>
h1 {
    color: #42b983;
}
</style>