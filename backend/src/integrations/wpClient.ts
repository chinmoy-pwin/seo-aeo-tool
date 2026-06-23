/**
 * Mocked WordPress REST API publishing client.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface WpPublishResult {
  success: boolean;
  remotePostId: string | null;
  error?: string;
}

export async function publishToWordPress(
  siteUrl: string,
  _username: string,
  _appPassword: string,
  title: string,
  _body: string,
  status: 'draft' | 'publish',
): Promise<WpPublishResult> {
  await delay(300 + Math.random() * 600);
  const success = Math.random() > 0.05;
  if (!success) {
    return { success: false, remotePostId: null, error: 'WP REST API returned 500 (mock)' };
  }
  void siteUrl;
  void title;
  void status;
  return {
    success: true,
    remotePostId: String(Math.floor(1000 + Math.random() * 9000)),
  };
}