import { ref, onMounted, onUnmounted } from 'vue';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export function useHandLandmarker(videoRef, onResult) {
  const isReady = ref(false);
  const status = ref('Starting…');
  const error = ref(null);

  let handLandmarker = null;
  let animationFrameId = null;
  let stream = null;
  let disposed = false;
  let lastVideoTime = -1;

  async function init() {
    try {
      status.value = 'Requesting camera…';
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
      });
      if (disposed) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }
      videoRef.value.srcObject = stream;
      await videoRef.value.play();

      status.value = 'Loading hand tracking model…';
      const vision = await FilesetResolver.forVisionTasks('/mediapipe');
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: '/mediapipe/hand_landmarker.task' },
        runningMode: 'VIDEO',
        numHands: 1
      });
      if (disposed) return;

      status.value = 'Ready';
      isReady.value = true;
      predictLoop();
    } catch (err) {
      console.error('Hand tracking init failed:', err);
      error.value = err?.message || String(err);
      status.value = 'Error';
    }
  }

  function predictLoop() {
    if (disposed || !handLandmarker || !videoRef.value) return;

    const video = videoRef.value;
    if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      const result = handLandmarker.detectForVideo(video, performance.now());
      onResult(result);
    }

    animationFrameId = requestAnimationFrame(predictLoop);
  }

  onMounted(init);

  onUnmounted(() => {
    disposed = true;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (handLandmarker) handLandmarker.close();
  });

  return { isReady, status, error };
}