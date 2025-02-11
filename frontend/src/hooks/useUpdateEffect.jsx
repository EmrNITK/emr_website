import { useEffect, useRef } from "react";

const useUpdateEffect = (callback, dependencies) => {
  const isFirstRender = useRef(true);
  const isSecondRender = useRef(false);

  useEffect(() => {
    if (isFirstRender.current) {
      if (!isSecondRender.current) {
        isSecondRender.current = true; // Catch double render in Strict Mode
        return;
      }
      isFirstRender.current = false; // After second render, allow updates
      return;
    }
    return callback();
  }, dependencies);
};

export default useUpdateEffect;
