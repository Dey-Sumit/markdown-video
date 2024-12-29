// import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "MarkdownVideo",
  description:
    "Easily transform Markdown into clean, beautiful code walkthrough videos. Perfect for developers, educators, and content creators. Fast, clean, and seamless!",
  robots: "follow, index",
  applicationName: "MarkdownVideo",
  keywords: [
    "markdownvideoe",
    "text video editor",
    "markdown to video",
    "code walkthrough",
    "video generator",
    "markdown video generator",
    "code video editor",
    "markdown editor",
    "tutorial video tool",
    "code walkthrough generator",
    "markdown to code video",
    "create code walkthrough videos",
    "developer video editor",
    "educational video creation",
    "markdown video creator",
  ],
  twitter: {
    site: "@markdownvideo",
    creator: "@markdownvideo",
  },
  creator: "Sumit Dey",
  category:
    "Software Development Tools, Content Creation Tools, Developer Productivity, Video Editing Software, Educational Software",
};

import { Inter } from "next/font/google";
import type { Metadata } from "next";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} scroll-smooth`}
      suppressHydrationWarning
      data-theme="dark"
    >
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors />
          <Analytics />
          <main className="flex min-h-screen flex-col">
            <>{children}</>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
