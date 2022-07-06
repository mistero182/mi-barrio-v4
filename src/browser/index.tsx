// Load polyfills (once, on the top of our web app)
import "core-js/stable";
import "regenerator-runtime/runtime";
import "./index.css";

/**
 * Frontend code running in browser
 */
import * as React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import ConfigContext from "../context/ConfigContext";
import { Config } from "../server/config";
import App from "../App";

import ViewportProvider from '../context/viewportContext';

declare global {
  // interface Window { MyNamespace: any; }
  interface Window { __CONFIG__: any; }
}

// window.MyNamespace = window.MyNamespace || {};

const config = window.__CONFIG__ as Config;
delete window.__CONFIG__;

/** Components added here will _only_ be loaded in the web browser, never for server-side rendering */
const render = () => {
  hydrate(
    <>
      {/* The configuration is the outmost component. This allows us to read the configuration even in the theme */}
      <ConfigContext.Provider value={config}>
        <ViewportProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ViewportProvider>
      </ConfigContext.Provider>
    </>,
    document.getElementById("root"),
  );
};

render();
