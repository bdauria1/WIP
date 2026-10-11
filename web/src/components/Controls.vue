<template>
  <div class="grid grid-cols-3 gap-3">
    <button class="deco-btn" @click="$emit('space')">
      Space
      <span class="mt-1 block text-[9px] font-normal normal-case tracking-wider opacity-60">
        space bar
      </span>
    </button>
    <button class="deco-btn" @click="$emit('backspace')">
      Back
      <span class="mt-1 block text-[9px] font-normal normal-case tracking-wider opacity-60">
        backspace key
      </span>
    </button>
    <button class="deco-btn deco-btn-danger" @click="$emit('clear')">
      Clear
      <span class="mt-1 block text-[9px] font-normal normal-case tracking-wider opacity-60">
        start over
      </span>
    </button>
  </div>
</template>

<script setup>
defineEmits(['space', 'backspace', 'clear'])
</script>