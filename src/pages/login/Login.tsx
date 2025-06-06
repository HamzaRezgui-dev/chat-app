import React from "react";
import "./Login.css";
import assets from "../../assets/assets";

const Login = () => {
  const [currState, setCurrState] = React.useState<string>("Sign up");
  return (
    <div className="login">
      <img src={assets.logo_big} alt="" className="logo" />
      <form className="login-form">
        <h2>{currState}</h2>
        {currState === "Sign up" && (
          <input
            type="text"
            placeholder="username"
            className="form-input"
            required
          />
        )}
        <input
          type="email"
          placeholder="email address"
          className="form-input"
          required
        />
        <input
          type="password"
          placeholder="password"
          className="form-input"
          required
        />
        <button type="submit">
          {currState === "Sign up" ? "Sign up" : "Login Now"}
        </button>
        <div className="login-term">
          <input type="checkbox" name="" id="" />
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
