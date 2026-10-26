<template>
  <div class="relative min-h-screen overflow-hidden">
    <div class="beam beam-left" aria-hidden="true"></div>
    <div class="beam beam-right" aria-hidden="true"></div>

    <div class="relative z-10 flex min-h-screen flex-col">
      <header class="border-b border-gold-dim/30 bg-ink/70 backdrop-blur">
        <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
          <RouterLink to="/" class="deco-title text-lg sm:text-xl" aria-label="ASL Gesture Recognition home">
            ASL<span class="text-gold-dim"> · </span>Gesture
          </RouterLink>

          <nav
            v-if="!isSiteLayout"
            class="order-last flex w-full flex-wrap justify-center gap-2 sm:order-none sm:w-auto"
            aria-label="App"
          >
            <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link">
              {{ link.label }}
            </RouterLink>
          </nav>

          <div class="flex items-center gap-2">
            <template v-if="user">
              <RouterLink v-if="isSiteLayout" to="/practice" class="nav-link">Open app</RouterLink>
              <RouterLink to="/account" class="nav-link" :title="user.email">Account</RouterLink>
            </template>
            <template v-else>
              <RouterLink v-if="route.name !== 'signin'" to="/signin" class="nav-link">Sign in</RouterLink>
              <RouterLink v-if="isSiteLayout" to="/practice" class="nav-link router-link-exact-active">
                Try it
              </RouterLink>
            </template>
          </div>
        </div>
      </header>

      <main class="flex-1">
        <RouterView />
      </main>

      <footer class="mt-8 pb-10">
        <div
          class="mx-auto flex max-w-4xl items-end justify-between px-6"
          aria-hidden="true"
        >
          <div v-for="(size, i) in lamps" :key="i" class="flex flex-col items-center">
            <div class="globe" :style="{ width: size + 'px', height: size + 'px' }"></div>
            <div class="lamp-stem" :style="{ height: size * 0.9 + 'px' }"></div>
          </div>
        </div>
        <a
          :href="REPO_URL"
          target="_blank"
          rel="noopener"
          class="mt-6 block text-center text-xs uppercase tracking-[0.3em] text-gold-dim transition hover:text-gold"
        >
          View on GitHub
        </a>
        <p class="mt-3 text-center text-[11px] uppercase tracking-[0.25em] text-gold-dim/60">
          Hand tracking runs entirely in your browser. No video leaves your device.
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from './composables/useAuth'

const REPO_URL = 'https://github.com/bdauria1/WIP'
const lamps = [64, 48, 36, 28, 36, 48, 64]

const route = useRoute()
const { user } = useAuth()
const isSiteLayout = computed(() => route.meta.layout === 'site')

const links = [
  { to: '/practice', label: 'Practice' },
  { to: '/spell', label: 'Spell' },
  { to: '/alphabet', label: 'Alphabet' },
  { to: '/progress', label: 'Progress' },
]
</script>
