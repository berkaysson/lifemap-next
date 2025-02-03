import { useState, useEffect } from "react";

interface Device {
  width: number;
  height: number;
}

const useDevice = (): Device => {
  const [windowSize, setDevice] = useState<Device>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDevice({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default useDevice;
