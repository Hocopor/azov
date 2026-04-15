import Link from "next/link";
import { registerUser } from "@/lib/actions";

export default function RegisterPage() {
  return (
    <div className="shell py-12">
      <div className="mx-auto max-w-xl surface rounded-[2rem] p-8">
        <span className="kicker">Регистрация</span>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">Создать аккаунт гостя</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Аккаунт ускоряет повторные бронирования, хранит историю поездок и позволяет управлять своими данными.
        </p>

        <form action={registerUser} className="mt-6 space-y-4">
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Имя</span>
            <input name="name" required />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Телефон</span>
            <input name="phone" required />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
            <input name="email" type="email" required />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Пароль</span>
            <input name="password" type="password" minLength={8} required />
          </label>
          <label className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700">
            <input className="mt-1 w-4" name="marketingConsent" type="checkbox" />
            Хочу иногда получать новости о свободных датах и спецпредложениях.
          </label>
          <button className="cta-primary w-full" type="submit">
            Создать аккаунт
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Уже есть аккаунт? <Link href="/auth/sign-in" className="font-semibold text-sky-700">Войти</Link>
        </p>
      </div>
    </div>
  );
}
