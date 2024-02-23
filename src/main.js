/*import { createApp } from 'vue'
import LoginRegister from './LoginRegister.vue';

createApp(LoginRegister).mount('#app')*/

import { createApp } from 'vue';
import App from './App.vue'
import router from './router/index.js';

const app = createApp(App);
app.use(router);
app.mount('#app');

