import cv2
import time
import joblib
import mediapipe as mp
from mediapipe.tasks.python import vision
from collections import deque, Counter
from utils import create_landmarker, normalize_landmarks, draw_landmarks

def main():
    landmarker = create_landmarker(vision.RunningMode.VIDEO)
    model = joblib.load("../models/gesture_model.pkl")
    cap = cv2.VideoCapture(0)
    start_time = time.time()

    prediction_buffer = deque(maxlen=15)
    confirmed_text = ""
    last_confirmed = None

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            continue

        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        timestamp_ms = int((time.time() - start_time) * 1000)
        result = landmarker.detect_for_video(mp_image, timestamp_ms)

        current_pred = None
        if result.hand_landmarks:
            landmarks = result.hand_landmarks[0]
            draw_landmarks(frame, landmarks)
            features = normalize_landmarks(landmarks).reshape(1, -1)
            current_pred = model.predict(features)[0]
            prediction_buffer.append(current_pred)

        stable_letter = None
        if len(prediction_buffer) == prediction_buffer.maxlen:
            most_common, count = Counter(prediction_buffer).most_common(1)[0]
            if count >= 12:
                stable_letter = most_common

        if stable_letter and stable_letter != last_confirmed:
            confirmed_text += stable_letter
            last_confirmed = stable_letter
            prediction_buffer.clear()

        cv2.rectangle(frame, (0, 0), (640, 60), (0, 0, 0), -1)
        cv2.putText(frame, f"Current: {current_pred}", (10, 25),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.putText(frame, f"Text: {confirmed_text}", (10, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        cv2.imshow("ASL Gesture Recognition", frame)
        key = cv2.waitKey(1) & 0xFF

        if key == 27:
            break
        elif key == ord(" "):
            confirmed_text += " "
            last_confirmed = None
        elif key == 8:
            confirmed_text = confirmed_text[:-1]

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()