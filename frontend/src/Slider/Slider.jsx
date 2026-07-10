import { useState } from 'react';
import './Slider.css'

export default function Slider({ min, max, initialValue, step, className, onChange }) {
   if (initialValue > max || initialValue < min) initialValue = 0;
   const [value, setValue] = useState(initialValue);

   let classnames = "slider"
   if (className) classnames += " " + className;

   function handleChange(e) {
      setValue(e.target.value);
      onChange?.(Number(e.target.value));
   }

   return (
      <div className={classnames}>
         <div className='slider-value'>{value}</div>
         <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            step={step} />
      </div>
   );
}