import Link from "next/link";
import { auth, signOut } from "@/auth";
import { navLinks } from "@/lib/site";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/65 backdrop-blur-xl">
      <div className="shell flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-black tracking-tight text-xl">
            Azov <span className="text-sky-700">Breeze</span>
          </Link>
          <span className="hidden rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 md:inline-flex">
            7 номеров · бронирование онлайн
          </span>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white/80"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/rooms" className="cta-primary text-sm">
            Проверить даты
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              {session.user.role === "ADMIN" ? (
                <Link href="/admin" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 md:inline-flex">
                  Админка
                </Link>
              ) : null}
              <Link href="/account/bookings" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700">
                Кабинет
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white md:inline-flex">
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <Link href="/auth/sign-in" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
