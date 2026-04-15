import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell py-24">
      <div className="surface rounded-[2rem] p-10 text-center">
        <span className="kicker">404</span>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">Страница не найдена</h1>
        <p className="mt-4 text-lg text-slate-600">Возможно, запись была снята с публикации или ссылка устарела.</p>
        <Link href="/" className="cta-primary mt-6 inline-flex">
          На главную
        </Link>
      </div>
    </div>
  );
}
