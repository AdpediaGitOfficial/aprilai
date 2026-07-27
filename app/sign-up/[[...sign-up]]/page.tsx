import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { authEnabled } from "@/lib/config";

export default function SignUpPage() {
  if (!authEnabled) redirect("/");
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SignUp />
    </div>
  );
}
