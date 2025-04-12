'use client'; // <-- Add this at the top
import { authOptions } from "@repo/lib/auth/auth.config";
import { SignIn } from "@repo/ui/components/auth/SignIn";
import { SignOut } from "@repo/ui/components/auth/SignOut";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

// export default function Home() {
//   const { data: session } = useSession();

//   return (
//     <div>
//       {!session ? (
//         <SignIn />
//       ) : (
//         <>
//           <p>Welcome {session.user?.userName}</p>
//           <SignOut />
//         </>
//       )}
//     </div>
//   );
// }

export default async function Page() {
  const session = await getServerSession(authOptions)
    return (
    <div>
      {!session ? (
        <SignIn />
      ) : (
        <>
          <p>Welcome {session.user?.userName}</p>
          <SignOut />
        </>
      )}
    </div>
  );
}
