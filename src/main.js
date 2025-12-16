import { createApp } from 'vue';

import App from './App.vue';

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura';


import router from '@/router/index.js';
import store from '@/store';

const app = createApp(App);

app 
    .use(router)
    .use(PrimeVue, { 
        theme: {
            preset: Aura,
            options: {
                prefix: 'p',
                darkModeSelector: 'system',
                cssLayer: false
            }
        }
    })
    .use(store)
    .mount('#app');