"use client";

import { useEffect, useState } from "react";

const emptyMetric = {
  name: "",
  unit: "",
  category: "health",
};

export default function Home() {
  const [metrics, setMetrics] = useState([]);
  const [metricForm, setMetricForm] = useState(emptyMetric);
  const [selectedMetricId, setSelectedMetricId] = useState("");
  const [entryValue, setEntryValue] = useState("");
  const [entryNote, setEntryNote] = useState("");
  const [insight, setInsight] = useState("Пока нет данных для анализа. Добавьте метрики и записи.");

  const loadMetrics = async () => {
    try {
      const res = await fetch("/api/metrics", { cache: "no-store" });
      const data = await res.json();
      setMetrics(data);
      if (data.length > 0 && !selectedMetricId) {
        setSelectedMetricId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load metrics", error);
    }
  };

  const generateInsight = async () => {
    try {
      const res = await fetch("/api/insights", { cache: "no-store" });
      const data = await res.json();
      setInsight(data.summary || data.message || "Нет данных для анализа.");
    } catch (error) {
      console.error("Failed to load insight", error);
    }
  };

  useEffect(() => {
    loadMetrics();
    generateInsight();
  }, []);

  const createMetric = async () => {
    if (!metricForm.name.trim()) return;

    const res = await fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: metricForm.name.trim(),
        unit: metricForm.unit.trim(),
        category: metricForm.category,
        type: "number",
      }),
    });

    if (res.ok) {
      setMetricForm(emptyMetric);
      loadMetrics();
    }
  };

  const addEntry = async () => {
    if (!selectedMetricId || !entryValue) return;

    const res = await fetch("/api/metrics/entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metricId: selectedMetricId,
        value: Number(entryValue),
        note: entryNote,
      }),
    });

    if (res.ok) {
      setEntryValue("");
      setEntryNote("");
      loadMetrics();
      generateInsight();
    }
  };

  return (
    <main className="page-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">AI Health + Habits</p>
          <h1>Life Tracker AI</h1>
        </div>
        <button className="primary-button" onClick={generateInsight}>Сгенерировать анализ</button>
      </div>

      <section className="grid two-col">
        <div className="card">
          <h2>Добавить метрику</h2>
          <label>
            Название
            <input
              value={metricForm.name}
              onChange={(e) => setMetricForm({ ...metricForm, name: e.target.value })}
              placeholder="Например: Вода, Сон, Тренировки"
            />
          </label>

          <label>
            Единица
            <input
              value={metricForm.unit}
              onChange={(e) => setMetricForm({ ...metricForm, unit: e.target.value })}
              placeholder="литр, час, шт."
            />
          </label>

          <label>
            Категория
            <select
              value={metricForm.category}
              onChange={(e) => setMetricForm({ ...metricForm, category: e.target.value })}
            >
              <option value="health">Здоровье</option>
              <option value="fitness">Фитнес</option>
              <option value="productivity">Продуктивность</option>
              <option value="mindset">Психология</option>
            </select>
          </label>

          <button className="primary-button" onClick={createMetric}>Создать метрику</button>
        </div>

        <div className="card">
          <h2>Добавить запись</h2>
          <label>
            Метрика
            <select value={selectedMetricId} onChange={(e) => setSelectedMetricId(e.target.value)}>
              <option value="">Выберите</option>
              {metrics.map((metric) => (
                <option key={metric.id} value={metric.id}>{metric.name}</option>
              ))}
            </select>
          </label>

          <label>
            Значение
            <input
              type="number"
              value={entryValue}
              onChange={(e) => setEntryValue(e.target.value)}
              placeholder="0"
            />
          </label>

          <label>
            Комментарий
            <textarea
              value={entryNote}
              onChange={(e) => setEntryNote(e.target.value)}
              placeholder="Как ты себя чувствовал сегодня?"
              rows={4}
            />
          </label>

          <button className="primary-button" onClick={addEntry}>Добавить запись</button>
        </div>
      </section>

      <section className="card insight-box">
        <h2>AI анализ</h2>
        <p>{insight}</p>
      </section>

      <section className="metrics-section">
        <h2>Ваши метрики</h2>

        <div className="metric-list">
          {metrics.length === 0 ? (
            <div className="empty-state">Нет метрик. Создайте первую.</div>
          ) : (
            metrics.map((metric) => {
              const values = metric.entries.map((entry) => entry.value);
              const avg = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

              return (
                <div key={metric.id} className="metric-item">
                  <div className="metric-header">
                    <div>
                      <h3>{metric.name}</h3>
                      <span>{metric.category}</span>
                    </div>
                    <strong>{avg.toFixed(1)} {metric.unit || ""}</strong>
                  </div>

                  <div className="chips">
                    {metric.entries.slice(-5).reverse().map((entry) => (
                      <span key={entry.id} className="chip">
                        {entry.value} {metric.unit || ""}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
