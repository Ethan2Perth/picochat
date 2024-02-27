import { createRouter, createWebHistory } from 'vue-router';
import ChatPage from '../ChatPage.vue';
import LoginRegister from '../LoginRegister.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', 
      redirect: '/LoginRegister',
    },
    { path: '/LoginRegister',
      name: 'LoginRegister',
      component: LoginRegister 
    },
    { path: '/chat',
      name:'chat',
      component: ChatPage 
    },
  ],
});

export default router;
