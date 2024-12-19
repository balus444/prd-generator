import "./globals.css";
import "./styles/carousel-animations.css";
import "./styles/blueprint.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "PRD Generator",
  description:
    "Transform your product ideas into detailed PRDs with AI assistance",
  keywords: "PRD, Product Requirements Document, AI, Product Management",
  author: "balasubbiah",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} blueprint-bg min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
