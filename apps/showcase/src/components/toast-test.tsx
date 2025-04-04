/**
 * @author Mikiyas Birhanu And AI
 * @description Test component for toast functionality
 */
'use client';

import { useToast } from '@packages/ui';
import { Button } from '@packages/ui';

export function ToastTest() {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold">Toast Test</h2>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            toast({
              title: "Default Toast",
              description: "This is a default toast message",
            });
          }}
        >
          Default Toast
        </Button>
        <Button
          onClick={() => {
            toast({
              title: "Destructive Toast",
              description: "This is a destructive toast message",
              variant: "destructive",
            });
          }}
        >
          Destructive Toast
        </Button>
        <Button
          onClick={() => {
            toast({
              title: "Custom Duration",
              description: "This toast will stay for 10 seconds",
              duration: 10000,
            });
          }}
        >
          Custom Duration
        </Button>
      </div>
    </div>
  );
} 