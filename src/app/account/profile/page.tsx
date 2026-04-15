import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { deleteAccountAction, updateProfileAction } from "@/lib/actions";

export default async function AccountProfilePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/sign-in");
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/auth/sign-in");
  const params = await searchParams;

  return (
    <div className="shell space-y-8 py-12">
      <div className="space-y-3">
        <span className="kicker">Личный кабинет</span>
        <h1 className="section-title font-black text-slate-950">Профиль и персональные данные</h1>
      </div>

      {params.saved === "1" ? <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">Данные сохранены.</p> : null}
      {params.error === "active-bookings" ? (
        <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">Нельзя удалить аккаунт, пока есть активные бронирования.</p>
      ) : null}

      <form action={updateProfileAction} className="surface max-w-3xl space-y-5 rounded-[2rem] p-8">
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">Имя</span>
          <input name="name" defaultValue={user.name || ""} required />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">Телефон</span>
          <input name="phone" defaultValue={user.phone || ""} required />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
          <input disabled value={user.email || ""} />
        </label>
        <label className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700">
          <input className="mt-1 w-4" name="marketingConsent" type="checkbox" defaultChecked={user.marketingConsent} />
          Согласен получать новости о свободных датах и спецпредложениях.
        </label>
        <button className="cta-primary" type="submit">
          Сохранить
        </button>
      </form>

      <div className="surface max-w-3xl rounded-[2rem] p-8">
        <h2 className="text-2xl font-black tracking-tight text-slate-950">Удаление аккаунта</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Если активных броней нет, профиль будет обезличен. История бронирований и платежей может храниться в обезличенном виде для бухгалтерии и защиты интересов сторон.
        </p>
        <form action={deleteAccountAction} className="mt-6">
          <button className="cta-danger" type="submit">
            Удалить аккаунт
          </button>
        </form>
      </div>
    </div>
  );
}
