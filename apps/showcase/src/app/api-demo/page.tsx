/**
 * @author Mikiyas Birhanu And AI
 * @description API Demo page
 */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@packages/ui';
import ApiDemo from '@/components/api-demo';

export default function ApiDemoPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Integration</h1>
        <p className="text-muted-foreground mt-2">
          Demonstration of API calls using React Query and the API configuration
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiDemo />
        </CardContent>
      </Card>
    </div>
  );
}
