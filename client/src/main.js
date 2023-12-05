import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/store';
import PrimeVue from 'primevue/config';

import './assets/styles/css/main.css';

createApp(App).use(router).use(PrimeVue).use(store).mount('#app');

