import { useEffect, useState } from 'react'
import './Message.css'

export default function Message({ children, className }) {
   const [position, setPosition] = useState({ x: 0, y: 0 });
   const [isReady, setIsReady] = useState(false);

   useEffect(() => {
      function handleMouseMove(e) {
         setPosition({
            x: e.clientX,
            y: e.clientY
         });
         setIsReady(true);
      }

      document.addEventListener('mousemove', handleMouseMove);

      return () => {
         document.removeEventListener('mousemove', handleMouseMove);
      }

   }, []);

   if (!isReady) return null;

   return (
      <div className={"message " + (className ? className : "")} style={{
         left: position.x + "px",
         top: position.y + "px"
      }}>
         {children}
      </div>
   )
}
