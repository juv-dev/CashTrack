import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/css/index.css'
import './style.css'
import App from './App.vue'
import { VueQueryVuePlugin, queryClient } from './plugins/queryClient'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryVuePlugin, { queryClient })

app.mount('#app')
