export default function CookiesPage() {
  return (
    <div className="shell py-12">
      <article className="surface prose max-w-none rounded-[2rem] p-8">
        <span className="kicker">Cookies</span>
        <h1 className="section-title font-black text-slate-950">Политика cookies</h1>
        <p>
          Сайт использует обязательные cookies для авторизации, хранения сессии и корректной работы бронирования. Аналитические cookies включаются только по отдельному согласию пользователя через баннер согласия.
        </p>
        <p>
          Пользователь может в любой момент очистить cookies в браузере. При этом часть функций, например вход в личный кабинет, перестанет работать до повторной авторизации.
        </p>
      </article>
    </div>
  );
}
