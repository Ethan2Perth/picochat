import { createRouter, createWebHistory } from 'vue-router';
import ChatPage from '../ChatPage.vue';
import LoginRegister from '../LoginRegister.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', 
      redirect: '/login',
    },
    { path: '/login',
      name: 'login',
      component: LoginRegister 
    },
    { path: '/chat',
      name:'chat',
      component: ChatPage 
    },
  ],
});

export default router;
