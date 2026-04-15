import { subDays } from "date-fns";
import { db } from "@/lib/db";
import { updateBookingSettingsAction } from "@/lib/actions";
import { getBookingSettings } from "@/lib/settings";

export default async function AdminDashboardPage() {
  const since = subDays(new Date(), 30);
  const [roomCount, bookingCount, pendingCount, events, settings] = await Promise.all([
    db.room.count(),
    db.booking.count(),
    db.booking.count({ where: { status: "PENDING_PAYMENT" } }),
    db.analyticsEvent.groupBy({
      by: ["eventName"],
      where: { createdAt: { gte: since } },
      _count: { eventName: true },
    }),
    getBookingSettings(),
  ]);

  const eventMap = Object.fromEntries(events.map((item) => [item.eventName, item._count.eventName]));
  const pageViews = Number(eventMap.PAGE_VIEW || 0);
  const bookingStarts = Number(eventMap.BOOKING_STARTED || 0);
  const paid = Number(eventMap.PAYMENT_SUCCEEDED || 0);
  const conversion = pageViews ? `${((paid / pageViews) * 100).toFixed(1)}%` : "0%";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <p className="text-sm text-slate-500">Номеров</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{roomCount}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-slate-500">Всего броней</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{bookingCount}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-slate-500">Ожидают оплату</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{pendingCount}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-slate-500">Конверсия в оплату</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{conversion}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <section className="surface rounded-[2rem] p-8">
          <div className="mb-5">
            <span className="kicker">Воронка за 30 дней</span>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Сколько людей доходит до оплаты</h1>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white p-5">
              <p className="text-sm text-slate-500">Просмотры</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{pageViews}</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5">
              <p className="text-sm text-slate-500">Старт брони</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{bookingStarts}</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5">
              <p className="text-sm text-slate-500">Успешные оплаты</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{paid}</p>
            </div>
          </div>
        </section>

        <section className="surface rounded-[2rem] p-8">
          <div className="mb-5">
            <span className="kicker">Настройки брони</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Предоплата и возвраты</h2>
          </div>
          <form action={updateBookingSettingsAction} className="grid gap-4">
            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">Режим предоплаты</span>
              <select name="depositMode" defaultValue={settings.depositMode}>
                <option value="fixed">Фиксированная сумма</option>
                <option value="percent">Процент от стоимости</option>
              </select>
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">Фиксированная сумма</span>
                <input name="depositFixed" type="number" defaultValue={settings.depositFixed} />
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">Процент</span>
                <input name="depositPercent" type="number" defaultValue={settings.depositPercent} />
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">Окно оплаты, минут</span>
                <input name="paymentWindowMinutes" type="number" defaultValue={settings.paymentWindowMinutes} />
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">Бесплатная отмена за дней</span>
                <input name="freeCancellationDays" type="number" defaultValue={settings.freeCancellationDays} />
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">Частичный возврат за дней</span>
                <input name="partialRefundDays" type="number" defaultValue={settings.partialRefundDays} />
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">Частичный возврат, %</span>
                <input name="partialRefundPercent" type="number" defaultValue={settings.partialRefundPercent} />
              </label>
            </div>
            <button className="cta-primary w-full" type="submit">
              Сохранить правила
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
