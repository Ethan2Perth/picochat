/*import { createApp } from 'vue'
import LoginRegister from './LoginRegister.vue';

createApp(LoginRegister).mount('#app')*/

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';

createApp(App).use(router).mount('#app');

