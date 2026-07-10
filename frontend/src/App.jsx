import { useState } from 'react'
import './App.css'
import Header from './Header/Header'
import ContentBlock from './ContentBlock/ContentBlock'
import Setting from './Setting/Setting'
import SelectedImagesSection from './SelectedImagesSection/SelectedImagesSection'
import ResultImageSection from './ResultImageSection/ResultImageSection'
import { traceDefectsClassesMap, pcbDefectsClassesMap } from '../data/classes'

function App() {
   const [images, setImages] = useState([]);
   const [results, setResults] = useState([]);
   const [activeResultIndex, setActiveResultIndex] = useState(0);
   const [confidence, setConfidence] = useState(80);
   const [traceDefects, setTraceDefects] = useState(Object.keys(traceDefectsClassesMap));
   const [pcbDefects, setPcbDefects] = useState(Object.keys(pcbDefectsClassesMap));
   const [loading, setLoading] = useState(false);

   async function handleDetect() {
      if (images.length === 0) return;

      const formData = new FormData();
      images.forEach(file => formData.append("images", file));
      formData.append("confidence_threshold", confidence.toString());
      // Object.keys(traceDefectsClassesMap).forEach(defect => formData.append("trace_defects", defect));
      // Object.keys(pcbDefectsClassesMap).forEach(defect => formData.append("pcb_defects", defect));
      traceDefects.forEach(defect => formData.append("trace_defects", defect));
      pcbDefects.forEach(defect => formData.append("pcb_defects", defect));

      setLoading(true);
      try {
         const response = await fetch("/detect", {
            method: "POST",
            body: formData
         });

         if (!response.ok) {
            const text = await response.text();
            throw new Error(text || "Ошибка детекции");
         }

         const data = await response.json();
         console.log("DATA: ", data);

         const traceResults = data?.trace_defects?.results || [];
         const pcbResults = data?.pcb_defects?.results || [];

         const combinedResults = traceResults.map((traceResult, index) => {
            const pcbResult = pcbResults[index] || { detections: [] };

            return {
               filename: traceResult.filename || traceResult.Filename || `image_${index}`,
               detections: [
                  ...(traceResult.detections || traceResult.Detections || []),
                  ...(pcbResult.detections || pcbResult.Detections || [])
               ],
               width: traceResult.width || traceResult.Width || 640,
               height: traceResult.height || traceResult.Height || 640,
               success: true,
               index: index
            };
         });

         setResults(combinedResults);
         setActiveResultIndex(0);
      } finally {
         setLoading(false);
      }
   }

   function handleImageSelect(event) {
      const files = Array.from(event.target.files);
      setImages(files);
      setResults([]);
      setActiveResultIndex(0);
   }

   const activeResult = results.find(
      r => r.fileName === images[activeResultIndex]?.name
   ) || results[activeResultIndex];

   return (
      <>
         <Header />
         <ContentBlock>
            <Setting
               onImageChange={handleImageSelect}
               onDetect={handleDetect}
               onConfidenceChange={setConfidence}
               onTraceDefectsChange={setTraceDefects}
               onPcbDefectsChange={setPcbDefects}
               isLoading={loading}
               traceDefectsClassesMap={traceDefectsClassesMap}
               pcbDefectsClassesMap={pcbDefectsClassesMap} />
         </ContentBlock>
         {images.length > 0 && <SelectedImagesSection
            images={images}
            activeIndex={activeResultIndex}
            hasResults={results.length !== 0}
            onImageClick={setActiveResultIndex} />}
         {activeResult && (<ResultImageSection result={activeResult} images={images} activeIndex={activeResultIndex} />)}
      </>
   )
}

export default App
