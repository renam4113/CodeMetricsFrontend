import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import router from '@/router';
import store from '@/store';
import 'primevue/resources/themes/lara-light-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import '@/styles/index.css';
import '@/styles/chat.css';
import '@/styles/reports.css';

createApp(App)
    .use(PrimeVue)
    .use(router)
    .use(store)
    .mount('#app');
