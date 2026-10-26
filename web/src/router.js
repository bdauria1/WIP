import { createRouter, createWebHistory } from 'vue-router'
import LandingView from './views/LandingView.vue'
import SignInView from './views/SignInView.vue'
import PracticeView from './views/PracticeView.vue'
import SpellView from './views/SpellView.vue'
import AlphabetView from './views/AlphabetView.vue'
import ProgressView from './views/ProgressView.vue'
import AccountView from './views/AccountView.vue'
import { authUser } from './composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingView, meta: { layout: 'site' } },
    { path: '/signin', name: 'signin', component: SignInView, meta: { title: 'Sign in', layout: 'site', guestOnly: true } },
    { path: '/practice', name: 'practice', component: PracticeView, meta: { title: 'Practice' } },
    { path: '/spell', name: 'spell', component: SpellView, meta: { title: 'Spell' } },
    { path: '/alphabet', name: 'alphabet', component: AlphabetView, meta: { title: 'Alphabet' } },
    { path: '/progress', name: 'progress', component: ProgressView, meta: { title: 'Progress' } },
    { path: '/account', name: 'account', component: AccountView, meta: { title: 'Account', requiresAuth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !authUser.value) {
    return { name: 'signin', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && authUser.value) {
    return { name: 'practice' }
  }
})

export default router
