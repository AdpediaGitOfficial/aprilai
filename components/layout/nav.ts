import {
  Home,
  Scale,
  PenLine,
  FileSearch,
  BarChart3,
  Files,
  Building2,
  Users,
  Briefcase,
  LayoutTemplate,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string;
};

/**
 * Primary workspace navigation. Each entry maps to a real route under the
 * authenticated `(app)` segment — the single source of truth for the sidebar
 * and the command palette.
 */
export const primaryNav: NavItem[] = [
  { icon: Home, label: "Home", href: "/", badge: "⌘/" },
  { icon: Scale, label: "Legal Advice", href: "/legal-advice" },
  { icon: PenLine, label: "Contract Drafting", href: "/contracts/draft" },
  { icon: FileSearch, label: "Contract Analysis", href: "/contracts/analyze" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Files, label: "Documents", href: "/documents" },
  { icon: Building2, label: "Add Businesses", href: "/businesses" },
  { icon: Users, label: "Add Users", href: "/users" },
  { icon: Briefcase, label: "Market Place", href: "/marketplace" },
  { icon: LayoutTemplate, label: "Templates", href: "/templates" },
];
