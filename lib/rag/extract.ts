import "server-only";

export type ExtractInput = {
  filename: string;
  contentType: string;
  bytes: Uint8Array;
};

/**
 * Extracts plain text from an uploaded file. Supports PDF (via unpdf, no native
 * deps) and UTF-8 text/markdown. Throws on unsupported types.
 */
export async function extractText({
  filename,
  contentType,
  bytes,
}: ExtractInput): Promise<string> {
  const name = filename.toLowerCase();
  const isPdf = contentType.includes("pdf") || name.endsWith(".pdf");

  if (isPdf) {
    const { extractText: extractPdf, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(bytes);
    const { text } = await extractPdf(pdf, { mergePages: true });
    return (Array.isArray(text) ? text.join("\n\n") : text).trim();
  }

  const isText =
    contentType.startsWith("text/") ||
    /\.(txt|md|markdown|csv|json)$/.test(name) ||
    contentType === "application/json";

  if (isText) {
    return new TextDecoder("utf-8").decode(bytes).trim();
  }

  throw new Error(
    `Unsupported file type "${contentType || filename}". Upload a PDF, .txt, or .md file.`,
  );
}
