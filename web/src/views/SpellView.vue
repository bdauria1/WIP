<template>
  <CameraStage
    @letter-detected="currentLetter = $event"
    @letter-confirmed="confirmedText += $event"
    @no-hand="currentLetter = null"
  >
    <template #hint>
      Hold each sign steady for about half a second to lock in the letter.
    </template>
    <LetterDisplay :current-letter="currentLetter" :confirmed-text="confirmedText" />
    <Controls @space="addSpace" @backspace="backspace" @clear="confirmedText = ''" />
    <HowToPanel />
  </CameraStage>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import CameraStage from '../components/CameraStage.vue'
import LetterDisplay from '../components/LetterDisplay.vue'
import Controls from '../components/Controls.vue'
import HowToPanel from '../components/HowToPanel.vue'

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
