import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const metricId = body.metricId;
    const value = Number(body.value);

    if (!metricId || Number.isNaN(value)) {
      return NextResponse.json({ error: "MetricId and numeric value are required" }, { status: 400 });
    }

    const entry = await prisma.metricEntry.create({
      data: {
        metricId,
        value,
        note: body.note?.trim() || "",
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create metric entry" }, { status: 500 });
  }
}
