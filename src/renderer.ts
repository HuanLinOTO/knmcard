import './index.css';
import './styles/colors.css';
import { createApp } from 'vue'
import App from "./App.vue"

import router from './router'
import { createPinia } from 'pinia' 
import piniaPersist from 'pinia-plugin-persist';
import naive from 'naive-ui'

const pinia = createPinia()

pinia.use(piniaPersist)

createApp(App)
.use(pinia)
.use(router)
.use(naive)
.mount('#app')