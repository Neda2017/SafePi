// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "SafePi",
  description: "Pi Network Payments",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Load Pi SDK */}
        <script src="https://sdk.minepi.com/pi-sdk.js"></script>
      </head>

      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
