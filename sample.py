import cv2
import mediapipe as mp
import matplotlib.pyplot as plt
from pathlib import Path

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Drawing utility
mp_draw = mp.solutions.drawing_utils

# Video path. Your file is named sample.mp4.mp4 in this folder.
video_path = Path(__file__).with_name("sample.mp4.mp4")

# Open video
cap = cv2.VideoCapture(str(video_path))

if not cap.isOpened():
    raise FileNotFoundError(f"Could not open video: {video_path}")

fps = cap.get(cv2.CAP_PROP_FPS)
delay = int(1000 / fps) if fps and fps > 0 else 30

# Lists for graph
wrist_y = []
frame_numbers = []

frame_count = 0

while cap.isOpened():

    success, frame = cap.read()

    if not success:
        break

    # Convert frame to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Detect pose
    results = pose.process(rgb_frame)

    # If body keypoints are detected
    if results.pose_landmarks:

        # Draw body skeleton
        mp_draw.draw_landmarks(
            frame,
            results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS
        )

        # RIGHT WRIST landmark
        right_wrist = results.pose_landmarks.landmark[
            mp_pose.PoseLandmark.RIGHT_WRIST
        ]

        # Save Y coordinate
        wrist_y.append(right_wrist.y)
        frame_numbers.append(frame_count)

        # Convert normalized coords to screen coords
        h, w, _ = frame.shape
        cx = int(right_wrist.x * w)
        cy = int(right_wrist.y * h)

        # Draw wrist point
        cv2.circle(frame, (cx, cy), 10, (0, 0, 255), -1)

        # Show coordinate
        cv2.putText(
            frame,
            f"Y: {right_wrist.y:.2f}",
            (cx + 10, cy),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 0, 0),
            2
        )

    else:
        cv2.putText(
            frame,
            "No pose detected",
            (30, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 0, 255),
            2
        )

    # Show video
    cv2.imshow("Pose Keypoints - Press Q to quit", frame)

    frame_count += 1

    # Press Q to quit
    if cv2.waitKey(delay) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# Plot graph
if not wrist_y:
    print("No right wrist keypoint was detected, so no graph can be plotted.")
else:
    plt.plot(frame_numbers, wrist_y, marker="o", linewidth=2)

    plt.title("Right Wrist Y Position Over Time")
    plt.xlabel("Frame Number")
    plt.ylabel("Y Coordinate")
    plt.grid(True)

    plt.show()
