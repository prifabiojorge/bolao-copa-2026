import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bol\u00e3o do F\u00e1bio Fabuloso",
  description: "Painel transparente para o bol\u00e3o Esc\u00f3cia x Brasil da Copa 2026.",
  icons: {
    icon: "/bolao-field.png"
  }
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
