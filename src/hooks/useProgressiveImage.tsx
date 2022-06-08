import React, { useState, useEffect } from "react";

const useProgressiveImage = (src: null | string) => {  
    const [sourceLoaded, setSourceLoaded] = useState< null | string>(null);
  
    useEffect(() => {
      const img = new Image()
      if (src !== null) {
        img.src = src
        img.onload = () => setSourceLoaded(src)
      }
      
    }, [src])
  
    return sourceLoaded 
  }

export default useProgressiveImage;