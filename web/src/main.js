import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

router.afterEach((to) => {
  const page = to.meta.title
  document.title = page ? `${page} · ASL Gesture Recognition` : 'ASL Gesture Recognition'
})

createApp(App).use(router).mount('#app')
