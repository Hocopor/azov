"use client";

import { addMonths, eachDayOfInterval, endOfMonth, format, isSameMonth, startOfMonth } from "date-fns";
import { ru } from "date-fns/locale";

export type CalendarRange = {
  startDate: string | Date;
  endDate: string | Date;
};

function normalize(date: string | Date) {
  return new Date(date);
}

function dayBlocked(date: Date, ranges: CalendarRange[]) {
  return ranges.some((range) => {
    const start = normalize(range.startDate);
    const end = normalize(range.endDate);
    return date >= start && date < end;
  });
}

export function MiniCalendar({ ranges }: { ranges: CalendarRange[] }) {
  const months = [0, 1].map((offset) => addMonths(new Date(), offset));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {months.map((month) => {
        const start = startOfMonth(month);
        const end = endOfMonth(month);
        const days = eachDayOfInterval({ start, end });
        const emptyCells = Array.from({ length: Math.max(0, start.getDay() === 0 ? 6 : start.getDay() - 1) });

        return (
          <div key={month.toISOString()} className="rounded-[1.5rem] bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-950">{format(month, "LLLL yyyy", { locale: ru })}</h3>
              <span className="text-xs text-slate-500">красным — занято</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
              {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
                <div key={day}>{day}</div>
              ))}
              {emptyCells.map((_, index) => (
                <div key={`empty-${index}`} />
              ))}
              {days.map((day) => {
                const blocked = dayBlocked(day, ranges);
                return (
                  <div
                    key={day.toISOString()}
                    className={`rounded-xl px-1 py-2 text-sm font-semibold ${
                      isSameMonth(day, month)
                        ? blocked
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-50 text-slate-700"
                        : "text-slate-300"
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
