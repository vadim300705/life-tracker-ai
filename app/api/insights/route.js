import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const metrics = await prisma.metric.findMany({
      include: { entries: true },
    });

    if (!metrics.length) {
      return NextResponse.json({
        title: "Начните отслеживание",
        summary: "Пока нет данных. Добавьте первые метрики, чтобы AI начал анализировать ваш прогресс и давать советы.",
      });
    }

    const metricSummaries = metrics
      .filter((metric) => metric.entries.length > 0)
      .map((metric) => {
        const arr = metric.entries.map((entry) => Number(entry.value));
        const avg = arr.reduce((sum, value) => sum + value, 0) / arr.length;
        return `${metric.name}: среднее ${avg.toFixed(1)} ${metric.unit || ""}`;
      });

    const summary =
      metricSummaries.length > 0
        ? `Вот что видно по вашим данным: ${metricSummaries.join("; ")}. Совет: поддерживайте стабильность, повышайте самые слабые привычки и избегайте резких перепадов.`
        : "Данных пока мало. Добавляйте записи каждый день, чтобы AI смог находить закономерности и давать точные рекомендации.";

    const insight = await prisma.insight.create({
      data: {
        title: "Еженедельный анализ",
        summary,
      },
    });

    return NextResponse.json(insight);
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      title: "Ошибка анализа",
      summary: "Не удалось выполнить анализ. Попробуйте позже.",
    }, { status: 500 });
  }
}
