"use client";

import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/utils";

type Props = {
  roomId: string;
  roomTitle: string;
  roomPriceFrom: number;
  settings: {
    depositMode: "fixed" | "percent";
    depositFixed: number;
    depositPercent: number;
  };
};

export function BookingForm({ roomId, roomTitle, roomPriceFrom, settings }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsTransfer, setNeedsTransfer] = useState(false);
  const [transferUnknown, setTransferUnknown] = useState(false);

  const depositPreview = useMemo(() => {
    return settings.depositMode === "fixed"
      ? settings.depositFixed
      : Math.max(1000, Math.round((roomPriceFrom * settings.depositPercent) / 100));
  }, [roomPriceFrom, settings]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string; redirectUrl?: string };
      if (!response.ok || !data.redirectUrl) {
        throw new Error(data.error || "Не удалось создать бронь.");
      }
      window.location.href = data.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка бронирования.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form id="booking" onSubmit={onSubmit} className="surface rounded-[2rem] p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-2">
        <span className="kicker">Онлайн-бронирование</span>
        <h3 className="text-3xl font-black tracking-tight text-slate-950">Забронировать {roomTitle}</h3>
        <p className="text-sm leading-7 text-slate-600">
          Предоплата сейчас — <strong>{formatMoney(depositPreview)}</strong>. Остальное можно принять при заселении.
        </p>
      </div>

      <input type="hidden" name="roomId" value={roomId} />

      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">Имя *</span>
          <input name="guestName" required placeholder="Как к вам обращаться" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">Телефон *</span>
          <input name="phone" required placeholder="+7 (...) ...-..-.." />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
          <input name="email" type="email" placeholder="Для чеков и подтверждения" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">Сколько взрослых *</span>
          <input name="adults" type="number" min={1} max={8} required defaultValue={2} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">Сколько детей</span>
          <input name="children" type="number" min={0} max={6} defaultValue={0} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">Дата заезда *</span>
          <input name="startDate" type="date" required />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">Дата выезда *</span>
          <input name="endDate" type="date" required />
        </label>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-medium text-slate-700">
          <input className="w-4" name="hasPets" type="checkbox" value="true" />
          Будут животные
        </label>
        <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-medium text-slate-700">
          <input className="w-4" name="smoking" type="checkbox" value="true" />
          Есть вредные привычки / курение
        </label>
        <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-medium text-slate-700 md:col-span-2">
          <input
            className="w-4"
            name="needsTransfer"
            type="checkbox"
            value="true"
            checked={needsTransfer}
            onChange={(event) => setNeedsTransfer(event.target.checked)}
          />
          Нужен трансфер
        </label>
      </div>

      {needsTransfer ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Откуда забрать</span>
            <input name="transferFrom" placeholder="Например: Мелитополь, вокзал" />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Дата трансфера</span>
            <input name="transferDate" type="datetime-local" disabled={transferUnknown} />
          </label>
          <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-medium text-slate-700">
            <input
              className="w-4"
              name="transferUnknown"
              type="checkbox"
              value="true"
              checked={transferUnknown}
              onChange={(event) => setTransferUnknown(event.target.checked)}
            />
            Пока не знаю точную дату / время
          </label>
        </div>
      ) : null}

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">Комментарий / пожелания</span>
        <textarea name="comment" placeholder="Например: хотим тишину, нужна детская кроватка, поздний заезд" />
      </label>

      <label className="mt-5 flex items-start gap-3 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700">
        <input className="mt-1 w-4" required name="legalConsent" type="checkbox" value="true" />
        Подтверждаю согласие с условиями бронирования, политикой обработки персональных данных и возвратом средств по правилам объекта размещения.
      </label>

      {needsTransfer && transferUnknown ? (
        <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          После бронирования укажем напоминание: если до заезда больше 14 дней, свяжемся за 14 дней; если меньше — свяжемся в ближайшее время для уточнения деталей трансфера.
        </p>
      ) : null}

      {error ? <p className="mt-4 text-sm font-semibold text-rose-600">{error}</p> : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button className="cta-primary flex-1" type="submit" disabled={submitting}>
          {submitting ? "Создаём бронь..." : "Перейти к оплате"}
        </button>
        <p className="flex-1 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600">
          Если выбранный диапазон уже занят, система сразу покажет это и не даст оплатить бронь.
        </p>
      </div>
    </form>
  );
}
