'use client';
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
export const SignOut = () => (
  <Button onClick={() => signOut()}>Sign Out</Button>
);
