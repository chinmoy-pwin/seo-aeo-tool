/**
 * Mocked Google/Bing Indexing API client.
 * Simulates submission latency and randomized success/failure.
 */
export interface IndexSubmitResult {
  success: boolean;
  engine: string;
  url: string;
  response: Record<string, unknown>;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitUrlToEngine(url: string, engine: string): Promise<IndexSubmitResult> {
  await delay(150 + Math.random() * 350);
  // ~90% success rate
  const success = Math.random() > 0.1;
  return {
    success,
    engine,
    url,
    response: {
      submittedAt: new Date().toISOString(),
      type: 'URL_UPDATED',
      mockEngine: engine,
      status: success ? 'accepted' : 'error',
      ...(success ? {} : { error: 'Quota or transient error (mock)' }),
    },
  };
}