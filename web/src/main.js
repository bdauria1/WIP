import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { initializeAuth } from './composables/useAuth'

router.afterEach((to) => {
  const page = to.meta.title
  document.title = page ? `${page} · ASL Gesture Recognition` : 'ASL Gesture Recognition'
})

await initializeAuth()
createApp(App).use(router).mount('#app')
