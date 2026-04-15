import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

const items = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/bookings", label: "Брони" },
  { href: "/admin/rooms", label: "Номера" },
  { href: "/admin/services", label: "Услуги" },
  { href: "/admin/feed", label: "Лента" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/auth/sign-in");

  return (
    <div className="shell grid gap-6 py-10 lg:grid-cols-[260px_1fr]">
      <aside className="surface h-fit rounded-[2rem] p-4">
        <p className="px-4 py-3 text-lg font-black text-slate-950">Админка</p>
        <nav className="grid gap-2">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
