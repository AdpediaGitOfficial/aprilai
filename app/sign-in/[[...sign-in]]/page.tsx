import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { authEnabled } from "@/lib/config";

export default function SignInPage() {
  if (!authEnabled) redirect("/");
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SignIn />
    </div>
  );
}
