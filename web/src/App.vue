<template>
  <div class="relative min-h-screen overflow-hidden">
    <div class="beam beam-left" aria-hidden="true"></div>
    <div class="beam beam-right" aria-hidden="true"></div>

    <div class="relative z-10">
      <header class="px-4 pt-10 text-center sm:pt-14">
        <p class="text-xs uppercase tracking-[0.5em] text-gold-dim">
          Fingerspelling in the browser
        </p>
        <h1 class="deco-title mt-3 text-3xl sm:text-5xl">ASL Gesture Recognition</h1>
        <div class="deco-rule mx-auto mt-6 max-w-md"><span></span></div>
        <nav class="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-2" aria-label="App">
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="nav-link"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
      </header>

      <main>
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
const REPO_URL = 'https://github.com/bdauria1/WIP'
const lamps = [64, 48, 36, 28, 36, 48, 64]

const links = [
  { to: '/', label: 'Practice' },
  { to: '/spell', label: 'Spell' },
  { to: '/alphabet', label: 'Alphabet' },
  { to: '/progress', label: 'Progress' },
]
</script>
