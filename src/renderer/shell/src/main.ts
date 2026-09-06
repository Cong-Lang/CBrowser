import './assets/main.scss'
import './assets/icons/m3.css'
import './assets/fonts/googlesans.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import '@m3e/web/all'

const pinia = createPinia()

createApp(App).use(pinia).mount('#app')
