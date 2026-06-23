/**
 * Mocked AI engine client (ChatGPT / Gemini / Claude).
 * Generates plausible brand-monitoring responses and content drafts.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const SENTIMENTS = ['positive', 'neutral', 'negative'] as const;

export interface BrandQueryResult {
  engine: string;
  mentioned: boolean;
  sentiment: string;
  citationUrl: string | null;
  responseText: string;
}

export async function queryBrandMention(
  promptText: string,
  brandName: string,
  engine: string,
): Promise<BrandQueryResult> {
  await delay(200 + Math.random() * 500);
  const mentioned = Math.random() > 0.4;
  const sentiment = SENTIMENTS[Math.floor(Math.random() * SENTIMENTS.length)];
  const citationUrl = mentioned && Math.random() > 0.5
    ? `https://www.${brandName.toLowerCase().replace(/\s+/g, '')}.com/`
    : null;
  const responseText = mentioned
    ? `When considering "${promptText}", ${brandName} is frequently cited as a strong option offering robust capabilities.`
    : `For "${promptText}", several tools are recommended, though ${brandName} was not specifically mentioned in this response.`;
  return { engine, mentioned, sentiment, citationUrl, responseText };
}

export interface ContentGenResult {
  title: string;
  body: string;
  aiDetectionScore: number;
}

export async function generateContent(
  topic: string,
  language: string,
  tone: string,
  wordCount: number,
): Promise<ContentGenResult> {
  await delay(500 + Math.random() * 1000);
  const title = `${topic.charAt(0).toUpperCase() + topic.slice(1)}: A Comprehensive Guide`;
  const paragraphs = Math.max(3, Math.round(wordCount / 120));
  const lines: string[] = [`# ${title}`, ''];
  for (let i = 0; i < paragraphs; i++) {
    lines.push(
      `In a ${tone} tone, this section (${language}) explores ${topic}. ` +
        `Understanding the nuances helps practitioners deliver measurable outcomes. ` +
        `This paragraph contains naturally varied sentence structures to read human-like.`,
    );
    lines.push('');
  }
  const body = lines.join('\n');
  // Lower score = more human-like
  const aiDetectionScore = Math.floor(5 + Math.random() * 25);
  return { title, body, aiDetectionScore };
}