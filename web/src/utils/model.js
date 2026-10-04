import weights from './model_weights.json';

const { classes, coefs, intercepts } = weights;

export function predictLetter(input) {
  let a = input;
  for (let layer = 0; layer < coefs.length; layer++) {
    const W = coefs[layer];       // shape [n_in][n_out]
    const b = intercepts[layer];
    const out = new Array(b.length);
    for (let j = 0; j < b.length; j++) {
      let sum = b[j];
      for (let i = 0; i < a.length; i++) sum += a[i] * W[i][j];
      out[j] = sum;
    }
    const isLast = layer === coefs.length - 1;
    a = isLast ? out : out.map(v => (v > 0 ? v : 0)); // ReLU on hidden layers
  }
  let best = 0;
  for (let i = 1; i < a.length; i++) if (a[i] > a[best]) best = i;
  return classes[best];
}
