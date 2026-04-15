import { db } from "@/lib/db";
import { createManualBookingAction, createRoomBlockAction } from "@/lib/actions";
import { formatDate, formatMoney } from "@/lib/utils";

export default async function AdminBookingsPage() {
  const [bookings, rooms, blocks] = await Promise.all([
    db.booking.findMany({ include: { room: true, payments: true }, orderBy: { startDate: "asc" } }),
    db.room.findMany({ orderBy: { sortOrder: "asc" } }),
    db.roomBlock.findMany({ include: { room: true }, orderBy: { startDate: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="surface rounded-[2rem] p-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Добавить бронь по телефону</h1>
          <form action={createManualBookingAction} className="mt-6 grid gap-4">
            <select name="roomId" required>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>{room.title}</option>
              ))}
            </select>
            <input name="guestName" placeholder="Имя гостя" required />
            <input name="phone" placeholder="Телефон" required />
            <div className="grid gap-4 md:grid-cols-2">
              <input name="startDate" type="date" required />
              <input name="endDate" type="date" required />
            </div>
            <input name="totalAmount" type="number" placeholder="Итоговая стоимость" required />
            <button className="cta-primary" type="submit">Сохранить бронь</button>
          </form>
        </section>

        <section className="surface rounded-[2rem] p-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-950">Вывести номер из продажи</h2>
          <form action={createRoomBlockAction} className="mt-6 grid gap-4">
            <select name="roomId" required>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>{room.title}</option>
              ))}
            </select>
            <input name="title" placeholder="Например: ремонт / резерв" required />
            <input name="reason" placeholder="Комментарий" />
            <div className="grid gap-4 md:grid-cols-2">
              <input name="startDate" type="date" required />
              <input name="endDate" type="date" required />
            </div>
            <button className="cta-primary" type="submit">Заблокировать даты</button>
          </form>
        </section>
      </div>

      <section className="surface rounded-[2rem] p-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-950">Все бронирования</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="px-4 py-3">Номер</th>
                <th className="px-4 py-3">Гость</th>
                <th className="px-4 py-3">Даты</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Итого</th>
                <th className="px-4 py-3">Источник</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-slate-200/70">
                  <td className="px-4 py-4 font-semibold text-slate-900">{booking.room.title}</td>
                  <td className="px-4 py-4 text-slate-600">{booking.guestName}<br />{booking.phone}</td>
                  <td className="px-4 py-4 text-slate-600">{formatDate(booking.startDate, "d MMM yyyy")} — {formatDate(booking.endDate, "d MMM yyyy")}</td>
                  <td className="px-4 py-4"><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">{booking.status}</span></td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{formatMoney(booking.totalAmount)}</td>
                  <td className="px-4 py-4 text-slate-600">{booking.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="surface rounded-[2rem] p-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-950">Блокировки</h2>
        <div className="mt-6 grid gap-4">
          {blocks.map((block) => (
            <div key={block.id} className="rounded-[1.5rem] bg-white p-5">
              <p className="font-bold text-slate-950">{block.room.title} · {block.title}</p>
              <p className="mt-1 text-sm text-slate-600">{formatDate(block.startDate, "d MMM yyyy")} — {formatDate(block.endDate, "d MMM yyyy")}</p>
              {block.reason ? <p className="mt-2 text-sm text-slate-500">{block.reason}</p> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
