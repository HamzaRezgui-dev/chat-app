import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { loginUser, signUpUser } from "../../config/supabase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [currState, setCurrState] = useState<string>("Sign up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (currState === "Sign up") {
        await signUpUser(email, password, username);
        alert("Sign-up successful! Check your inbox for confirmation.");
      } else if (currState === "Login") {
        await loginUser(email, password);
        alert("you have successfully logged in");
        navigate("/chat");
      } else {
        // TODO: loginUser logic
        alert("Login functionality not implemented yet.");
      }
    } catch {
      setError("error");
    }
  };

  return (
    <div className="login">
      <img src={assets.logo_big} alt="" className="logo" />
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{currState}</h2>

        {currState === "Sign up" && (
          <input
            type="text"
            placeholder="username"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="email address"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          {currState === "Sign up" ? "Sign up" : "Login Now"}
        </button>

        {error && <p className="error-message">{error}</p>}

        <div className="login-term">
          <input type="checkbox" id="terms" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="login-forgot">
          <p className="login-toggle">
            {currState === "Sign up" ? (
              <>
                Already have an account?{" "}
                <span onClick={() => setCurrState("Login")}>Login here</span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span onClick={() => setCurrState("Sign up")}>Create one</span>
              </>
            )}
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
