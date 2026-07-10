import './Option.css'

import Button from '../Button/Button';

export default function Option({ children, onClick, selected }) {
   return (
      <Button onClick={onClick} className={"option-btn " + (selected ? "selected" : "noselected")}>{children}</Button>
   )
}