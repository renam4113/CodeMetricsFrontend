import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import router from '@/router/index.js';
import store from '@/store';

const app = createApp(App);

app
    .use(PrimeVue)
    .use(router)
    .use(store)
    .mount('#app');