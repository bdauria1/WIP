<template>
  <div id="app">
    <h1>ASL Gesture Recognition</h1>
    <WebcamFeed
      @letter-detected="currentLetter = $event"
      @letter-confirmed="handleConfirmed"
      @no-hand="currentLetter = null"
    />
    <LetterDisplay :current-letter="currentLetter" :confirmed-text="confirmedText" />
    <Controls @clear="confirmedText = ''" @space="confirmedText += ' '" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WebcamFeed from './components/WebcamFeed.vue';
import LetterDisplay from './components/LetterDisplay.vue';
import Controls from './components/Controls.vue';

const currentLetter = ref(null);
const confirmedText = ref('');

function handleConfirmed(letter) {
  confirmedText.value += letter;
}
</script>

<style>
body {
  font-family: sans-serif;
  background: #111;
  color: #eee;
  text-align: center;
}
</style>