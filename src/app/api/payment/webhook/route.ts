import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { BookingStatus, EventName, PaymentStatus } from "@prisma/client";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.object?.id) {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }

  const paymentId = String(body.object.id);
  const event = String(body.event || "");
  const payment = await db.payment.findFirst({ where: { providerPaymentId: paymentId } });
  if (!payment) {
    return NextResponse.json({ ok: true });
  }

  if (event === "payment.succeeded") {
    await Promise.all([
      db.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.SUCCEEDED, rawPayload: body },
      }),
      db.booking.update({
        where: { id: payment.bookingId },
        data: { status: BookingStatus.CONFIRMED },
      }),
      db.analyticsEvent.create({
        data: {
          eventName: EventName.PAYMENT_SUCCEEDED,
          path: "/payment/webhook",
          meta: { providerPaymentId: paymentId },
        },
      }),
    ]);
  }

  if (event === "payment.canceled") {
    await Promise.all([
      db.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.CANCELED, rawPayload: body },
      }),
      db.booking.update({
        where: { id: payment.bookingId },
        data: { status: BookingStatus.CANCELLED_BY_ADMIN },
      }),
      db.analyticsEvent.create({
        data: {
          eventName: EventName.PAYMENT_FAILED,
          path: "/payment/webhook",
          meta: { providerPaymentId: paymentId },
        },
      }),
    ]);
  }

  return NextResponse.json({ ok: true });
}
