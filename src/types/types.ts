// src/types.ts

import type { User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  username: string;
  email: string;
  name: string;
  bio: string;
  avatar: string;
  last_seen: string;
};

export type Chat = {
  user_id: string;
  chat_data: any[]; // You can define a stricter type for messages if needed
};

export type AppContextType = {
  userData: Profile | null;
  setUserData: (user: Profile | null) => void;
  chatData: Chat["chat_data"] | null;
  setChatData: (data: Chat["chat_data"] | null) => void;
  loadUserData: (user: User) => Promise<void>;
};
