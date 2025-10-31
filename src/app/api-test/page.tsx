'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { testApiKey } from '@/ai/flows/api-test-flow';
import { cn } from '@/lib/utils';

export default function ApiTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; data: any } | null>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setResult(null);
    const response = await testApiKey();
    setResult(response);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Gemini API Key Test</CardTitle>
          <CardDescription>
            Click the button below to perform a simple test to check if your Google API key is configured correctly and the connection to the Gemini API is working.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleTest} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Testing...' : 'Run API Test'}
          </Button>

          {result && (
            <div className="p-4 rounded-lg bg-secondary">
              <h3 className="font-semibold mb-2">Test Result:</h3>
              <pre
                className={cn(
                  'whitespace-pre-wrap break-words text-sm p-4 rounded-md',
                  result.success ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
                )}
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
