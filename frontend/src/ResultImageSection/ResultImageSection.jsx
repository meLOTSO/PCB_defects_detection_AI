import './ResultImageSection.css'
import ContentBlock from '../ContentBlock/ContentBlock';
import DefectPlace from '../DefectPlace/DefectPlace';
import Message from '../Message/Message';

import { useEffect, useRef, useState } from 'react';
import { pcbDefectsClassesMap, traceDefectsClassesMap } from '../../data/classes';

export default function ResultImageSection({ result, images, activeIndex, defectNames, confidence }) {
   const [scale, setScale] = useState(1);
   const [detectionIndex, setDetectionIndex] = useState(null);
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

   const imageRef = useRef(null);

   function calculateScale() {
      const img = imageRef.current;
      if (img && result?.width) {
         const clientWidth = img.getBoundingClientRect().width;
         const originalWidth = result.width;
         const newScale = clientWidth / originalWidth;
         setScale(newScale);
      }
   }

   useEffect(() => {
      const timer = setTimeout(calculateScale, 100);

      const img = imageRef.current;
      if (img) {
         img.addEventListener('load', calculateScale);
      }

      window.addEventListener('resize', calculateScale);

      return () => {
         clearTimeout(timer);
         if (img) {
            img.removeEventListener('load', calculateScale);
         }
         window.removeEventListener('resize', calculateScale);
      }
   }, [result]);

   useEffect(() => {
      calculateScale();
   }, [result]);

   function handlerMouseMove(e) {
      setMousePosition({ x: e.clientX, y: e.clientY });
   }
   function getDefectName(index) {
      if (index === null || index === undefined) return '';
      return result.detections[index]?.className || '';
   }
   function getDefectConf(index) {
      if (index === null || index === undefined) return '';
      return result.detections[index]?.confidence || '';
   }

   console.log("RESULT: ", result);
   console.log("DEFECTS: ", defectNames);

   const colorProvider = useRef(new ColorsByClassProvoder()).current;

   return (
      <section className="result_images-section">
         <ContentBlock className='result-image'>
            <div className="result-image-inner">
               <img
                  ref={imageRef}
                  src={URL.createObjectURL(images[activeIndex])}
                  alt={result.filename}
                  id={"defect_image" + result.filename}
                  onLoad={() => {
                     setTimeout(calculateScale, 50);
                  }} />
               {result.detections?.map((det, index) => {
                  if (det.confidence >= confidence && defectNames.includes(det.className))
                     return <DefectPlace
                        key={`defect_${result.filename}_${index}_${scale}`}
                        x1={(det.bbox.x1 * scale)}
                        y1={(det.bbox.y1 * scale)}
                        x2={(det.bbox.x2 * scale)}
                        y2={(det.bbox.y2 * scale)}
                        color={colorProvider.getColorByClassName(det.className)}
                        index={index}
                        setDetectionIndex={setDetectionIndex}
                        onMouseMove={handlerMouseMove}
                     />
               })}
               {detectionIndex !== null && (
                  <Message
                     className="defect_label" >
                     {getDefectName(detectionIndex) in traceDefectsClassesMap
                        ? traceDefectsClassesMap[getDefectName(detectionIndex)]
                        : pcbDefectsClassesMap[getDefectName(detectionIndex)]} {getDefectConf(detectionIndex)}
                  </Message>
               )}
            </div>
         </ContentBlock>
      </section>
   );
}

class ColorsByClassProvoder {
   constructor() {
      this._index = 0;
      this.colorClassNamePair = {};
      this.colors = ["#00ff00", "#ff0000", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ff8800", "#88ff00", "#0088ff", "#ff4400", "#8800ff", "#ffaa00", "#00ff88", "#ff0066", "#6600ff"];
   }

   getColorByClassName = (className) => {
      if (!this.colorClassNamePair[className]) {
         const color = this.colors[this._index];
         this.colorClassNamePair[className] = color;
         this._index++;
         return color;
      } else {
         return this.colorClassNamePair[className];
      }
   }
}