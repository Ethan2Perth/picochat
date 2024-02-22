/*import { createApp } from 'vue'
import LoginRegister from './LoginRegister.vue';

createApp(LoginRegister).mount('#app')*/
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import LoginRegister from './LoginRegister.vue';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LoginRegister },
    { path: '/chat', component: App },
  ],
});

createApp(LoginRegister).use(router).mount('#app');