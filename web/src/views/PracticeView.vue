<template>
  <CameraStage
    @letter-detected="currentLetter = $event"
    @letter-confirmed="onConfirmed"
    @no-hand="currentLetter = null"
  >
    <template #hint>
      Match the letter on the right. Lower your hand between signs. J and Z are skipped — they need motion.
    </template>

    <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <button
        v-for="option in modes"
        :key="option.id"
        type="button"
        class="deco-btn !px-2 !py-2 !text-[10px] !tracking-widest"
        :class="mode === option.id ? 'deco-btn-active' : ''"
        @click="setMode(option.id)"
      >
        {{ option.label }}
      </button>
    </div>

    <div class="deco-frame relative overflow-hidden px-6 py-8 text-center">
      <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="sunburst"></div>
      </div>
      <p class="relative text-xs uppercase tracking-[0.4em] text-gold-dim">
        {{ mode === 'word' ? 'Spell this word' : 'Sign this letter' }}
      </p>
      <p
        v-if="mode === 'word'"
        class="relative mt-4 font-display text-3xl tracking-[0.2em] text-gold"
      >
        <span
          v-for="(ch, i) in word"
          :key="i"
          :class="i === wordIndex ? 'text-amber' : i < wordIndex ? 'text-glow' : 'text-gold-dim/40'"
        >{{ ch.toUpperCase() }}</span>
      </p>
      <p
        class="relative mt-2 font-display text-9xl leading-none text-gold"
        :style="{ textShadow: '0 0 28px rgba(232,145,58,0.6)' }"
      >
        {{ targetDisplay }}
      </p>
      <p class="relative mt-3 text-xs tracking-wide text-gold-dim">
        {{ letterMeta(target)?.tip }}
      </p>
    </div>

    <div class="deco-frame px-6 py-6 text-center">
      <p class="text-xs uppercase tracking-[0.4em] text-gold-dim">You signed</p>
      <p
        class="mt-2 font-display text-6xl leading-none"
        :class="feedbackClass"
      >
        {{ currentLetter ? currentLetter.toUpperCase() : '–' }}
      </p>
      <p v-if="feedback" class="mt-3 text-xs uppercase tracking-[0.3em]" :class="feedbackClass">
        {{ feedback }}
      </p>
      <p class="mt-4 text-xs uppercase tracking-[0.25em] text-gold-dim">
        Streak {{ state.streak }}
      </p>
    </div>

    <button type="button" class="deco-btn w-full" @click="skip">
      Skip / next
    </button>
  </CameraStage>
</template>

<script setup>
import { computed, ref } from 'vue'
import CameraStage from '../components/CameraStage.vue'
import { PRACTICE_WORDS, STATIC_LETTERS, letterMeta } from '../data/letters'
import { useProgress } from '../composables/useProgress'

const modes = [
  { id: 'random', label: 'Random' },
  { id: 'az', label: 'A–Z' },
  { id: 'weak', label: 'Weak' },
  { id: 'word', label: 'Word' },
]

const { state, recordAttempt, recordWordComplete, weakest } = useProgress()

const mode = ref('random')
const azIndex = ref(0)
const word = ref(pickWord())
const wordIndex = ref(0)
const target = ref(pickRandom())
const currentLetter = ref(null)
const feedback = ref('')
const lastResult = ref(null)

const targetDisplay = computed(() => target.value.toUpperCase())

const feedbackClass = computed(() => {
  if (lastResult.value === 'hit') return 'text-glow'
  if (lastResult.value === 'miss') return 'text-ember'
  return 'text-gold-dim/40'
})

function pickRandom() {
  return STATIC_LETTERS[Math.floor(Math.random() * STATIC_LETTERS.length)]
}

function pickWord() {
  return PRACTICE_WORDS[Math.floor(Math.random() * PRACTICE_WORDS.length)]
}

function nextAz() {
  const letter = STATIC_LETTERS[azIndex.value]
  azIndex.value = (azIndex.value + 1) % STATIC_LETTERS.length
  return letter
}

function nextWeak() {
  const pool = weakest(6)
  if (!pool.length) return pickRandom()
  return pool[Math.floor(Math.random() * pool.length)]
}

function syncTargetFromMode() {
  if (mode.value === 'word') {
    word.value = pickWord()
    wordIndex.value = 0
    target.value = word.value[0]
    return
  }
  if (mode.value === 'az') {
    azIndex.value = 0
    target.value = nextAz()
    return
  }
  if (mode.value === 'weak') {
    target.value = nextWeak()
    return
  }
  target.value = pickRandom()
}

function advanceAfterHit() {
  if (mode.value === 'word') {
    wordIndex.value += 1
    if (wordIndex.value >= word.value.length) {
      recordWordComplete()
      feedback.value = `${word.value.toUpperCase()} complete`
      word.value = pickWord()
      wordIndex.value = 0
    }
    target.value = word.value[wordIndex.value]
    return
  }
  if (mode.value === 'az') {
    target.value = nextAz()
    return
  }
  if (mode.value === 'weak') {
    target.value = nextWeak()
    return
  }
  target.value = pickRandom()
}

function setMode(next) {
  mode.value = next
  feedback.value = ''
  lastResult.value = null
  syncTargetFromMode()
}

function skip() {
  feedback.value = ''
  lastResult.value = null
  currentLetter.value = null
  if (mode.value === 'word') {
    wordIndex.value += 1
    if (wordIndex.value >= word.value.length) {
      word.value = pickWord()
      wordIndex.value = 0
    }
    target.value = word.value[wordIndex.value]
    return
  }
  if (mode.value === 'az') {
    target.value = nextAz()
    return
  }
  if (mode.value === 'weak') {
    target.value = nextWeak()
    return
  }
  target.value = pickRandom()
}

function onConfirmed(letter) {
  const expected = target.value
  recordAttempt({ target: expected, predicted: letter })
  if (letter === expected) {
    lastResult.value = 'hit'
    feedback.value = 'Match — next letter'
    advanceAfterHit()
  } else {
    lastResult.value = 'miss'
    feedback.value = `Needed ${expected.toUpperCase()}`
  }
}
</script>
