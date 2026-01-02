import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classic Poem Composer",
  description: "Compose elegant classic Chinese poems with AI.",
};

import { Providers } from "../components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
