"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { defaultBookingSettings } from "@/lib/settings";
import { hashPassword, slugify } from "@/lib/utils";
import { BookingStatus, BookingSource, PostStatus, Prisma, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }
  return session;
}

async function requireAdmin() {
  const session = await requireSession();
  if (session.user.role !== UserRole.ADMIN) {
    redirect("/");
  }
  return session;
}

export async function registerUser(formData: FormData) {
  const parsed = z
    .object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
      phone: z.string().min(10),
      marketingConsent: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirect("/auth/register?error=validation");
  }

  const existing = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (existing) {
    redirect("/auth/sign-in?error=exists");
  }

  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      passwordHash: hashPassword(parsed.data.password),
      marketingConsent: parsed.data.marketingConsent === "on",
    },
  });

  redirect("/auth/sign-in?registered=1");
}

export async function updateProfileAction(formData: FormData) {
  const session = await requireSession();
  const parsed = z
    .object({
      name: z.string().min(2),
      phone: z.string().min(10),
      marketingConsent: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirect("/account/profile?error=validation");
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      marketingConsent: parsed.data.marketingConsent === "on",
    },
  });

  revalidatePath("/account/profile");
  redirect("/account/profile?saved=1");
}

export async function deleteAccountAction() {
  const session = await requireSession();
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { bookings: true },
  });

  if (!user) redirect("/");

  const activeBooking = user.bookings.some((booking) =>
    [BookingStatus.PENDING_PAYMENT, BookingStatus.DEPOSIT_PAID, BookingStatus.CONFIRMED].includes(booking.status),
  );

  if (activeBooking) {
    redirect("/account/profile?error=active-bookings");
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      deletedAt: new Date(),
      email: `deleted-${session.user.id}@example.local`,
      phone: null,
      name: "Удалённый пользователь",
      passwordHash: null,
      image: null,
      marketingConsent: false,
    },
  });

  redirect("/");
}

export async function cancelBookingAction(bookingId: string) {
  const session = await requireSession();
  const booking = await db.booking.findFirst({
    where: { id: bookingId, userId: session.user.id },
  });
  if (!booking) redirect("/account/bookings?error=not-found");

  await db.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CANCELLED_BY_GUEST },
  });

  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: "BOOKING_CANCELLED_BY_GUEST",
      entityType: "Booking",
      entityId: bookingId,
      details: { previousStatus: booking.status },
    },
  });

  revalidatePath("/account/bookings");
  redirect("/account/bookings?cancelled=1");
}

