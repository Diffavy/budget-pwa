import { useState } from "react";
import { supabase } from "./supabaseClient";
import styled, { css } from "styled-components";

const baseButtonStyle = css`
  all: unset;
  cursor: pointer;
  font-size: 2rem;
  padding: 15px;
  border-radius: 10px;
  margin: 10px;
`;

const baseInputStyle = css`
  all: unset;
  display: block;
  text-align: center;
  font-size: 1.2rem;
  width: 300px;
  padding: 10px;
  margin: 15px auto;
  border-radius: 5px;
  background-color: rgb(221, 221, 221);
  color: black;
`;

const AuthContainer = styled.div``;

const FormHeader = styled.h2`
  display: inline-block;
  font-size: 2rem;
  margin: 20px 0 30px 0;
  border-bottom: solid 1px rgb(221, 221, 221);
  font-weight: 350;
`;

const EmailInput = styled.input`
  ${baseInputStyle}
`;

const PasswordInput = styled.input`
  ${baseInputStyle}
`;

const SubmitButton = styled.button`
  ${baseButtonStyle}
  color: white;
  border: solid 1px white;
  background-color: rgb(111, 109, 109);
  padding: 6px 10px 10px 10px;

  &:hover {
    background-color: rgb(132, 131, 131);
    transform: scale(1.1);
  }

  &:active {
    background-color: rgb(157, 154, 154);
    transform: scale(1.05);
  }
`;

const FormChangeText = styled.p`
  font-size: 1.2rem;
  margin: 15px 0 0 0;
`;
const FormChangeButton = styled.button`
  ${baseButtonStyle}
  font-size: 1.4rem;
  color: rgb(223, 223, 223);
  padding: 0 0 5px 0;
  border-radius: 0;
  border-bottom: solid 1px rgb(221, 221, 221);

  &:hover {
    color: rgb(255, 255, 255);
    translatey: -5px;
    transform: scale(1.1);
    padding: 0 0 7px 0;
  }

  &:active {
    transform: scale(0.95);
  }
`;

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

  return (
    <AuthContainer>
      <FormHeader>{isSignUp ? "Sign Up" : "Log in to Your Account"}</FormHeader>
      <form onSubmit={handleAuth}>
        <EmailInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <SubmitButton type="submit">
          <p>→</p>
        </SubmitButton>
      </form>
      <p>
        <FormChangeText>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
        </FormChangeText>
        <FormChangeButton onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Log In" : "Sign Up"}
        </FormChangeButton>
      </p>
    </AuthContainer>
  );
}

export default Auth;
