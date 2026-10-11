<template>
  <div class="deco-frame p-2">
    <div class="relative aspect-[4/3] w-full overflow-hidden bg-black">
      <video
        ref="videoRef"
        autoplay
        playsinline
        muted
        class="absolute inset-0 h-full w-full -scale-x-100 object-cover"
      ></video>
      <canvas
        ref="canvasRef"
        width="640"
        height="480"
        class="absolute inset-0 h-full w-full -scale-x-100"
      ></canvas>

      <!-- Vignette -->
      <div
        class="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(11,14,8,0.7)]"
      ></div>
      <div
        v-if="isReady && !error"
        class="absolute left-3 top-3 flex items-center gap-2 border border-gold-dim/60 bg-ink/70 px-3 py-1 text-[11px] uppercase tracking-[0.2em] backdrop-blur"
      >
        <span
          class="h-2 w-2 rotate-45"
          :class="handDetected ? 'bg-glow shadow-[0_0_8px_#b9d46a]' : 'bg-gold-dim/50'"
        ></span>
        <span :class="handDetected ? 'text-gold' : 'text-gold-dim'">
          {{ handDetected ? 'Hand detected' : 'Show your hand' }}
        </span>
      </div>
      <div
        v-if="!isReady || error"
        class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/90 p-6 text-center"
      >
        <template v-if="error">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-ember">
            Couldn't start the camera or model
          </p>
          <p class="max-w-sm text-xs text-gold-dim">{{ error }}</p>
        </template>
        <template v-else>
          <div
            class="h-9 w-9 animate-spin rounded-full border-2 border-gold-dim/30 border-t-gold"
          ></div>
          <p class="text-xs uppercase tracking-[0.3em] text-gold-dim">{{ status }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHandLandmarker } from '../composables/useHandLandmarker'
import { normalizeLandmarks, HAND_CONNECTIONS, mostCommon } from '../utils/normalize'
import { predictLetter } from '../utils/model'

const emit = defineEmits(['letter-detected', 'letter-confirmed', 'no-hand'])

const videoRef = ref(null)
const canvasRef = ref(null)
const handDetected = ref(false)

const BUFFER_SIZE = 15
const CONFIRM_THRESHOLD = 12
let predictionBuffer = []
let lastConfirmed = null

function drawLandmarks(ctx, landmarks) {
  ctx.clearRect(0, 0, 640, 480)
  ctx.strokeStyle = '#ece59a'
  ctx.lineWidth = 3
  for (const [a, b] of HAND_CONNECTIONS) {
    ctx.beginPath()
    ctx.moveTo(landmarks[a].x * 640, landmarks[a].y * 480)
    ctx.lineTo(landmarks[b].x * 640, landmarks[b].y * 480)
    ctx.stroke()
  }
  ctx.fillStyle = '#e8913a'
  for (const lm of landmarks) {
    ctx.beginPath()
    ctx.arc(lm.x * 640, lm.y * 480, 4.5, 0, 2 * Math.PI)
    ctx.fill()
  }
}

function handleResult(result) {
  const ctx = canvasRef.value.getContext('2d')

  if (result.landmarks && result.landmarks.length > 0) {
    handDetected.value = true
    const landmarks = result.landmarks[0]
    drawLandmarks(ctx, landmarks)

    const features = normalizeLandmarks(landmarks)
    const letter = predictLetter(features)

    emit('letter-detected', letter)

    predictionBuffer.push(letter)
    if (predictionBuffer.length > BUFFER_SIZE) predictionBuffer.shift()

    if (predictionBuffer.length === BUFFER_SIZE) {
      const [stable, count] = mostCommon(predictionBuffer)
      if (count >= CONFIRM_THRESHOLD && stable !== lastConfirmed) {
        emit('letter-confirmed', stable)
        lastConfirmed = stable
        predictionBuffer = []
      }
    }
  } else {
    handDetected.value = false
    ctx.clearRect(0, 0, 640, 480)
    predictionBuffer = []
    lastConfirmed = null
    emit('no-hand')
  }
}

const { isReady, status, error } = useHandLandmarker(videoRef, handleResult)
</script>