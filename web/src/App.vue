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
      </header>

      <main class="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-5">
        <section class="lg:col-span-3">
          <WebcamFeed
            @letter-detected="currentLetter = $event"
            @letter-confirmed="confirmedText += $event"
            @no-hand="currentLetter = null"
          />
          <p class="mt-5 text-center text-sm tracking-wide text-gold-dim">
            Hold each sign steady for about half a second to lock in the letter.
          </p>
        </section>

        <section class="space-y-6 lg:col-span-2">
          <LetterDisplay :current-letter="currentLetter" :confirmed-text="confirmedText" />
          <Controls @space="addSpace" @backspace="backspace" @clear="confirmedText = ''" />
          <HowToPanel />
        </section>
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
import { ref, onMounted, onUnmounted } from 'vue'
import WebcamFeed from './components/WebcamFeed.vue'
import LetterDisplay from './components/LetterDisplay.vue'
import Controls from './components/Controls.vue'
import HowToPanel from './components/HowToPanel.vue'

const REPO_URL = 'https://github.com/bdauria1'

const lamps = [64, 48, 36, 28, 36, 48, 64]

const currentLetter = ref(null)
const confirmedText = ref('')

function addSpace() {
  confirmedText.value += ' '
}

function backspace() {
  confirmedText.value = confirmedText.value.slice(0, -1)
}

function onKeydown(e) {
  if (e.code === 'Space') {
    e.preventDefault()
    addSpace()
  } else if (e.code === 'Backspace') {
    e.preventDefault()
    backspace()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>