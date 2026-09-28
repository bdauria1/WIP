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
    window_name = "ASL Gesture Recognition"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL | cv2.WINDOW_KEEPRATIO)
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

        _, _, window_width, window_height = cv2.getWindowImageRect(window_name)
        if window_width <= 0 or window_height <= 0:
            window_height, window_width = frame.shape[:2]

        frame_height, frame_width = frame.shape[:2]
        scale = min(window_width / frame_width, window_height / frame_height)
        display_width = max(1, int(frame_width * scale))
        display_height = max(1, int(frame_height * scale))
        interpolation = cv2.INTER_AREA if scale < 1 else cv2.INTER_LINEAR
        resized_frame = cv2.resize(frame, (display_width, display_height), interpolation=interpolation)
        display_frame = cv2.copyMakeBorder(
            resized_frame,
            (window_height - display_height) // 2,
            (window_height - display_height + 1) // 2,
            (window_width - display_width) // 2,
            (window_width - display_width + 1) // 2,
            cv2.BORDER_CONSTANT,
            value=(0, 0, 0),
        )

        header_height = max(1, int(60 * scale))
        text_scale = 0.7 * scale
        text_thickness = max(1, int(2 * scale))
        cv2.rectangle(display_frame, (0, 0), (window_width, header_height), (0, 0, 0), -1)
        cv2.putText(display_frame, f"Current: {current_pred}", (int(10 * scale), int(25 * scale)),
                    cv2.FONT_HERSHEY_SIMPLEX, text_scale, (255, 255, 255), text_thickness)
        cv2.putText(display_frame, f"Text: {confirmed_text}", (int(10 * scale), int(50 * scale)),
                    cv2.FONT_HERSHEY_SIMPLEX, text_scale, (0, 255, 0), text_thickness)

        cv2.imshow(window_name, display_frame)
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