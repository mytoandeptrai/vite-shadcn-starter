import { isBefore } from "date-fns";
import { useEffect, useState } from "react";

import { DEFAULT_COUNT_DOWN } from "./useCountDown.const";
import { convertTimeCountDown } from "./useCountDown.utils";

const useCountDown = (date?: Date) => {
  const [countdown, setCountdown] = useState(DEFAULT_COUNT_DOWN);
  const [isReady, setIsReady] = useState(false);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    if (date && isBefore(new Date(), date)) {
      const timer = setInterval(() => {
        if (!isReady) setIsReady(true);
        if (!isCounting) setIsCounting(true);
        setCountdown(convertTimeCountDown(date, new Date()));
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    } else {
      if (!isReady) setIsReady(true);
      if (isCounting) setIsCounting(false);

      return setCountdown(DEFAULT_COUNT_DOWN);
    }
  }, [date, isCounting, isReady]);

  return { countdown, isReady, isCounting };
};

export default useCountDown;
