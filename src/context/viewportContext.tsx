import React, { createContext, useState, useEffect } from "react";

type ContextType = {
    width: number;
    height: number;
    bodyTop: number,
    bodyLeft: number,
    bodyWidth: number,
    bodyHeight: number,
    isDown: boolean,
    isMobile: boolean,
};

export const viewportContext = createContext<ContextType>({
    width: 1920,
    height: 1080,
    bodyTop: 0,
    bodyLeft: 0,
    bodyWidth: 0,
    bodyHeight: 0,
    isDown: true,
    isMobile: false,
});

type ViewportProps = {
    children: React.ReactNode;
};

const mobileThreshold = 950;

const ViewportProvider: React.FC<ViewportProps> = ({ children }) => {
  // This is the exact same logic that we previously had in our hook

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const [bodyTop, setTop] = useState(document.body.getBoundingClientRect().top);
  const [bodyLeft, setLeft] = useState(document.body.getBoundingClientRect().left);

  const [bodyWidth, setBodyWidth] = useState(document.body.getBoundingClientRect().width);
  const [bodyHeight, setBodyHeight] = useState(document.body.getBoundingClientRect().height);

  const [isDown, setIsDown] = useState(true);
  const [isMobile, setMobile] = useState(mobileThreshold > window.innerWidth);

  let oldScroll = 0;
  const scrollHandler = (event: Event) => {
      let bodyTop = document.body.getBoundingClientRect().top;

      setTop(document.body.getBoundingClientRect().top);
      setLeft(document.body.getBoundingClientRect().left);

      setBodyWidth(document.body.getBoundingClientRect().width);
      setBodyHeight(document.body.getBoundingClientRect().height);

      if (bodyTop - oldScroll !== 0) {
          setIsDown((bodyTop - oldScroll) < 0 ? true : false);
      }

      oldScroll = bodyTop;
  };

  const handleWindowResize = () => {
     setBodyWidth(document.body.getBoundingClientRect().width);
    setBodyHeight(document.body.getBoundingClientRect().height);
      
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    setMobile(mobileThreshold > window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('scroll', scrollHandler);

    return () => {
      window.removeEventListener('resize', handleWindowResize)
      window.removeEventListener('scroll', scrollHandler)
    };
  }, []);

  /* Now we are dealing with a context instead of a Hook, so instead
     of returning the width and height we store the values in the
     value of the Provider */
  return (
    <viewportContext.Provider value={{ width, height, bodyTop, bodyLeft, bodyWidth, bodyHeight, isDown, isMobile }}>
      {children}
    </viewportContext.Provider>
  );
};

export default ViewportProvider;
