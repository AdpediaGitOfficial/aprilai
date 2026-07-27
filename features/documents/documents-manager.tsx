"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, FileText, Trash2, Loader2, ClipboardPaste } from "lucide-react";
import type { DocumentSummary } from "@/lib/types";

export function DocumentsManager({ initial }: { initial: DocumentSummary[] }) {
  const [docs, setDocs] = useState<DocumentSummary[]>(initial);
  const [busy, setBusy] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const addDoc = (doc: DocumentSummary) => setDocs((prev) => [doc, ...prev]);

  const uploadFile = async (file: File) => {
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/documents", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");
      addDoc(data.document);
      toast.success(`Indexed “${data.document.title}” (${data.document.chunkCount} chunks)`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const submitText = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to add text.");
      addDoc(data.document);
      toast.success(`Indexed “${data.document.title}”`);
      setTitle("");
      setText("");
      setPasteOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add text.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    const prev = docs;
    setDocs((d) => d.filter((x) => x.id !== id));
    try {
      const res = await fetch(`/api/documents?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setDocs(prev);
      toast.error("Could not delete document.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border-strong bg-surface/50 px-6 py-8 text-center transition-all hover:border-primary/50 hover:bg-surface-elevated disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="size-6 animate-spin text-primary" />
          ) : (
            <Upload className="size-6 text-primary" />
          )}
          <span className="text-sm font-medium text-foreground">Upload a document</span>
          <span className="text-xs text-muted-foreground">PDF, .txt, or .md · up to 10 MB</span>
        </button>

        <button
          onClick={() => setPasteOpen((v) => !v)}
          className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface/40 px-6 py-8 text-center transition-all hover:border-primary/40 hover:bg-surface-elevated"
        >
          <ClipboardPaste className="size-6 text-primary" />
          <span className="text-sm font-medium text-foreground">Paste text</span>
          <span className="text-xs text-muted-foreground">Add a clause or excerpt directly</span>
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.txt,.md,.markdown,text/plain,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
        }}
      />

      {pasteOpen && (
        <div className="rounded-2xl border border-border bg-surface/50 p-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="mb-2 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="Paste contract text, a clause, or notes…"
            className="w-full resize-none rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => setPasteOpen(false)}
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={submitText}
              disabled={busy || !text.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
            >
              {busy && <Loader2 className="size-3.5 animate-spin" />} Index text
            </button>
          </div>
        </div>
      )}

      {/* Document list */}
      <div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Your documents ({docs.length})
        </div>
        {docs.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface/30 px-6 py-10 text-center text-sm text-muted-foreground">
            No documents yet. Upload or paste one, then ask April about it in chat.
          </div>
        ) : (
          <ul className="space-y-1.5">
            {docs.map((d) => (
              <li
                key={d.id}
                className="group flex items-center gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3 transition-colors hover:border-border-strong"
              >
                <FileText className="size-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{d.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {d.chunkCount} chunks · {new Date(d.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => remove(d.id)}
                  aria-label="Delete document"
                  className="grid size-7 place-items-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-destructive/15 hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
