import { addMinutes, subDays } from "date-fns";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { roomIsAvailable } from "@/lib/availability";
import { getBookingSettings } from "@/lib/settings";
import { createYooKassaPayment } from "@/lib/yookassa";
import { calculateNights } from "@/lib/utils";
import { BookingSource, PaymentStatus } from "@prisma/client";

const bookingSchema = z.object({
  roomId: z.string().min(1),
  guestName: z.string().min(2),
  phone: z.string().min(10),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  adults: z.coerce.number().min(1).max(8),
  children: z.coerce.number().min(0).max(6).optional().default(0),
  hasPets: z.union([z.literal("true"), z.undefined()]).optional(),
  smoking: z.union([z.literal("true"), z.undefined()]).optional(),
  needsTransfer: z.union([z.literal("true"), z.undefined()]).optional(),
  transferFrom: z.string().optional(),
  transferDate: z.string().optional(),
  transferUnknown: z.union([z.literal("true"), z.undefined()]).optional(),
  comment: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  legalConsent: z.union([z.literal("true"), z.literal("on")]),
});

export async function POST(request: Request) {
  const session = await auth();
  const body = await request.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Проверьте обязательные поля формы." }, { status: 400 });
  }

  const room = await db.room.findUnique({ where: { id: parsed.data.roomId } });
  if (!room || !room.isPublished) {
    return NextResponse.json({ error: "Номер не найден." }, { status: 404 });
  }

  const startDate = new Date(`${parsed.data.startDate}T14:00:00`);
  const endDate = new Date(`${parsed.data.endDate}T11:00:00`);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate) {
    return NextResponse.json({ error: "Проверьте даты заезда и выезда." }, { status: 400 });
  }

  const available = await roomIsAvailable(room.id, startDate, endDate);
  if (!available) {
    return NextResponse.json({ error: "Этот номер уже занят на выбранные даты." }, { status: 409 });
  }

  const settings = await getBookingSettings();
  const nights = calculateNights(startDate, endDate);
  const totalAmount = room.priceFrom * nights;
  const depositAmount =
    settings.depositMode === "fixed"
      ? settings.depositFixed
      : Math.max(1000, Math.round((totalAmount * settings.depositPercent) / 100));
  const paymentExpiresAt = addMinutes(new Date(), settings.paymentWindowMinutes);
  const refundableUntil = subDays(startDate, settings.freeCancellationDays);

  const booking = await db.booking.create({
    data: {
      roomId: room.id,
      userId: session?.user?.id,
      guestName: parsed.data.guestName,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      adults: parsed.data.adults,
      children: parsed.data.children,
      hasPets: parsed.data.hasPets === "true",
      smoking: parsed.data.smoking === "true",
      needsTransfer: parsed.data.needsTransfer === "true",
      transferFrom: parsed.data.transferFrom || null,
      transferDate: parsed.data.transferDate ? new Date(parsed.data.transferDate) : null,
      transferUnknown: parsed.data.transferUnknown === "true",
      comment: parsed.data.comment || null,
      startDate,
      endDate,
      nights,
      guestsTotal: parsed.data.adults + (parsed.data.children || 0),
      totalAmount,
      depositType: settings.depositMode,
      depositValue: settings.depositMode === "fixed" ? settings.depositFixed : settings.depositPercent,
      depositAmount,
      paymentExpiresAt,
      refundableUntil,
      source: BookingSource.WEBSITE,
      cancellationPolicyNote:
        parsed.data.needsTransfer === "true" && parsed.data.transferUnknown === "true"
          ? "Если дата трансфера пока неизвестна, связываемся за 14 дней до заезда или в ближайшее время, если до заезда меньше 14 дней."
          : null,
    },
  });

  const paymentResult = await createYooKassaPayment({
    amount: depositAmount,
    description: `Предоплата за ${room.title}`,
    bookingId: booking.id,
    customerEmail: parsed.data.email || undefined,
    returnUrl: `${process.env.APP_URL || "http://localhost:3000"}/rooms/${room.slug}?payment=success`,
  });

  await db.payment.create({
    data: {
      bookingId: booking.id,
      providerPaymentId: paymentResult.demo ? null : paymentResult.providerPaymentId,
      status: paymentResult.demo ? PaymentStatus.SUCCEEDED : PaymentStatus.PENDING,
      amount: depositAmount,
      returnUrl: `${process.env.APP_URL || "http://localhost:3000"}/rooms/${room.slug}?payment=success`,
      receiptEmail: parsed.data.email || null,
      rawPayload: paymentResult.rawPayload || undefined,
    },
  });

  if (paymentResult.demo) {
    await db.booking.update({
      where: { id: booking.id },
      data: { status: "CONFIRMED" },
    });
  }

  return NextResponse.json({
    redirectUrl: paymentResult.redirectUrl || `${process.env.APP_URL || "http://localhost:3000"}/rooms/${room.slug}?payment=success`,
    bookingId: booking.id,
  });
}