export async function updateBookingSettingsAction(formData: FormData) {
  await requireAdmin();
  const parsed = z
    .object({
      depositMode: z.enum(["fixed", "percent"]),
      depositFixed: z.coerce.number().min(0),
      depositPercent: z.coerce.number().min(0).max(100),
      paymentWindowMinutes: z.coerce.number().min(5).max(120),
      freeCancellationDays: z.coerce.number().min(0).max(365),
      partialRefundDays: z.coerce.number().min(0).max(365),
      partialRefundPercent: z.coerce.number().min(0).max(100),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) redirect("/admin?error=settings");

  await db.setting.upsert({
    where: { key: "booking" },
    update: { value: parsed.data as unknown as Prisma.JsonObject },
    create: { key: "booking", value: parsed.data as unknown as Prisma.JsonObject },
  });

  revalidatePath("/admin");
  redirect("/admin?saved=1");
}

export async function saveServiceAction(formData: FormData) {
  await requireAdmin();
  const parsed = z
    .object({
      id: z.string().optional(),
      name: z.string().min(2),
      slug: z.string().optional(),
      summary: z.string().min(2),
      description: z.string().min(2),
      priceLabel: z.string().min(1),
      featured: z.string().optional(),
      isEnabled: z.string().optional(),
      sortOrder: z.coerce.number().min(0).max(100),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) redirect("/admin/services?error=validation");

  const data = {
    name: parsed.data.name,
    slug: parsed.data.slug?.trim() || slugify(parsed.data.name),
    summary: parsed.data.summary,
    description: parsed.data.description,
    priceLabel: parsed.data.priceLabel,
    featured: parsed.data.featured === "on",
    isEnabled: parsed.data.isEnabled === "on",
    sortOrder: parsed.data.sortOrder,
  };

  if (parsed.data.id) {
    await db.service.update({ where: { id: parsed.data.id }, data });
  } else {
    await db.service.create({ data });
  }

  revalidatePath("/admin/services");
  revalidatePath("/extras");
  redirect("/admin/services?saved=1");
}

export async function saveRoomAction(formData: FormData) {
  await requireAdmin();
  const parsed = z
    .object({
      id: z.string(),
      title: z.string().min(2),
      shortDescription: z.string().min(2),
      description: z.string().min(10),
      priceFrom: z.coerce.number().min(0),
      featured: z.string().optional(),
      isPublished: z.string().optional(),
      imageUrls: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) redirect("/admin/rooms?error=validation");

  await db.room.update({
    where: { id: parsed.data.id },
    data: {
      title: parsed.data.title,
      shortDescription: parsed.data.shortDescription,
      description: parsed.data.description,
      priceFrom: parsed.data.priceFrom,
      featured: parsed.data.featured === "on",
      isPublished: parsed.data.isPublished === "on",
    },
  });

  if (parsed.data.imageUrls !== undefined) {
    const urls = parsed.data.imageUrls
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    await db.roomImage.deleteMany({ where: { roomId: parsed.data.id } });
    if (urls.length) {
      await db.roomImage.createMany({
        data: urls.map((url, index) => ({
          roomId: parsed.data.id,
          url,
          alt: parsed.data.title,
          sortOrder: index,
        })),
      });
    }
  }

  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  redirect("/admin/rooms?saved=1");
}

export async function savePostAction(formData: FormData) {
  const session = await requireAdmin();
  const parsed = z
    .object({
      id: z.string().optional(),
      title: z.string().min(2),
      excerpt: z.string().optional(),
      body: z.string().min(10),
      coverImage: z.string().optional(),
      galleryInput: z.string().optional(),
      videoUrl: z.string().optional(),
      status: z.enum([PostStatus.DRAFT, PostStatus.PUBLISHED]),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) redirect("/admin/feed?error=validation");

  const data = {
    title: parsed.data.title,
    slug: slugify(parsed.data.title),
    excerpt: parsed.data.excerpt,
    body: parsed.data.body,
    coverImage: parsed.data.coverImage || null,
    gallery: (parsed.data.galleryInput || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    videoUrl: parsed.data.videoUrl || null,
    status: parsed.data.status,
    publishedAt: parsed.data.status === PostStatus.PUBLISHED ? new Date() : null,
    authorId: session.user.id,
  };

  if (parsed.data.id) {
    await db.post.update({ where: { id: parsed.data.id }, data });
  } else {
    await db.post.create({ data });
  }

  revalidatePath("/feed");
  revalidatePath("/admin/feed");
  redirect("/admin/feed?saved=1");
}

export async function createRoomBlockAction(formData: FormData) {
  await requireAdmin();
  const parsed = z
    .object({
      roomId: z.string(),
      title: z.string().min(2),
      reason: z.string().optional(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) redirect("/admin/bookings?error=block");

  await db.roomBlock.create({
    data: parsed.data,
  });

  revalidatePath("/admin/bookings");
  redirect("/admin/bookings?blocked=1");
}

export async function createManualBookingAction(formData: FormData) {
  await requireAdmin();
  const parsed = z
    .object({
      roomId: z.string(),
      guestName: z.string().min(2),
      phone: z.string().min(10),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      totalAmount: z.coerce.number().min(0),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) redirect("/admin/bookings?error=manual");

  const nights = Math.max(1, Math.ceil((parsed.data.endDate.getTime() - parsed.data.startDate.getTime()) / 86400000));

  await db.booking.create({
    data: {
      roomId: parsed.data.roomId,
      guestName: parsed.data.guestName,
      phone: parsed.data.phone,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
      nights,
      adults: 2,
      children: 0,
      guestsTotal: 2,
      totalAmount: parsed.data.totalAmount,
      depositValue: 0,
      depositAmount: 0,
      source: BookingSource.PHONE,
      status: BookingStatus.CONFIRMED,
      depositType: defaultBookingSettings.depositMode,
    },
  });

  revalidatePath("/admin/bookings");
  redirect("/admin/bookings?manual=1");
}
