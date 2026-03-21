import { useEffect, useState } from 'react'

export const useTime = (interval: number) => {
  const [time, updateTime] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => updateTime(Date.now()), interval)
    return () => {
      clearInterval(intervalId)
    }
  }, [interval]);

  return time;
}
