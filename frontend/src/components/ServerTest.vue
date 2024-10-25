<template>
    <div>
        <h1>Server Test</h1>
        <p>{{ message }}</p>
        <button @click="fetchMessage">Test Server</button>
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
        }
    }
};
</script>

<style scoped>
h1 {
    color: #42b983;
}
</style>