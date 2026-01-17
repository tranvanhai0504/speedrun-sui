import type { Metadata } from "next";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Speedrun Sui",
  description: "Master Sui Move by Building",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
