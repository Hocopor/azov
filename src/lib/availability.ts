import { BookingStatus } from "@prisma/client";
import { db } from "@/lib/db";

const holdingStatuses: BookingStatus[] = [
  BookingStatus.PENDING_PAYMENT,
  BookingStatus.DEPOSIT_PAID,
  BookingStatus.CONFIRMED,
];

export async function getBlockedDateRanges(roomId: string) {
  const now = new Date();
  const [bookings, blocks] = await Promise.all([
    db.booking.findMany({
      where: {
        roomId,
        OR: [
          {
            status: {
              in: [BookingStatus.DEPOSIT_PAID, BookingStatus.CONFIRMED],
            },
          },
          {
            status: BookingStatus.PENDING_PAYMENT,
            paymentExpiresAt: {
              gt: now,
            },
          },
        ],
      },
      select: { startDate: true, endDate: true },
    }),
    db.roomBlock.findMany({
      where: { roomId },
      select: { startDate: true, endDate: true, title: true },
    }),
  ]);

  return {
    bookings,
    blocks,
  };
}

export async function roomIsAvailable(roomId: string, startDate: Date, endDate: Date) {
  const now = new Date();
  const overlappingBooking = await db.booking.findFirst({
    where: {
      roomId,
      startDate: { lt: endDate },
      endDate: { gt: startDate },
      OR: [
        {
          status: {
            in: [BookingStatus.DEPOSIT_PAID, BookingStatus.CONFIRMED],
          },
        },
        {
          status: BookingStatus.PENDING_PAYMENT,
          paymentExpiresAt: { gt: now },
        },
      ],
    },
    select: { id: true },
  });

  if (overlappingBooking) return false;

  const overlappingBlock = await db.roomBlock.findFirst({
    where: {
      roomId,
      startDate: { lt: endDate },
      endDate: { gt: startDate },
    },
    select: { id: true },
  });

  return !overlappingBlock;
}

export function blocksBooking(status: BookingStatus, expiresAt?: Date | null) {
  if (status === BookingStatus.PENDING_PAYMENT) {
    return expiresAt ? expiresAt > new Date() : false;
  }

  return holdingStatuses.includes(status);
}
