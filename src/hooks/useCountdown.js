import { useEffect, useState } from 'react';
import { now } from '../utils/timeRules.js';

// Whole seconds left until `target`, never negative. Re-renders every second.
export function useCountdown(target) {
  const calculate = () => (target ? Math.max(0, Math.floor((new Date(target) - now()) / 1000)) : 0);
  const [seconds, setSeconds] = useState(calculate);

  useEffect(() => {
    setSeconds(calculate);
    const timer = setInterval(() => setSeconds(calculate), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return seconds;
}
