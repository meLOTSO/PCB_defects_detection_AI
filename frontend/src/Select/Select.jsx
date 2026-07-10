import { useEffect, useRef, useState } from 'react';

import './Select.css'

import Button from '../Button/Button';
import Frame from '../Frame/Frame';
import Option from '../Option/Option';

function normalizeOptions(children) {
   if (!children) return [];
   return Array.isArray(children) ? children : [children];
}

function normalizeDefaultValue(defaultValue) {
   if (defaultValue == null) return [];
   return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
}

function buildSelectedArray(options, defaultValue) {
   const selectedValues = new Set(normalizeDefaultValue(defaultValue));
   return options.map(option => selectedValues.has(option.props.value));
}

export default function Select({ children, className, onChange }) {
   const [frameDisplay, setFrameDisplay] = useState("none")
   const selectRef = useRef(null);
   let classnames = "select";
   if (className) classnames += " " + className;

   if (!children || children.type !== "select") {
      throw new Error("В Select должен быть передан один <select> элемент");
   }

   const options = normalizeOptions(children.props.children);

   const initialSelected = buildSelectedArray(options, children.props.defaultValue);

   const [selectedArray, setSelectedArray] = useState(initialSelected);

   useEffect(() => {
      const selectElement = document.querySelector(
         `select[name="${children.props.name}"], #${children.props.id}`
      );
      if (selectElement) {
         selectRef.current = selectElement;
      }
   }, [children.props.name, children.props.id]);

   useEffect(() => {
      if (!selectRef.current || !onChange) return;

      const selectedValues = Array.from(selectRef.current.selectedOptions).map(o => o.value);
      onChange(selectedValues);
   }, []);

   function clickHandler(index) {
      const newSelectedArray = [...selectedArray];
      newSelectedArray[index] = !newSelectedArray[index];
      setSelectedArray(newSelectedArray);

      if (selectRef.current) {
         const option = selectRef.current.options[index];
         if (option) {
            option.selected = !option.selected;

            const event = new Event('change', { bubbles: true });
            selectRef.current.dispatchEvent(event);
         }
      }
      const selectedValues = Array.from(selectRef.current.selectedOptions).map(o => o.value);
      onChange?.(selectedValues);
   }

   return (
      <div className={classnames}>
         <div className="unvisible">{children}</div>
         <Button className="btn-select" onClick={() => setFrameDisplay(true)}>{children.props.name}</Button>
         <Frame display={frameDisplay} setDisplay={setFrameDisplay} className="trace_defects-frame">
            <h4>{children.props.name}</h4>
            {options.map((option, index) =>
               <Option
                  onClick={() => clickHandler(index)}
                  selected={selectedArray[index]}
                  key={option.props.value}>
                  {option.props.children}</Option>
            )}
         </Frame>
      </div>
   );
}