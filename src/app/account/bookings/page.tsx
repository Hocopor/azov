import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { cancelBookingAction } from "@/lib/actions";
import { formatDate, formatMoney } from "@/lib/utils";
import { getBookingSettings } from "@/lib/settings";

export default async function AccountBookingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/sign-in");

  const [bookings, settings] = await Promise.all([
    db.booking.findMany({
      where: { userId: session.user.id },
      include: { room: true, payments: true },
      orderBy: { createdAt: "desc" },
    }),
    getBookingSettings(),
  ]);

  return (
    <div className="shell space-y-8 py-12">
      <div className="space-y-3">
        <span className="kicker">Личный кабинет</span>
        <h1 className="section-title font-black text-slate-950">Мои бронирования</h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          Здесь видны статусы оплаты, даты поездки и возможность отменить бронирование по текущим правилам возврата.
        </p>
      </div>

      <div className="grid gap-6">
        {bookings.length ? (
          bookings.map((booking) => {
            const daysBeforeArrival = Math.ceil((booking.startDate.getTime() - Date.now()) / 86400000);
            const fullRefund = daysBeforeArrival >= settings.freeCancellationDays;
            const partialRefund = !fullRefund && daysBeforeArrival >= settings.partialRefundDays;
            return (
              <article key={booking.id} className="surface rounded-[2rem] p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-black tracking-tight text-slate-950">{booking.room.title}</h2>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">{booking.status}</span>
                    </div>
                    <p className="text-sm leading-7 text-slate-600">
                      {formatDate(booking.startDate, "d MMMM yyyy")} — {formatDate(booking.endDate, "d MMMM yyyy")} · {booking.nights} ночей
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="metric-card">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Итого</p>
                        <p className="mt-2 text-xl font-black text-slate-950">{formatMoney(booking.totalAmount)}</p>
                      </div>
                      <div className="metric-card">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Предоплата</p>
                        <p className="mt-2 text-xl font-black text-slate-950">{formatMoney(booking.depositAmount)}</p>
                      </div>
                      <div className="metric-card">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Источник</p>
                        <p className="mt-2 text-xl font-black text-slate-950">{booking.source}</p>
                      </div>
                    </div>
                    <p className="rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600">
                      {fullRefund
                        ? `При отмене сейчас возможен полный возврат предоплаты.`
                        : partialRefund
                          ? `При отмене сейчас возможен частичный возврат ${settings.partialRefundPercent}% предоплаты.`
                          : `Сейчас бесплатная отмена уже недоступна. Возврат решается по правилам бронирования и фактическому статусу платежа.`}
                    </p>
                  </div>

                  {!["CANCELLED_BY_GUEST", "CANCELLED_BY_ADMIN", "COMPLETED"].includes(booking.status) ? (
                    <form action={cancelBookingAction.bind(null, booking.id)}>
                      <button className="cta-danger">Отменить бронь</button>
                    </form>
                  ) : null}
                </div>
              </article>
            );
          })
        ) : (
          <div className="surface rounded-[2rem] p-8">
            <p className="text-lg text-slate-600">Пока нет бронирований. Самое время выбрать номер.</p>
          </div>
        )}
      </div>
    </div>
  );
}
