import { useState } from 'react';
import './DefectPlace.css'
import { traceDefectsClassesMap } from '../../data/classes';

export default function DefectPlace({ x1, y1, x2, y2, color, index, setDetectionIndex, onMouseMove }) {
   const width = x2 - x1;
   const height = y2 - y1;

   const baseStyle = {
      left: `${x1}px`,
      top: `${y1}px`,
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: color,
      pointerEvents: "auto"
   }
   const hoverStyle = {
      left: `${x1}px`,
      top: `${y1}px`,
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: "transparent",
      border: `4px solid ${color}`,
      pointerEvents: "auto"
   }

   const [style, setStyle] = useState(baseStyle)

   return (
      <div className="defect_place"
         style={style}
         onMouseEnter={() => {
            setStyle(hoverStyle);
         }}
         onMouseLeave={() => {
            setStyle(baseStyle);
            setDetectionIndex(null);
         }}
         onMouseMove={(e) => {
            onMouseMove(e);
            setDetectionIndex(index);
         }}>
         {/* <span className='defect_label' style={{ left: mouseX, top: mouseY }}>{traceDefectsClassesMap[defect_name]} {confidence}</span> */}
      </div>
   )
}