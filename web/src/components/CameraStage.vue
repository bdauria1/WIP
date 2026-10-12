<template>
  <div class="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-5">
    <section class="lg:col-span-3">
      <WebcamFeed
        @letter-detected="$emit('letter-detected', $event)"
        @letter-confirmed="$emit('letter-confirmed', $event)"
        @no-hand="$emit('no-hand')"
      />
      <p class="mt-5 text-center text-sm tracking-wide text-gold-dim">
        <slot name="hint" />
      </p>
    </section>
    <section class="space-y-6 lg:col-span-2">
      <slot />
    </section>
  </div>
</template>

<script setup>
import WebcamFeed from './WebcamFeed.vue'

defineEmits(['letter-detected', 'letter-confirmed', 'no-hand'])
</script>
