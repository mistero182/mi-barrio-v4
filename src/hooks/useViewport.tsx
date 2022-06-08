import React, { useContext } from "react";
import { viewportContext }  from '../context/viewportContext';

const useViewport = () => {
    /* We can use the "useContext" Hook to acccess a context from within
        another Hook, remember, Hooks are composable! */
    const { width, height, bodyTop, bodyLeft, bodyWidth, bodyHeight, isDown, isMobile } = useContext(viewportContext);
    return { width, height, bodyTop, bodyLeft, bodyWidth, bodyHeight, isDown, isMobile };
}

export default useViewport
