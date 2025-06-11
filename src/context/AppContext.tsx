import { createContext, useState, useContext } from "react";
import { supabase } from "../config/supabase";
import type { AppContextType, Profile, Chat } from "../types/types";
import type { User } from "@supabase/supabase-js";
import { saveUserProfile } from "../lib/saveUserProfile";

export const AppContext = createContext<AppContextType>({} as AppContextType);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<Profile | null>(null);
  const [chatData, setChatData] = useState<Chat["chat_data"] | null>(null);

  const loadUserData = async (user: User) => {
    try {
      const uid = user.id;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        const savedProfile = await saveUserProfile({
          userId: uid,
          userEmail: user.email ?? "",
          userMeta: user.user_metadata,
        });

        setUserData(savedProfile);
      } else {
        setUserData(profile);
      }

      const { data: chat, error: chatError } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", uid)
        .maybeSingle();

      if (chatError) throw chatError;

      if (!chat) {
        const defaultChat: Chat = {
          user_id: uid,
          chat_data: [],
        };

        const { error: insertChatError } = await supabase
          .from("chats")
          .insert(defaultChat);

        if (insertChatError) throw insertChatError;

        setChatData([]);
      } else {
        setChatData(chat.chat_data || []);
      }
    } catch (error) {
      console.error("❌ Failed to load user data:", error);
    }
  };

  const value: AppContextType = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
export const useAppContext = () => useContext(AppContext);
