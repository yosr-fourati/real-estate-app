import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";

// POST /api/upload - upload image to Supabase Storage (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase non configuré. Vérifiez SUPABASE_SERVICE_ROLE_KEY." },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const propertyId = (formData.get("propertyId") as string) ?? "temp";

    if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Type de fichier non autorisé (jpg, png, webp)" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop lourd (max 5MB)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop();
    const fileName = `${propertyId}/${Date.now()}.${ext}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[Upload error]", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);

    return NextResponse.json({ url: data.publicUrl }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
