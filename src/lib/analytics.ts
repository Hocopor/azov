import { cookies, headers } from "next/headers";
import { db } from "@/lib/db";
import { EventName, Prisma } from "@prisma/client";

function toPrismaJson(
  value: unknown,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return Prisma.JsonNull;
  }

  return value as Prisma.InputJsonValue;
}

export async function saveAnalyticsEvent(input: {
  eventName: EventName;
  path: string;
  roomSlug?: string;
  sessionId?: string;
  meta?: unknown;
}) {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const utmSource = cookieStore.get("utm_source")?.value;
  const utmMedium = cookieStore.get("utm_medium")?.value;
  const utmCampaign = cookieStore.get("utm_campaign")?.value;
  const sessionId = input.sessionId || cookieStore.get("azov_session")?.value || headerStore.get("x-session-id") || undefined;

  return db.analyticsEvent.create({
    data: {
      eventName: input.eventName,
      path: input.path,
      roomSlug: input.roomSlug,
      sessionId,
      utmSource,
      utmMedium,
      utmCampaign,
      meta: toPrismaJson(input.meta),
    },
  });
}
