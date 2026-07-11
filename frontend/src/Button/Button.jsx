import './Button.css'
import Message from '../Message/Message';
import { useState } from 'react';

export default function Button({ children, onClick, className, disabled, alt }) {
   const [hover, setHover] = useState(false);

   let classname = "btn-black";
   if (className) classname += " " + className;
   return (
      <>
         <button
            type="button"
            className={classname}
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            {children}
         </button>
         {(alt && hover) &&
            <Message className="button-alt">
               {alt}
            </Message>}
      </>
   );
}

