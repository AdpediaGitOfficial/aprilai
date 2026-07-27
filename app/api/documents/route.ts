import { NextResponse } from "next/server";
import { ragEnabled } from "@/lib/config";
import { getCurrentUser } from "@/lib/auth/user";
import { ingestDocument, ingestText } from "@/lib/rag/ingest";
import { listDocuments, deleteDocument } from "@/lib/db/documents";

export const maxDuration = 60;

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

function ragDisabledResponse() {
  return NextResponse.json(
    {
      error:
        "Document analysis is not configured. Set DATABASE_URL and OPENAI_API_KEY to enable uploads and retrieval.",
    },
    { status: 501 },
  );
}

export async function GET() {
  const user = await getCurrentUser();
  const documents = await listDocuments(user.id);
  return NextResponse.json({ documents, ragEnabled });
}

export async function POST(request: Request) {
  if (!ragEnabled) return ragDisabledResponse();
  const user = await getCurrentUser();
  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "No file provided." }, { status: 400 });
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: "File exceeds the 10 MB limit." }, { status: 413 });
      }
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await ingestDocument({
        userId: user.id,
        filename: file.name,
        contentType: file.type,
        bytes,
      });
      return NextResponse.json({ document: doc });
    }

    const body = (await request.json()) as { title?: string; text?: string };
    if (!body.text?.trim()) {
      return NextResponse.json({ error: "Provide text to ingest." }, { status: 400 });
    }
    const doc = await ingestText({
      userId: user.id,
      title: body.title?.trim() || "Pasted text",
      text: body.text,
    });
    return NextResponse.json({ document: doc });
  } catch (err) {
    console.error("[/api/documents] POST", err);
    const message = err instanceof Error ? err.message : "Failed to ingest document.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!ragEnabled) return ragDisabledResponse();
  const user = await getCurrentUser();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing document id." }, { status: 400 });
  await deleteDocument(user.id, id);
  return NextResponse.json({ ok: true });
}
