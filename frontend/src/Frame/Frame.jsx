import './Frame.css'

export default function Frame({ children, display, setDisplay, className }) {
   let classnames = "frame-content";
   if (className) classnames += " " + className;
   return (
      <div className="frame" onClick={() => setDisplay("none")} style={{ display: display }}>
         <div className="frame-inner">
            <div className={classnames} onClick={(e) => e.stopPropagation()}>
               {children}
            </div>
         </div>
      </div>
   )
}