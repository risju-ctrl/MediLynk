import { useCallback, useEffect, useRef, useState } from 'react';
import { REJOIN_WINDOW_MIN, VIDEO_START_LIMIT_SEC } from '../utils/timeRules.js';

// Placeholder video session (REQ-07, REQ-08). No real video SDK is used.
// States: idle -> connecting -> live -> dropped -> rejoining -> live | failed
export function useVideoSession() {
  const [state, setState] = useState('idle');
  const [startSeconds, setStartSeconds] = useState(null);
  const [droppedAt, setDroppedAt] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [rejoinSecondsLeft, setRejoinSecondsLeft] = useState(REJOIN_WINDOW_MIN * 60);
  const rejoinFails = useRef(false);

  const start = useCallback(() => {
    setState('connecting');
    const began = Date.now();
    setTimeout(() => {
      setStartSeconds((Date.now() - began) / 1000);
      setState('live');
    }, 700 + Math.random() * 900);
  }, []);

  const drop = useCallback(() => {
    setState('dropped');
    setDroppedAt(Date.now());
    setAttempts(0);
    setRejoinSecondsLeft(REJOIN_WINDOW_MIN * 60);
  }, []);

  // The rejoin window is the 2-minute rule from REQ-07.
  useEffect(() => {
    if (state !== 'dropped' && state !== 'rejoining') return undefined;
    const timer = setInterval(() => {
      setRejoinSecondsLeft((left) => {
        if (left <= 1) {
          setState((current) => (current === 'live' ? current : 'failed'));
          return 0;
        }
        return left - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [state]);

  const rejoin = useCallback(() => {
    setState('rejoining');
    setAttempts((count) => count + 1);
    setTimeout(() => {
      if (rejoinFails.current) {
        setState('dropped');
      } else {
        setState('live');
      }
    }, 900);
  }, []);

  const setRejoinWillFail = useCallback((value) => {
    rejoinFails.current = value;
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setStartSeconds(null);
    setDroppedAt(null);
    setAttempts(0);
  }, []);

  const startWithinLimit = startSeconds !== null && startSeconds <= VIDEO_START_LIMIT_SEC;

  return {
    state,
    start,
    drop,
    rejoin,
    reset,
    setRejoinWillFail,
    startSeconds,
    startWithinLimit,
    droppedAt,
    attempts,
    rejoinSecondsLeft,
  };
}
