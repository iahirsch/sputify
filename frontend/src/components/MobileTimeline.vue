<template>
    <div :class="['timeline-container', { open: !sidebarVisible }]" @click="toggleSidebar">
        <span class="material-symbols-rounded menu">menu</span>
        <h2>{{ yearTitles[activeId] }}</h2>
    </div>
    <div :class="['sidebar', { open: sidebarVisible }]">
        <div class="sidebar-top">
            <div class="sidebar-header">
                <span class="material-symbols-rounded close" @click="toggleSidebar">close</span>
                <img :src="userImg" alt="User Image" class="user-image" />
                <h2 class="user-name">{{ userName }}</h2>
            </div>
            <div class="sidebar-content">
                <MobileDatapoint v-for="(year, index) in years" :key="index" :active="activeId === index"
                    :title="year.title" />
                <MobileDatapoint :active="activeId === years.length" :title="'Your Badges'" />
                <MobileDatapoint :active="activeId === years.length + 1" :title="'Share Journey'" />
            </div>
        </div>
        <div class="sidebar-footer">
            <button @click="logOut" class="logout-button">
                <span class="material-symbols-rounded logout">logout</span>
                <p>Log Out</p>
            </button>
        </div>
    </div>
</template>

<script>
const sidebarVisible = ref(false);
const toggleSidebar = () => {
    if (document.querySelector('.mobile-timeline').style.opacity == 1) {
        sidebarVisible.value = !sidebarVisible.value;
        if (sidebarVisible.value) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
};
export { toggleSidebar };
</script>

<script setup>
import { ref, toRefs, onMounted, onUnmounted } from 'vue';
import MobileDatapoint from './MobileDatapoint.vue';

import { logOut } from './JourneyPage.vue';

const props = defineProps({
    years: {
        type: Array,
        required: true,
        validator: (value) => value.length > 0,
    },
    userName: {
        type: String,
        required: true,
    },
    userImg: {
        type: String,
        required: true,
    },
});

const { years } = toRefs(props);

const activeId = ref(0);
const yearTitles = ref(years.value.map(year => year.title).concat(['Your Badges', 'Share Journey']));

let observer;

onMounted(() => {
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                activeId.value = parseInt(entry.target.id, 10);
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
    top: 3.5rem;
    left: 0;
    display: flex;
    align-items: center;
    z-index: 10;
    padding: 1rem 1rem 1rem 0;
    margin-right: 10vw;
    background-color: #333;
    opacity: 0.8;
    box-shadow: 0 0 1rem 1rem rgba(0, 0, 0, 0.5);
    border-radius: 0 1rem 1rem 0;
    cursor: pointer;
    transform: translateX(-110%);
    transition: transform 0.3s ease;
}

.timeline-container.open {
    transform: translateX(0%);
}

.menu {
    font-size: 2rem;
    padding: 0 1rem;
}

h2 {
    margin: 0;
    padding-top: 0.2rem;
    width: fit-content;
}

.sidebar {
    position: fixed;
    top: 5vh;
    width: 20rem;
    height: 90vh;
    background-color: #222;
    box-shadow: 0 0 1rem 1rem rgba(0, 0, 0, 0.5);
    border-radius: 0 1rem 1rem 0;
    transition: transform 0.3s ease;
    transform: translateX(-110%);
    z-index: 100;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.sidebar::-webkit-scrollbar {
    display: none;
}

.sidebar.open {
    transform: translateX(0%);
}

.sidebar-top {
    display: flex;
    flex-direction: column;
}

.sidebar-header {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border-radius: 0 1rem 1rem 0;
    background: -webkit-linear-gradient(90deg, #4DD4AC 0%, #1DB954 100%);
}

.close {
    font-size: 2rem;
    cursor: pointer;
    position: absolute;
    top: 0.8rem;
    right: 1rem;
}

.user-image {
    width: 5rem;
    height: 5rem;
    object-fit: cover;
    border-radius: 50% 50% 0 0;
    padding: 1rem 2rem;
    margin-top: 2rem;
}

.user-name {
    margin: 0;
    padding-left: 2rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 2rem rgba(0, 0, 0, 0.5);
    max-width: calc(80vw - 4rem);
    text-wrap: wrap;
}

.sidebar-content {
    padding: 1rem;
    max-width: calc(80vw - 4rem);
    min-width: fit-content;
}

.sidebar-footer {
    display: flex;
    justify-content: center;
    padding: 1rem;
    margin-bottom: 1rem
}

.logout-button {
    background-color: rgba(255, 255, 255, 0.8);
    color: black;
    transition-duration: 0.4s;
}

.logout-button:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.6);
}

.logout {
    transform: scaleX(-1);
}
</style>