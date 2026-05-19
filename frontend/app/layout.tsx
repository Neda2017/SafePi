// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Script from "next/script";

export const metadata = {
  title: "SafePi",
  description: "Pi Network safety scanner and payments",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
