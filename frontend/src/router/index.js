import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import Journey from '@/components/Journey.vue';

const routes = [
    { path: '/', component: Login },
    { path: '/journey', component: Journey },
    { path: '/callback', component: Journey }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
