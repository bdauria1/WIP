<template>
  <div>
    <div class="webcam-container">
      <video ref="videoRef" autoplay playsinline muted></video>
      <canvas ref="canvasRef" width="640" height="480"></canvas>
    </div>
    <p class="status" :class="{ err: error }">
      {{ error ? `Error: ${error}` : status }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useHandLandmarker } from '../composables/useHandLandmarker';
import { normalizeLandmarks, HAND_CONNECTIONS, mostCommon } from '../utils/normalize';
import { predictLetter } from '../utils/model';

const emit = defineEmits(['letter-detected', 'letter-confirmed', 'no-hand']);

const videoRef = ref(null);
const canvasRef = ref(null);

const BUFFER_SIZE = 15;
const CONFIRM_THRESHOLD = 12;
let predictionBuffer = [];
let lastConfirmed = null;

function drawLandmarks(ctx, landmarks) {
  ctx.clearRect(0, 0, 640, 480);
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 2;
  for (const [a, b] of HAND_CONNECTIONS) {
    ctx.beginPath();
    ctx.moveTo(landmarks[a].x * 640, landmarks[a].y * 480);
    ctx.lineTo(landmarks[b].x * 640, landmarks[b].y * 480);
    ctx.stroke();
  }
  ctx.fillStyle = '#ef4444';
  for (const lm of landmarks) {
    ctx.beginPath();
    ctx.arc(lm.x * 640, lm.y * 480, 3, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function handleResult(result) {
  const ctx = canvasRef.value.getContext('2d');

  if (result.landmarks && result.landmarks.length > 0) {
    const landmarks = result.landmarks[0];
    drawLandmarks(ctx, landmarks);

    const features = normalizeLandmarks(landmarks);
    const letter = predictLetter(features);

    emit('letter-detected', letter);

    predictionBuffer.push(letter);
    if (predictionBuffer.length > BUFFER_SIZE) predictionBuffer.shift();

    if (predictionBuffer.length === BUFFER_SIZE) {
      const [stable, count] = mostCommon(predictionBuffer);
      if (count >= CONFIRM_THRESHOLD && stable !== lastConfirmed) {
        emit('letter-confirmed', stable);
        lastConfirmed = stable;
        predictionBuffer = [];
      }
    }
  } else {
    ctx.clearRect(0, 0, 640, 480);
    emit('no-hand');
  }
}

const { status, error } = useHandLandmarker(videoRef, handleResult);
</script>

<style scoped>
.webcam-container {
  position: relative;
  width: 640px;
  height: 480px;
  margin: 0 auto;
  background: #000;
}
video, canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 640px;
  height: 480px;
  transform: scaleX(-1);
}
.status {
  margin-top: 8px;
  font-size: 14px;
  color: #9ca3af;
}
.status.err {
  color: #f87171;
}
</style>