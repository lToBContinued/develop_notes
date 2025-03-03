import { createApp } from 'vue'
import App from './App.vue'
import registerDirectives from '@/directives/index.ts' // 注册自定义指令

const app = createApp(App)
registerDirectives(app) // 注册自定义指令

app.mount('#app')
