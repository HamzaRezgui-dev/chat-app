import { supabase } from "../config/supabase";

export async function uploadFileToSupabase({
  file,
  bucket,
  userId,
  folder = "avatars",
}: {
  file: File;
  bucket: string;
  userId: string;
  folder?: string;
  upsert?: boolean;
}): Promise<string> {
  const safeName = file.name
    .replace(/\s/g, "_")
    .replace(/[^a-zA-Z0-9_.-]/g, "");

  const filePath = `${folder}/${userId}/${Date.now()}_${safeName}`;

  console.log("📤 Uploading to path:", filePath);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return publicUrl;
}
