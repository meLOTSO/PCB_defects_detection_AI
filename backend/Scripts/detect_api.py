import os
import sys
import json
import warnings
warnings.filterwarnings("ignore")

original_stdout = sys.stdout

def process_single_image(model, confidence, image_size, image_path):
   import cv2
   
   image = cv2.imread(image_path)
   if image is None:
      return {
         "success": False,
         "error": f"Не удалось загрузить {image_path}",
         "filename": os.path.basename(image_path)
      }
   
   results = model.predict(
      source=image_path,
      conf=confidence,
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
            detections.append({
               "classId": class_id,
               "className": class_name,
               "confidence": confidence,
               "bbox": [x1, y1, x2, y2]
            })
   
   sys.stderr.write(f"[{__name__}]: Найдено {len(detections)} детекций в {image_path}\n")
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

def process_batch(model_path, confidence, image_size, image_paths):
   sys.stdout = sys.stderr
   
   from ultralytics import YOLO
   model = YOLO(model_path)
   results = []
   
   sys.stderr.write(f"[process_batch]: model.names = {model.names}")
   sys.stdout.flush()
   
   for path in image_paths:
      result = process_single_image(model, confidence, image_size, path)
      results.append(result)
   
   sys.stdout = original_stdout
   
   return json.dumps({
      "success": True,
      "total": len(results),
      "results": results
   }, ensure_ascii=False)

if __name__ == "__main__":
   if len(sys.argv) < 5:
      sys.stdout = original_stdout
      print(json.dumps({"error": "Недостаточно аргументов"}))
      sys.exit(1)
   
   model_path = sys.argv[1]
   confidence = float(sys.argv[2])
   image_size = int(sys.argv[3])
   image_paths = json.loads(sys.argv[4])
   
   result = process_batch(model_path, confidence, image_size, image_paths)
   print(result)