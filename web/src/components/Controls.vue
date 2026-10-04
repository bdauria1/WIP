<template>
  <div class="controls">
    <button @click="$emit('clear')">Clear</button>
    <button @click="$emit('space')">Space</button>
  </div>
</template>

<script setup>
defineEmits(['clear', 'space']);
</script>

<style scoped>
.controls {
  margin-top: 10px;
  text-align: center;
}
button {
  margin: 0 8px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>