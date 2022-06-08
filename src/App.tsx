import * as React from "react";
import {Route, Routes, useLocation} from "react-router-dom";

import { Home } from './views/home/Home'
import { Distrito } from './views/distrito/Distrito'

import {useEffect} from "react";

/**
 * Our Web Application
 */
export default function App() {
    const { pathname, hash, key } = useLocation();

    useEffect(() => {
        if (hash === '') {
            window.scrollTo(0, 0);
        }
        else {
            setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView();
                }
            }, 0);
        }
    }, [pathname, hash, key]);


  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/distrito" element={<Distrito />} />
      </Routes>
    </div>
  );
}
