import { createRouter, createWebHistory } from 'vue-router'
import PracticeView from './views/PracticeView.vue'
import SpellView from './views/SpellView.vue'
import AlphabetView from './views/AlphabetView.vue'
import ProgressView from './views/ProgressView.vue'
import AccountView from './views/AccountView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'practice', component: PracticeView, meta: { title: 'Practice' } },
    { path: '/spell', name: 'spell', component: SpellView, meta: { title: 'Spell' } },
    { path: '/alphabet', name: 'alphabet', component: AlphabetView, meta: { title: 'Alphabet' } },
    { path: '/progress', name: 'progress', component: ProgressView, meta: { title: 'Progress' } },
    { path: '/account', name: 'account', component: AccountView, meta: { title: 'Account' } },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})
