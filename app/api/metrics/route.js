import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const metrics = await prisma.metric.findMany({
      orderBy: { createdAt: "desc" },
      include: { entries: { orderBy: { createdAt: "desc" } } },
    });

    return NextResponse.json(metrics);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json({ error: "Metric name is required" }, { status: 400 });
    }

    const metric = await prisma.metric.create({
      data: {
        name,
        unit: body.unit?.trim() || "",
        category: body.category || "health",
        type: body.type || "number",
      },
    });

    return NextResponse.json(metric, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create metric" }, { status: 500 });
  }
}
