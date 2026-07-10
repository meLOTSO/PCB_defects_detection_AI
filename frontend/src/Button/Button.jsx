import './Button.css'

export default function Button({ children, onClick, className, disabled }) {
   let classname = "btn-black";
   if (className) classname += " " + className;
   return (
      <button type="button" className={classname} onClick={onClick} disabled={disabled}>
         {children}
      </button>
   );
}