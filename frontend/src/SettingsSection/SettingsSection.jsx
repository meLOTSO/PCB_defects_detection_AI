import Button from '../Button/Button';
import Select from '../Select/Select';
import Slider from '../Slider/Slider';
import ContentBlock from '../ContentBlock/ContentBlock';

import './SettingsSection.css'

export default function SettingsSection({ onImageChange, onDetect, onConfidenceChange, onTraceDefectsChange, onPcbDefectsChange, isLoading, traceDefectsClassesMap, pcbDefectsClassesMap }) {
   return (
      <section className="setting-section">

         <ContentBlock className="setting-content_block filter-block settings-collection">

            <Select className="trace_defects-select" onChange={onTraceDefectsChange} buttonClass="warning-button trace_defects-warning" alt="Warning: Модель может работать некорректно">
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
               <Slider min={0.1} max={1} initialValue={0.1} step={0.01} onChange={onConfidenceChange} ></Slider>
            </Button>
         </ContentBlock>

         <ContentBlock className="setting-content_block setting-label-block">
            <div className="yolo">YOLO</div>
         </ContentBlock>

         <ContentBlock className="setting-content_block form-block">
            <form action="/detect" method="post" className="setting-form settings-collection" onSubmit={(e) => e.preventDefault()}>
               <Button
                  className="btn-select_images"
                  onClick={() => document.getElementById("select_images").click()}>
                  <input
                     type="file"
                     name="select_images"
                     id="select_images"
                     accept=".jpeg, .jpg, .png"
                     onChange={onImageChange}
                     multiple />
                  select_images
               </Button>
               <Button
                  className={"submit-btn " + (isLoading ? "loading" : "")}
                  onClick={onDetect}
                  disabled={isLoading}>
                  {isLoading ? "loading..." : "send"}
               </Button>
            </form>
         </ContentBlock>

      </section>
   )
}
