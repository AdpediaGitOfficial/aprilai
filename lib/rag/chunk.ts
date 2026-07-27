/**
 * Splits text into overlapping chunks suitable for embedding. Prefers paragraph
 * boundaries, then packs paragraphs up to a target size with a small overlap so
 * context isn't lost across boundaries.
 */
export type Chunk = { index: number; content: string };

const TARGET_CHARS = 1200;
const OVERLAP_CHARS = 200;

export function chunkText(input: string): Chunk[] {
  const text = input.replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  const push = () => {
    const trimmed = current.trim();
    if (trimmed) chunks.push(trimmed);
  };

  for (const para of paragraphs) {
    // A single oversized paragraph is hard-split by size.
    if (para.length > TARGET_CHARS) {
      push();
      current = "";
      for (let i = 0; i < para.length; i += TARGET_CHARS - OVERLAP_CHARS) {
        chunks.push(para.slice(i, i + TARGET_CHARS).trim());
      }
      continue;
    }

    if (current.length + para.length + 2 > TARGET_CHARS) {
      push();
      const tail = current.slice(-OVERLAP_CHARS);
      current = tail ? tail + "\n\n" + para : para;
    } else {
      current = current ? current + "\n\n" + para : para;
    }
  }
  push();

  return chunks.map((content, index) => ({ index, content }));
}
