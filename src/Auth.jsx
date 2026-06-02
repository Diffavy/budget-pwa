import { useState } from "react";
import { supabase } from "./supabaseClient";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // checks if sign up or log in

  const handleAuth = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        console.error("Error when signing up: ", error.message);
      } else {
        alert("Signed up!");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Error when logging in: ", error.message);
      } else {
        alert("Logged in!");
      }
    }
  };

  const baseButtonStyle = {
    all: "unset",
    cursor: "pointer",
    fontSize: "2rem",
    padding: "15px",
    borderRadius: "10px",
    margin: "10px",
  };

  const baseInputStyle = {
    all: "unset",
    borderRadius: "10px",
    backgroundColor: "rgb(221, 221, 221)",
    color: "black",
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? "Sign Up" : "Log In"}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            ...baseInputStyle,
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            ...baseInputStyle,
          }}
          required
        />
        <button
          type="submit"
          style={{
            ...baseButtonStyle,
          }}
        >
          {isSignUp ? "Sign Up" : "Log In"}
        </button>
      </form>
      <p>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={{
            ...baseButtonStyle,
          }}
        >
          {isSignUp ? "Log In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}

export default Auth;
