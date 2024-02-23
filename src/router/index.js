import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import LoginRegister from '../LoginRegister.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginRegister },
    { path: '/chat', component: App },
  ],
});

export default router;
