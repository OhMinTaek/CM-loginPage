// src/app/lib/format.ts
import { useEffect, useState } from 'react';

export function useFormatter(date: Date) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    function formatToTimeAgo() {
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
      };

      for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
          return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
      }
      return "just now";
    }

    setTimeAgo(formatToTimeAgo());
    const timer = setInterval(() => setTimeAgo(formatToTimeAgo()), 1000);
    return () => clearInterval(timer);
  }, [date]);

  return timeAgo;
}