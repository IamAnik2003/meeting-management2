import { useState, useEffect } from "react";

const useIsMobile = (maxWidth = 455) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.matchMedia(`(max-width: ${maxWidth}px)`).matches);
    };

    checkWidth(); // Check on initial render
    window.addEventListener("resize", checkWidth); // Add event listener for resize

    return () => {
      window.removeEventListener("resize", checkWidth); // Cleanup event listener
    };
  }, [maxWidth]);

  return isMobile;
};

export default useIsMobile;