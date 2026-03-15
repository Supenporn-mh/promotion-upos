import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PhosphorIcons from '@phosphor-icons/vue'
import router from './router'

import './style.css'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(PhosphorIcons)
app.use(router)

app.mount('#app')
