import React, { useRef, useState } from "react";
import { adminUpload } from "../services/admin";

/**
 * MediaUploader
 * - lets admin pick up to 10 images/videos
 * - uploads to /api/uploads using adminUpload()
 * - shows small previews
 * - supports remove + reorder (Up/Down buttons)
 *
 * Props:
 * - value: current list of URLs
 * - onChange: called with updated list
 */
type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number; // default 10
};

export default function MediaUploader({ value, onChange, max = 10 }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErr(null);
    setBusy(true);
    try {
      const left = Math.max(0, max - value.length);
      const slice = Array.from(files).slice(0, left);
      if (slice.length === 0) {
        setErr(`Limite atteinte (${max} fichiers).`);
        return;
      }

      const urls = await adminUpload(slice);
      onChange([...value, ...urls]);
    } catch (e: any) {
      setErr(e?.message || "Échec d’upload.");
    } finally {
      setBusy(false);
      // allow picking same file again
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeAt(i: number) {
    const next = value.slice();
    next.splice(i, 1);
    onChange(next);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = value.slice();
    const tmp = next[i];
    next[i] = next[j];
    next[j] = tmp;
    onChange(next);
  }

  async function handlePasteUrl(u: string) {
    // very light validation; throws if invalid
    try {
      // IMPORTANT: the previous red underline came from a pasted “–”.
      // Keep this line exactly like this:
      const _ = new URL(u);
      onChange([...value, u]);
      setErr(null);
    } catch {
      setErr("URL invalide");
    }
  }

  return (
    <div className="space-y-3">
      {/* Selected (existing) media */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((u, i) => (
            <div key={u + i} className="relative rounded-lg border bg-white overflow-hidden">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {u.match(/\/video\/|\.mp4|\.webm|\.mov/i) ? (
                  <video className="h-full" src={u} controls />
                ) : (
                  <img className="object-cover w-full h-full" src={u} alt="" />
                )}
              </div>

              <div className="flex justify-between gap-1 p-1">
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => removeAt(i)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={onPickFiles}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy || value.length >= max}
          className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {busy ? "Envoi…" : "Téléverser"}
        </button>

        {/* Quick-add by pasting a URL */}
        <PasteUrl onPasteUrl={handlePasteUrl} disabled={busy || value.length >= max} />
      </div>

      {err && (
        <div className="text-sm text-red-600">{err}</div>
      )}
      {value.length >= max && (
        <div className="text-xs text-gray-500">Limite de {max} éléments atteinte.</div>
      )}
    </div>
  );
}

function PasteUrl({
  onPasteUrl,
  disabled,
}: {
  onPasteUrl: (u: string) => void;
  disabled?: boolean;
}) {
  const [pasteUrl, setPasteUrl] = useState("");
  const [localErr, setLocalErr] = useState<string | null>(null);

  function add() {
    try {
      const _ = new URL(pasteUrl);
      onPasteUrl(pasteUrl.trim());
      setPasteUrl("");
      setLocalErr(null);
    } catch {
      setLocalErr("URL invalide");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        className="w-80 max-w-full rounded border px-3 py-2"
        placeholder="Coller une URL https://…"
        value={pasteUrl}
        onChange={(e) => setPasteUrl(e.target.value)}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={add}
        disabled={disabled}
        className="px-3 py-2 rounded border hover:bg-gray-50 disabled:opacity-60"
      >
        Ajouter via URL
      </button>
      {localErr && <span className="text-sm text-red-600">{localErr}</span>}
    </div>
  );
}
