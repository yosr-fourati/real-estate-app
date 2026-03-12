import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client (browser-safe)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (server-only, has full access)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : null;

export const STORAGE_BUCKET = "properties";

export async function uploadPropertyImage(
  file: File,
  propertyId: string
): Promise<string> {
  if (!supabaseAdmin) throw new Error("Supabase admin client not configured");

  const ext = file.name.split(".").pop();
  const fileName = `${propertyId}/${Date.now()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, { upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deletePropertyImage(url: string): Promise<void> {
  if (!supabaseAdmin) throw new Error("Supabase admin client not configured");

  // Extract file path from URL
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split(`/${STORAGE_BUCKET}/`);
  if (pathParts.length < 2) return;

  await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([pathParts[1]]);
}
