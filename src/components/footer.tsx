import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/40 bg-slate-950 text-white">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-2xl font-black">Azov Breeze</p>
          <p className="max-w-md text-sm text-white/70">
            Уютные номера у Азовского моря с личным кабинетом, онлайн-бронированием, безопасной предоплатой и понятными условиями заселения.
          </p>
          <div className="text-sm text-white/70">
            <p>{siteConfig.address}</p>
            <p>{siteConfig.phone}</p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Навигация</p>
          <div className="space-y-2 text-sm text-white/80">
            <Link href="/rooms">Номера</Link>
            <br />
            <Link href="/extras">Доп. услуги</Link>
            <br />
            <Link href="/feed">Лента у моря</Link>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Документы</p>
          <div className="space-y-2 text-sm text-white/80">
            <Link href="/privacy">Политика ПДн</Link>
            <br />
            <Link href="/terms">Пользовательское соглашение</Link>
            <br />
            <Link href="/booking-rules">Условия бронирования</Link>
            <br />
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
