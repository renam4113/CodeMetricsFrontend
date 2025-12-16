import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import router from '@/router/index.js';
import store from '@/store';
import 'primevue/resources/themes/lara-light-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App);

app
    .use(PrimeVue)
    .use(router)
    .use(store)
    .mount('#app');