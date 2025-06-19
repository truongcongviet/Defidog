import AOS from "aos";
import { useEffect, useState } from "react";

import "aos/dist/aos.css";
import "../styles/globals.css";


function MyApp({ Component, pageProps }) {
  // Setup AOS
  useEffect(() => {
    AOS.init({
      duration: 200,
      once: true,
      offset: 50,
    });
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
