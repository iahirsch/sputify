import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/components/LoginPage.vue';
import Journey from '@/components/JourneyPage.vue';

const routes = [
    { path: '/', component: LoginPage },
    { path: '/journey', component: Journey },
    { path: '/callback', component: Journey }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
