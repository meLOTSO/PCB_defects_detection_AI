import os
import sys
import json
import warnings
warnings.filterwarnings("ignore")

original_stdout = sys.stdout

def process_single_image(image_path, model, selected_names, confidence_threshold, image_size):
   import cv2
   
   image = cv2.imread(image_path)
   if image is None:
      return {
         "success": False,
         "error": f"Не удалось загрузить {image_path}",
         "filename": os.path.basename(image_path)
      }
   
   if not selected_names:
      return {
         "success": True,
         "filename": os.path.basename(image_path),
         "width": image.shape[1],
         "height": image.shape[0],
         "detections": []
      }
   
   results = model.predict(
      source=image_path,
      conf=confidence_threshold,
      iou=0.45,
      imgsz=image_size,
      verbose=False
   )
   
   detections = []
   for result in results:
      boxes = result.boxes
      if boxes is not None:
         for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            confidence = float(box.conf[0])
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            if class_name in selected_names:
               detections.append({
                  "classId": class_id,
                  "className": class_name,
                  "confidence": confidence,
                  "bbox": [x1, y1, x2, y2]
               })
   
   sys.stderr.write(f"Found {len(detections)} detections for {image_path}\n")
   sys.stderr.flush()
   
   return {
      "success": True,
      "filename": os.path.basename(image_path),
      "width": image.shape[1],
      "height": image.shape[0],
      "detections": [
         {
            "classId": d["classId"],
            "className": d["className"],
            "confidence": round(d["confidence"], 3),
            "bbox": {
               "x1": round(d["bbox"][0], 1),
               "y1": round(d["bbox"][1], 1),
               "x2": round(d["bbox"][2], 1),
               "y2": round(d["bbox"][3], 1),
            }
         }
         for d in detections
      ]
   }

def process_batch(image_paths, model_path, selected_names, confidence_threshold, image_size):
   sys.stdout = sys.stderr
   
   from ultralytics import YOLO
   model = YOLO(model_path)
   results = []
   
   sys.stderr.write(f"model.names: {model.names}")
   sys.stderr.write(f"selected names: {selected_names}")
   sys.stdout.flush()
   
   for path in image_paths:
      result = process_single_image(path, model, selected_names, confidence_threshold, image_size)
      results.append(result)
   
   sys.stdout = original_stdout
   
   return json.dumps({
      "success": True,
      "total": len(results),
      "results": results
   }, ensure_ascii=False)

if __name__ == "__main__":
   if len(sys.argv) < 6:
      sys.stdout = original_stdout
      print(json.dumps({"error": "Недостаточно аргументов"}))
      sys.exit(1)
   
   model_path = sys.argv[1]
   image_size = int(sys.argv[2])
   image_paths = json.loads(sys.argv[3])
   selected_names = json.loads(sys.argv[4])
   confidence_threshold = float(sys.argv[5])
   
   result = process_batch(image_paths, model_path, selected_names, confidence_threshold, image_size)
   print(result)