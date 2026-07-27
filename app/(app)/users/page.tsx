import type { Metadata } from "next";
import { Users } from "lucide-react";
import { FeaturePage, ComingSoon } from "@/components/layout/feature-page";

export const metadata: Metadata = { title: "Users · April AI" };

export default function UsersPage() {
  return (
    <FeaturePage
      icon={Users}
      eyebrow="Organization"
      title="Add Users"
      description="Invite teammates, assign roles, and manage who can access your matters, documents, and billing."
    >
      <ComingSoon
        bullets={[
          "Invite users by email with role-based permissions",
          "Owner, admin, and member roles",
          "Per-user activity and credit usage",
          "SSO and organization management",
        ]}
      />
    </FeaturePage>
  );
}
