<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div class="grid gap-4 sm:grid-cols-3">
      <div class="deco-frame px-5 py-6 text-center">
        <p class="text-xs uppercase tracking-[0.35em] text-gold-dim">Streak</p>
        <p class="mt-2 font-display text-4xl text-gold">{{ state.streak }}</p>
      </div>
      <div class="deco-frame px-5 py-6 text-center">
        <p class="text-xs uppercase tracking-[0.35em] text-gold-dim">Hits</p>
        <p class="mt-2 font-display text-4xl text-gold">{{ totals.hits }}</p>
      </div>
      <div class="deco-frame px-5 py-6 text-center">
        <p class="text-xs uppercase tracking-[0.35em] text-gold-dim">Words</p>
        <p class="mt-2 font-display text-4xl text-gold">{{ state.wordsCompleted }}</p>
      </div>
    </div>

    <p class="mt-8 text-sm tracking-wide text-gold-dim">
      <template v-if="user">Progress syncs to your account. </template>
      <template v-else>Progress is stored only in this browser. </template>
      Hand tracking runs locally; camera video is never uploaded.
    </p>

    <p v-if="!ready" class="mt-4 text-sm text-gold-dim" role="status">
      Loading progress…
    </p>
    <div v-if="error" class="mt-4 flex flex-wrap items-center gap-4 text-sm text-ember" role="alert">
      <span>{{ error }}</span>
      <button
        v-if="user"
        type="button"
        class="underline underline-offset-4 hover:text-gold"
        @click="refreshUserProgress"
      >
        Retry
      </button>
    </div>

    <div class="deco-frame mt-6 overflow-x-auto p-4">
      <table class="w-full min-w-[28rem] text-left text-sm">
        <thead>
          <tr class="text-xs uppercase tracking-[0.25em] text-gold-dim">
            <th class="px-3 py-2 font-medium">Letter</th>
            <th class="px-3 py-2 font-medium">Hits</th>
            <th class="px-3 py-2 font-medium">Misses</th>
            <th class="px-3 py-2 font-medium">Often read as</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="id in ALPHABET"
            :key="id"
            class="border-t border-gold-dim/20"
          >
            <td class="px-3 py-2 font-display text-lg tracking-widest">
              {{ id.toUpperCase() }}
              <span v-if="letterMeta(id)?.motion" class="ml-2 text-[10px] font-body tracking-widest text-ember">
                motion
              </span>
            </td>
            <td class="px-3 py-2 text-glow">{{ state.letters[id].hits }}</td>
            <td class="px-3 py-2 text-ember">{{ state.letters[id].misses }}</td>
            <td class="px-3 py-2 uppercase tracking-widest text-gold-dim">
              {{ topConfusion(id)?.toUpperCase() || '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button type="button" class="deco-btn deco-btn-danger mt-6" :disabled="!ready" @click="reset">
      Reset stats
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ALPHABET, letterMeta } from '../data/letters'
import { useProgress } from '../composables/useProgress'
import { useAuth } from '../composables/useAuth'

const { state, ready, error, topConfusion, reset, refreshUserProgress } = useProgress()
const { user } = useAuth()

const totals = computed(() => {
  let hits = 0
  let misses = 0
  for (const id of ALPHABET) {
    hits += state.letters[id].hits
    misses += state.letters[id].misses
  }
  return { hits, misses }
})
</script>
