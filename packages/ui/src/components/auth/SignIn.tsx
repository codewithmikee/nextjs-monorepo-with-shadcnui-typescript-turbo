'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
export const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", { username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit">Sign In</Button>
    </form>
  );
};
