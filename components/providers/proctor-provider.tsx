'use client';

import { ReactNode, useEffect, useRef } from 'react';
import useProctoring from '@/hooks/useProctoring';
import useUser from '@/hooks/use-user';

interface ProctorProviderProps {
  children: ReactNode;
  examId?: string;
}

export function ProctorProvider({ children, examId }: ProctorProviderProps) {
  const logs = useProctoring();
  const { data: user } = useUser();
  const lastProcessedLogTimestamp = useRef<number | null>(null);

  useEffect(() => {
    // Only process logs if there are new ones and they haven't been processed yet
    // Also ensure we have a user ID before sending logs
    if (
      logs.length > 0 && 
      user?.id &&
      (!lastProcessedLogTimestamp.current || logs[0].timestamp > lastProcessedLogTimestamp.current)
    ) {
      // Send logs to the API
      fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: logs.map((log) => ({
            ...log,
            examId, // Include exam ID if provided
            userId: user.id, // Include the authenticated user's ID
          })),
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          // Update the last processed timestamp after successful send
          lastProcessedLogTimestamp.current = logs[logs.length - 1].timestamp;
        })
        .catch((error) => {
          console.error('Failed to send proctoring logs:', error);
          // Optionally retry or handle failed logs here
        });
    }
  }, [logs, examId, user?.id]); // Added user?.id to dependencies

  return <>{children}</>;
}