<template>
    <div class="timeline-container">
        <div class="timeline-content">
            <TimelineDatapoint v-for="(title, index) in yearsTitles" :key="index"
                :positionStyle="getCirclePosition(index + 1)" :active="activeId === index.toString()" :title="title" />
        </div>
        <span class="timeline"></span>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, toRefs } from 'vue';
import TimelineDatapoint from './TimelineDatapoint.vue';

const props = defineProps({
    yearsTitles: {
        type: Array,
        required: true,
        validator: (value) => value.length > 0, //must be a non-empty array. If an empty array is passed, Vue will issue a warning in the console.
    },
});

const { yearsTitles } = toRefs(props);

const getCirclePosition = (index) => {
    const position = (index - 1) / (yearsTitles.value.length - 1) * 100;
    return { top: `${position}%` };
};

const activeId = ref(0);
let observer;

onMounted(() => {
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                activeId.value = entry.target.id;
            }
        });
    }, {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    });

    document.querySelectorAll('.journey-sections').forEach((section) => {
        observer.observe(section);
    });
});

onUnmounted(() => {
    if (observer) observer.disconnect();
});
</script>

<style scoped>
.timeline-container {
    position: fixed;
    top: 0;
    right: 5vw;
    height: 100vh;
    width: 50%;
    display: flex;
    justify-content: flex-end;
}

.timeline-content {
    display: flex;
    position: relative;
    height: 80vh;
    width: 50%;
    top: 10%;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: flex-end;
    z-index: 2;
}

.timeline-content.active {
    font-family: 'FranieBlack', sans-serif;
    color: white;
    font-size: 1.6em;
}

.timeline {
    position: relative;
    width: 1px;
    background-color: #9c9c9c;
    top: 12.5vh;
    height: 75vh;
    right: 11px;
    z-index: 1;
}
</style>