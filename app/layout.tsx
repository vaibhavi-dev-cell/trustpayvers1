import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "AEGIS — Autonomous Enterprise Governance Intelligence System",
  description: "AI-native compliance platform: zero-to-audit in 10 minutes. AWS Bedrock powered policy generation, infrastructure scanning, regulatory intelligence, and blockchain-anchored evidence.",
  keywords: ["compliance", "GRC", "governance", "risk", "audit", "AWS", "AI", "SOC2", "ISO27001", "GDPR"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
              fontFamily: 'var(--font-display)',
            },
          }}
        />
      </body>
    </html>
  );
}
