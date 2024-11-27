import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/components/LoginPage.vue';
import CallbackPage from '@/components/CallbackPage.vue';

const routes = [
    { path: '/', component: LoginPage },
    { path: '/journey', component: CallbackPage },
    { path: '/callback', component: CallbackPage }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
