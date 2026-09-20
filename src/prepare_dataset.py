import os
import csv
import cv2
import kagglehub
import mediapipe as mp
from mediapipe.tasks.python import vision
from utils import create_landmarker, normalize_landmarks

OUTPUT_CSV = "../data/gesture_data.csv"

def process_dataset():
    dataset_path = kagglehub.dataset_download("grassknoted/asl-alphabet")
    print(f"Dataset cached at: {dataset_path}")

    dataset_root = os.path.join(dataset_path, "asl_alphabet_train", "asl_alphabet_train")

    landmarker = create_landmarker(vision.RunningMode.IMAGE)
    os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)
    total_written = 0
    total_skipped = 0

    with open(OUTPUT_CSV, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["label"] + [f"c{i}" for i in range(63)])

        letter_folders = sorted(
            d for d in os.listdir(dataset_root)
            if os.path.isdir(os.path.join(dataset_root, d)) and d.isalpha() and len(d) == 1
        )

        for letter_folder in letter_folders:
            label = letter_folder.lower()
            folder_path = os.path.join(dataset_root, letter_folder)
            image_files = [
                fn for fn in os.listdir(folder_path)
                if fn.lower().endswith((".jpg", ".jpeg", ".png"))
            ]
            print(f"Processing '{label}': {len(image_files)} images...")

            for img_name in image_files:
                img_path = os.path.join(folder_path, img_name)
                image = cv2.imread(img_path)
                if image is None:
                    total_skipped += 1
                    continue

                rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
                result = landmarker.detect(mp_image)

                if not result.hand_landmarks:
                    total_skipped += 1
                    continue

                landmarks = result.hand_landmarks[0]
                writer.writerow([label] + list(normalize_landmarks(landmarks)))
                total_written += 1

    print(f"\nDone. Wrote {total_written} samples, skipped {total_skipped}.")

if __name__ == "__main__":
    process_dataset()