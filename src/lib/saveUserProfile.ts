import { supabase } from "../config/supabase";
import type { Profile } from "../types/types";
import { uploadFileToSupabase } from "./upload";

/**
 * Save or update a user's profile, creating one if it doesn't exist.
 */
export async function saveUserProfile({
  userId,
  userEmail,
  userMeta,
  name,
  bio,
  avatarFile,
}: {
  userId: string;
  userEmail?: string;
  userMeta?: { username?: string };
  name?: string;
  bio?: string;
  avatarFile?: File | null;
}): Promise<Profile> {
  const {
    data: { user: sessionUser },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !sessionUser) {
    throw sessionError ?? new Error("No active Supabase session.");
  }

  if (sessionUser.id !== userId) {
    throw new Error("Mismatch between auth session and user ID.");
  }

  let avatarUrl: string | undefined;
  if (avatarFile) {
    avatarUrl = await uploadFileToSupabase({
      file: avatarFile,
      bucket: "chat-app",
      userId: sessionUser.id,
      upsert: true,
    });
  }

  const profile: Profile = {
    id: userId,
    username: userMeta?.username ?? "",
    name: name ?? "",
    bio: bio ?? "",
    avatar: avatarUrl ?? "",
    last_seen: new Date().toISOString(),
    email: userEmail ?? "",
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(profile, { onConflict: "id" })
    .select()
    .maybeSingle();

  if (error || !data) throw error ?? new Error("Failed to save profile");

  return data;
}
