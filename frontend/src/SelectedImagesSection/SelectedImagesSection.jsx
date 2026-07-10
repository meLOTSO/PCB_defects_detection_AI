import './SelectedImagesSection.css'

import ContentBlock from '../ContentBlock/ContentBlock'

export default function SelectedImagesSection({ images, activeIndex, hasResults, onImageClick }) {
   return (
      <section className='selected_image-section'>
         {images.map((image, index) =>
            <ContentBlock
               className={"selected_image" +
                  (hasResults && index === activeIndex ? " selected_image-active" : "") +
                  (hasResults ? " selected_image-interactive" : "")}
               key={"image-" + index}>
               <button
                  type='button'
                  className='selected_image-btn'
                  disabled={!hasResults}
                  onClick={() => onImageClick(index)}>
                  <img
                     src={URL.createObjectURL(image)}
                     alt={image.name} />
                  <div className="image-name">{imageNameSlice(image.name, 18)}</div>
               </button>
            </ContentBlock>
         )}
      </section>
   )
}

function imageNameSlice(imageName, len) {
   if (imageName.length > len) {
      return imageName.slice(0, len) + "...";
   }
   return imageName;
}