'use client';

import { ReactNode, useEffect, useRef } from 'react';
import useProctoring from '@/hooks/useProctoring';
import useUser from '@/hooks/use-user';

interface ProctorProviderProps {
  children: ReactNode;
  testId: string;
}

export function ProctorProvider({ children, testId }: ProctorProviderProps) {
  const logs = useProctoring();
  const { data: user } = useUser();
  const lastProcessedLogTimestamp = useRef<number | null>(null);

  useEffect(() => {
    if (
      logs.length > 0 && 
      user?.id &&
      (!lastProcessedLogTimestamp.current || logs[0].timestamp > lastProcessedLogTimestamp.current)
    ) {
      // Get window and screen dimensions
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const deviceType = /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

      fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: logs.map((log) => ({
            ...log,
            test_id: testId,
            user_id: user.id,
            device_type: deviceType,
            screen_width: screenWidth,
            screen_height: screenHeight,
            window_width: windowWidth,
            window_height: windowHeight,
            // Note: risk scores would be calculated on the server side
          })),
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          lastProcessedLogTimestamp.current = logs[logs.length - 1].timestamp;
        })
        .catch((error) => {
          console.error('Failed to send proctoring logs:', error);
        });
    }
  }, [logs, testId, user?.id]);

  return <>{children}</>;
}