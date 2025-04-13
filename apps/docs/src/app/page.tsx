'use client'; // <-- Add this at the top
import { SignIn } from "@repo/ui/components/auth/SignIn";
import { SignOut } from "@repo/ui/components/auth/SignOut";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if(status == 'loading') return "Loading"

  return (
    <div>
      {!session ? (
       <h1>No session</h1>
      ) : (
        <>
          <p>Welcome {session.user?.userName}</p>
          <SignOut />
        </>
      )}
    </div>
  );
}
