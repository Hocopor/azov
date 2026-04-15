import { NextResponse } from "next/server";
import { z } from "zod";
import { EventName, Prisma } from "@prisma/client";
import { saveAnalyticsEvent } from "@/lib/analytics";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = z
    .object({
      eventName: z.nativeEnum(EventName),
      path: z.string().min(1),
      roomSlug: z.string().optional(),
      sessionId: z.string().optional(),
      meta: z.unknown().optional(),
    })
    .safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await saveAnalyticsEvent({
    ...parsed.data,
    meta: parsed.data.meta as Prisma.JsonValue | undefined,
  });
  return NextResponse.json({ ok: true });
}
