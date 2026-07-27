import type { Metadata } from "next";
import { Newsreader, Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import { AuthProvider } from "./auth-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Premium serif for the wordmark, hero, and headings.
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "April AI — Legal Intelligence Workspace",
  description: "Futuristic AI legal counsel for drafting, analysis, and research.",
  authors: [{ name: "April AI" }],
  openGraph: {
    title: "April AI — Legal Intelligence Workspace",
    description: "Futuristic AI legal counsel for drafting, analysis, and research.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "April AI — Legal Intelligence Workspace",
    description: "Futuristic AI legal counsel for drafting, analysis, and research.",
  },
  // Favicon is provided by the app/icon.svg file convention.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
