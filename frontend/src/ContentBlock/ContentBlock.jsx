import './ContentBlock.css'

export default function ContentBlock({ children, className }) {
   let classnames = "content_block"
   if (className) classnames += " " + className;

   return (
      <div className={classnames}>
         {children}
      </div>
   )
}