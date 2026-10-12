<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div class="grid gap-10 lg:grid-cols-5">
      <section class="lg:col-span-3">
        <div class="grid grid-cols-6 gap-2 sm:grid-cols-7">
          <button
            v-for="letter in LETTERS"
            :key="letter.id"
            type="button"
            class="deco-btn aspect-square !p-0 font-display !text-xl !tracking-normal"
            :class="selected === letter.id ? 'deco-btn-active' : ''"
            @click="selected = letter.id"
          >
            {{ letter.id.toUpperCase() }}
            <span v-if="letter.motion" class="mt-1 block text-[8px] font-body font-normal tracking-widest opacity-70">
              motion
            </span>
          </button>
        </div>
      </section>

      <section class="lg:col-span-2">
        <div class="deco-frame relative overflow-hidden px-6 py-8 text-center">
          <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div class="sunburst"></div>
          </div>
          <p class="relative text-xs uppercase tracking-[0.4em] text-gold-dim">Handshape</p>
          <p
            class="relative mt-2 font-display text-9xl leading-none text-gold"
            :style="{ textShadow: '0 0 28px rgba(232,145,58,0.6)' }"
          >
            {{ current.id.toUpperCase() }}
          </p>
        </div>
        <div class="deco-frame mt-6 px-6 py-6">
          <p class="text-xs uppercase tracking-[0.4em] text-gold-dim">
            {{ current.motion ? 'Needs motion' : 'Static sign' }}
          </p>
          <p class="mt-4 text-sm leading-relaxed tracking-wide text-gold/80">
            {{ current.tip }}
          </p>
          <p v-if="current.motion" class="mt-4 text-xs leading-relaxed text-ember">
            The live model looks at a still pose, so drills skip this letter for now.
          </p>
          <a
            :href="LETTER_CHART_URL"
            target="_blank"
            rel="noopener"
            class="mt-5 inline-block text-xs uppercase tracking-[0.25em] text-amber underline-offset-2 hover:underline"
          >
            Full fingerspelling chart
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { LETTERS, LETTER_CHART_URL, letterMeta } from '../data/letters'

const selected = ref('a')
const current = computed(() => letterMeta(selected.value) ?? LETTERS[0])
</script>
