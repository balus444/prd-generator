import "./globals.css";
import "./styles/carousel-animations.css";
import "./styles/blueprint.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Project Idea Breakdown",
  description: "Break down your project ideas into manageable components",
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
