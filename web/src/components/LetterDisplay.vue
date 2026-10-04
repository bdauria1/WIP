<template>
  <div class="letter-display">
    <div>Current: <span class="current">{{ currentLetter || '-' }}</span></div>
    <div>Text: <span class="confirmed">{{ confirmedText }}</span></div>
  </div>
</template>

<script setup>
defineProps({
  currentLetter: String,
  confirmedText: String
});
</script>

<style scoped>
.letter-display {
  font-size: 24px;
  margin-top: 20px;
  text-align: center;
}
.current {
  color: #4ade80;
  font-weight: bold;
}
</style>