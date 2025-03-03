import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/styles/index.scss'
import './permission.ts'
import registerDirectives from '@/directives/index.ts' // 注册自定义指令

const app = createApp(App)
app.use(createPinia())
app.use(router)
registerDirectives(app) // 注册自定义指令

app.mount('#app')
