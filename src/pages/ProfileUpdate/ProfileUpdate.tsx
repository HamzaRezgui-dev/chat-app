import React, { useEffect, useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { supabase } from "../../config/supabase";
import { saveUserProfile } from "../../lib/saveUserProfile";
import { useAppContext } from "../../context/AppContext";

const ProfileUpdate = () => {
  const [img, setImg] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uploading, setUploading] = useState(false);

  const { userData, loadUserData } = useAppContext(); 

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await loadUserData(user);
      }
    };

    load();
  }, [loadUserData]);

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setBio(userData.bio || "");
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const {
        data: { user },
        error: sessionError,
      } = await supabase.auth.getUser();

      if (sessionError || !user) {
        throw sessionError ?? new Error("User not authenticated");
      }

      await saveUserProfile({
        userId: user.id,
        userEmail: user.email ?? "",
        userMeta: user.user_metadata,
        name,
        bio,
        avatarFile: img,
      });

      alert("Profile updated successfully.");
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={handleSubmit}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImg(e.target.files[0]);
                }
              }}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                img
                  ? URL.createObjectURL(img)
                  : userData?.avatar || assets.avatar_icon
              }
              alt=""
            />
            upload profile image
          </label>

          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            placeholder="Write profile bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          ></textarea>

          <button type="submit" disabled={uploading}>
            {uploading ? "Saving..." : "Save"}
          </button>
        </form>

        <img
          className="profile-pic"
          src={
            img
              ? URL.createObjectURL(img)
              : userData?.avatar || assets.logo_icon
          }
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
