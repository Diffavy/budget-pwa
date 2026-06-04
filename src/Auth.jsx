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
    display: "block",
    textAlign: "center",
    fontSize: "1.5rem",
    padding: "10px",
    margin: "15px auto",
    borderRadius: "5px",
    backgroundColor: "rgb(221, 221, 221)",
    color: "black",
  };

  return (
    <div className="auth-container">
      <h2
        style={{
          display: "inline-block",
          fontSize: "2rem",
          margin: "20px 0 30px 0",
          borderBottom: "solid 1px rgb(221, 221, 221)",
          fontWeight: "350",
        }}
      >
        {isSignUp ? "Sign Up" : "Log in to Your Account"}
      </h2>
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
            color: "white",
            border: "solid 1px white",
            backgroundColor: "rgb(111, 109, 109)",
            padding: "6px 10px 10px 10px",
          }}
        >
          <p>→</p>
        </button>
      </form>
      <p>
        <p
          style={{
            fontSize: "1.2rem",
            margin: "15px 0 0 0",
          }}
        >
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
        </p>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={{
            ...baseButtonStyle,
            fontSize: "1.4rem",
            color: "rgb(223, 223, 223)",
            padding: "0 0 5px 0",
            borderRadius: "0",
            borderBottom: "solid 1px rgb(221, 221, 221)",
          }}
        >
          {isSignUp ? "Log In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}

export default Auth;
