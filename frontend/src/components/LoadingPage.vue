<template>
    <div class="loading-page">
        <div class="progress-bar">
            <div class="progress"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoadingPage'
}
</script>

<style scoped>
.loading-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: black;
    overflow: hidden;
}

.progress-bar {
    width: 50%;
    height: 10px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    overflow: hidden;
}

.progress {
    width: 0;
    height: 100%;
    background-color: white;
    animation: progress-animation 2s infinite;
}

@keyframes progress-animation {
    0% {
        width: 0;
    }

    50% {
        width: 100%;
    }

    100% {
        width: 0;
    }
}
</style>