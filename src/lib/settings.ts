import { db } from "@/lib/db";

export type BookingSettings = {
  depositMode: "fixed" | "percent";
  depositFixed: number;
  depositPercent: number;
  paymentWindowMinutes: number;
  freeCancellationDays: number;
  partialRefundDays: number;
  partialRefundPercent: number;
};

export const defaultBookingSettings: BookingSettings = {
  depositMode: "percent",
  depositFixed: 3000,
  depositPercent: 20,
  paymentWindowMinutes: 30,
  freeCancellationDays: 21,
  partialRefundDays: 14,
  partialRefundPercent: 50,
};

export async function getBookingSettings(): Promise<BookingSettings> {
  const row = await db.setting.findUnique({ where: { key: "booking" } });
  if (!row) return defaultBookingSettings;
  return {
    ...defaultBookingSettings,
    ...(row.value as Partial<BookingSettings>),
  };
}

export async function getContactsSettings() {
  const row = await db.setting.findUnique({ where: { key: "contacts" } });
  return (row?.value as Record<string, string> | null) ?? {};
}
