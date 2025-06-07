import { createClient } from "@supabase/supabase-js";
import { toast } from "react-toastify";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY environment variable");
}

if (!supabaseUrl) {
  throw new Error("Missing VITE_SUPABASE_URL environment variable");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Sign up a user with email and password
 * @param email user's email
 * @param password user's password
 * @param username optional custom metadata (username)
 */
export async function signUpUser(
  email: string,
  password: string,
  username?: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (error) throw error;
  toast.success("Account creation was successful!");
  return data;
}

/**
 * Log in a user with email and password
 * @param email user's email
 * @param password user's password
 */
export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  toast.success("You have successfully logged in!");
  return data;
}

/**
 * Sign up a user with email and password
 * @param userId user's id
 * @param name user's name
 * @param bio user's bio
 * @param avatarFile optional avatar
 */

export async function updateUserProfile({
  userId,
  name,
  bio,
  avatarFile,
}: {
  userId: string;
  name?: string;
  bio?: string;
  avatarFile?: File;
}) {
  let avatarUrl: string | undefined;

  if (avatarFile) {
    const fileExt = avatarFile.name.split(".").pop();
    const filePath = `${userId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    avatarUrl = publicUrl;
  }

  const { error: updateError } = await supabase.from("profiles").upsert({
    id: userId,
    name,
    bio,
    avatar: avatarUrl,
    last_seen: new Date().toISOString(),
  });

  if (updateError) throw updateError;
}

/**
 * Logout user
 */
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
