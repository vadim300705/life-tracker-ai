import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Tracker AI",
  description: "Приложение для отслеживания привычек, здоровья и AI-аналитики",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
