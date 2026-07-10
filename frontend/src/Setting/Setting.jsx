import './Setting.css'
import Button from '../Button/Button';
import Select from '../Select/Select';
import Slider from '../Slider/Slider';

export default function Setting({ onImageChange, onDetect, onConfidenceChange, onTraceDefectsChange, onPcbDefectsChange, isLoading, traceDefectsClassesMap, pcbDefectsClassesMap }) {
   return (
      <form action="/detect" method="post" className="setting" onSubmit={(e) => e.preventDefault()}>
         <Button className="btn-select_images" onClick={() => document.getElementById("select_images").click()}>
            <input type="file" name="select_images" id="select_images" accept=".jpeg, .jpg, .png" onChange={onImageChange} multiple />
            select_images
         </Button>

         <Button className="btn-select_cad_file" onClick={() => document.getElementById("select_cad_file").click()}>
            <input type="file" name="select_cad_file" id="select_cad_file" accept=".dxf" />
            select_CAD_file
         </Button>

         <Select className="trace_defects-select" onChange={onTraceDefectsChange}>
            <select
               name="trace_defects"
               id="trace_defects"
               multiple
               defaultValue={Object.keys(traceDefectsClassesMap)}>
               {Object.keys(traceDefectsClassesMap).map(key =>
                  <option value={key} key={key}>{traceDefectsClassesMap[key]}</option>)}
            </select>
         </Select>

         <Select className="pcb_defects-select" onChange={onPcbDefectsChange}>
            <select
               name="pcb_defects"
               id="pcb_defects"
               defaultValue={Object.keys(pcbDefectsClassesMap)}
               multiple>
               {Object.keys(pcbDefectsClassesMap).map(key => {
                  return <option value={key} key={key}>{pcbDefectsClassesMap[key]}</option>
               })}
            </select>
         </Select>

         <Button className="confidence_threshold">
            <div>confidence_threshold</div>
            <Slider min={0} max={1} initialValue={0.80} step={0.01} onChange={onConfidenceChange} ></Slider>
         </Button>

         <div className="yolo">YOLO</div>

         <Button
            className={"submit-btn " + (isLoading ? "loading" : "")}
            onClick={onDetect}
            disabled={isLoading}>
            {isLoading ? "loading..." : "send"}</Button>

      </form>
   )
}
