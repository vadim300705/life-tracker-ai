export const metadata = {
  title: 'Life Tracker AI',
  description: 'Track habits, health, and performance with AI-powered insights.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
