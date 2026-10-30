export const metadata = {
  title: 'Life Tracker AI',
  description: 'Приложение для отслеживания привычек, здоровья и AI-аналитики.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
