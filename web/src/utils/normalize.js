export function normalizeLandmarks(landmarks) {
  const coords = landmarks.map(lm => [lm.x, lm.y, lm.z]);
  const wrist = coords[0];
  const shifted = coords.map(([x, y, z]) => [x - wrist[0], y - wrist[1], z - wrist[2]]);

  let maxVal = 0;
  for (const [x, y, z] of shifted) {
    maxVal = Math.max(maxVal, Math.abs(x), Math.abs(y), Math.abs(z));
  }

  const scaled = maxVal > 0
    ? shifted.map(([x, y, z]) => [x / maxVal, y / maxVal, z / maxVal])
    : shifted;

  return scaled.flat();
}

export const HAND_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [5,9],[9,10],[10,11],[11,12],
  [9,13],[13,14],[14,15],[15,16],
  [13,17],[17,18],[18,19],[19,20],
  [0,17]
];

export function mostCommon(arr) {
  const counts = {};
  let best = null, bestCount = 0;
  for (const v of arr) {
    counts[v] = (counts[v] || 0) + 1;
    if (counts[v] > bestCount) { best = v; bestCount = counts[v]; }
  }
  return [best, bestCount];
}