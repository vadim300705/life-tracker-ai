# Life Tracker AI

MVP приложение для отслеживания привычек, сна, тренировок, воды, продуктивности и других метрик.

## Что умеет
- создавать кастомные метрики
- добавлять значения ежедневно
- видеть средние значения и последние записи
- генерировать AI-советы на основе накопленных данных
- хранить данные локально через SQLite

## Запуск

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Откройте: http://localhost:3000

## Основные файлы
- `app/page.js` — интерфейс приложения
- `app/api/metrics/route.js` — создание и получение метрик
- `app/api/metrics/entry/route.js` — добавление записей
- `app/api/insights/route.js` — генерация AI-сводки
- `prisma/schema.prisma` — структура базы данных
