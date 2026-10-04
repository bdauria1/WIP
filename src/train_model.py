import json
import os
import numpy as np
import pandas as pd
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

df = pd.read_csv("../data/gesture_data.csv")
X = df.drop("label", axis=1).values
y = df["label"].values

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = MLPClassifier(
    hidden_layer_sizes=(128, 64),
    activation="relu",
    max_iter=300,
    early_stopping=True,
    random_state=42,
)
model.fit(X_train, y_train)

acc = accuracy_score(y_test, model.predict(X_test))
print(f"Web (MLP) model accuracy: {acc:.2%}")

weights = {
    "classes": [str(c) for c in model.classes_],
    "coefs": [np.round(w, 6).tolist() for w in model.coefs_],
    "intercepts": [np.round(b, 6).tolist() for b in model.intercepts_],
}

out_dir = "../web/src/utils"
os.makedirs(out_dir, exist_ok=True)

with open(os.path.join(out_dir, "model_weights.json"), "w") as f:
    json.dump(weights, f)

js = """import weights from './model_weights.json';

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
"""

with open(os.path.join(out_dir, "model.js"), "w") as f:
    f.write(js)

size_kb = os.path.getsize(os.path.join(out_dir, "model_weights.json")) / 1024
print(f"Wrote model.js + model_weights.json ({size_kb:.0f} KB)")