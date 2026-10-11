<template>
  <div class="space-y-6">
    <div class="deco-frame px-6 py-8 text-center">
      <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="sunburst"></div>
      </div>
      <p class="relative text-xs uppercase tracking-[0.4em] text-gold-dim">Detected</p>
      <p
        class="relative mt-2 font-display text-9xl leading-none transition-all duration-200"
        :class="currentLetter ? 'text-gold' : 'text-gold-dim/30'"
        :style="currentLetter ? { textShadow: '0 0 28px rgba(232,145,58,0.6)' } : {}"
      >
        {{ currentLetter ? currentLetter.toUpperCase() : '–' }}
      </p>
    </div>

    <div class="deco-frame min-h-40 px-6 py-6">
      <p class="text-xs uppercase tracking-[0.4em] text-gold-dim">Your message</p>
      <p
        class="mt-4 whitespace-pre-wrap break-words font-display text-3xl tracking-[0.15em] text-gold"
      >{{ confirmedText.toUpperCase() }}<span class="ml-1 inline-block h-7 w-0.5 animate-pulse bg-amber align-middle"></span></p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentLetter: { type: String, default: null },
  confirmedText: { type: String, default: '' },
})
</script>