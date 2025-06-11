import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Chat from "./pages/Chat/Chat";
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { supabase } from "./config/supabase";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { loadUserData } = useAppContext();
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session) {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (user) {
          await loadUserData(user);
        }
        if (error) {
          console.error("Failed to fetch user:", error.message);
        } else {
          console.log("Current user:", user);
        }
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
        if (!session) navigate("/");
      }
    );

    checkSession();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (isAuthenticated === null) return <div>Loading...</div>;
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdate />} />
      </Routes>
    </>
  );
};

export default App;
