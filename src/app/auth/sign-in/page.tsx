import Link from "next/link";
import { signIn } from "@/auth";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  const registered = params.registered === "1";
  const hasVK = Boolean(process.env.AUTH_VK_ID && process.env.AUTH_VK_SECRET);
  const hasYandex = Boolean(process.env.AUTH_YANDEX_ID && process.env.AUTH_YANDEX_SECRET);

  return (
    <div className="shell py-12">
      <div className="mx-auto max-w-xl surface rounded-[2rem] p-8">
        <span className="kicker">Вход</span>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">Личный кабинет гостя</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Здесь можно посмотреть свои брони, статусы оплаты, отменить поездку по правилам и обновить личные данные.
        </p>

        {registered ? <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">Аккаунт создан. Теперь можно войти.</p> : null}
        {error ? <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">Не удалось войти. Проверь email и пароль.</p> : null}

        <form
          className="mt-6 space-y-4"
          action={async (formData) => {
            "use server";
            await signIn("credentials", {
              email: String(formData.get("email") || ""),
              password: String(formData.get("password") || ""),
              redirectTo: "/account/bookings",
            });
          }}
        >
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
            <input name="email" type="email" required />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Пароль</span>
            <input name="password" type="password" required />
          </label>
          <button className="cta-primary w-full" type="submit">
            Войти
          </button>
        </form>

        {hasVK || hasYandex ? (
          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-slate-500">Или войти через</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {hasVK ? (
                <form
                  action={async () => {
                    "use server";
                    await signIn("vk", { redirectTo: "/account/bookings" });
                  }}
                >
                  <button className="cta-secondary w-full" type="submit">
                    VK ID
                  </button>
                </form>
              ) : null}
              {hasYandex ? (
                <form
                  action={async () => {
                    "use server";
                    await signIn("yandex", { redirectTo: "/account/bookings" });
                  }}
                >
                  <button className="cta-secondary w-full" type="submit">
                    Яндекс ID
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        ) : null}

        <p className="mt-6 text-sm text-slate-600">
          Нет аккаунта? <Link href="/auth/register" className="font-semibold text-sky-700">Создать аккаунт</Link>
        </p>
      </div>
    </div>
  );
}
