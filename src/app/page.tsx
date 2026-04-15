import Link from "next/link";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";
import { RoomCard } from "@/components/room-card";
import { ServiceCard } from "@/components/service-card";
import { PostCard } from "@/components/post-card";

export default async function HomePage() {
  const [rooms, services, posts] = await Promise.all([
    db.room.findMany({
      where: { isPublished: true },
      include: { images: true, amenities: { include: { amenity: true } } },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      take: 3,
    }),
    db.service.findMany({ where: { isEnabled: true, featured: true }, orderBy: { sortOrder: "asc" }, take: 4 }),
    db.post.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 2 }),
  ]);

  return (
    <div className="space-y-24 pb-20">
      <section className="shell pt-8 md:pt-14">
        <div className="hero-grid surface grid overflow-hidden rounded-[2rem] p-6 md:grid-cols-[1.15fr_0.85fr] md:p-10">
          <div className="space-y-8 py-4">
            <span className="kicker">Азовское море · отдых без суеты</span>
            <div className="space-y-6">
              <h1 className="display-title max-w-4xl font-black text-slate-950">
                Сайт, который продаёт отдых у моря ещё до первого звонка.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Семейный гостевой формат, 7 разных номеров, прозрачные условия брони, удобный личный кабинет, онлайн-предоплата и понятная коммуникация по трансферу, заезду и отменам.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/rooms" className="cta-primary">
                Проверить даты и цены
              </Link>
              <a href={siteConfig.whatsapp} className="cta-secondary">
                Написать в WhatsApp
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="metric-card">
                <p className="text-3xl font-black text-slate-950">7</p>
                <p className="text-sm text-slate-600">номеров разного формата</p>
              </div>
              <div className="metric-card">
                <p className="text-3xl font-black text-slate-950">24/7</p>
                <p className="text-sm text-slate-600">онлайн-бронь и заявка на трансфер</p>
              </div>
              <div className="metric-card">
                <p className="text-3xl font-black text-slate-950">+50%</p>
                <p className="text-sm text-slate-600">рост доверия за счёт живой ленты и условий</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 pt-8 md:pt-0">
            <div className="placeholder-media min-h-[220px] rounded-[2rem] p-6">
              <div className="space-y-3 rounded-[1.5rem] bg-white/78 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Почему это конвертит</p>
                <ul className="space-y-3 text-sm leading-6 text-slate-700">
                  <li>• сразу видно свободные даты и занятость в календаре;</li>
                  <li>• бронь фиксируется предоплатой через ЮKassa;</li>
                  <li>• в кабинете есть отмена, история и статусы;</li>
                  <li>• в админке — метрики, воронка и ручное управление бронями.</li>
                </ul>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="surface rounded-[1.75rem] p-5">
                <p className="text-sm font-semibold text-slate-500">Сезон</p>
                <p className="mt-2 text-2xl font-black text-slate-950">{siteConfig.seasonLabel}</p>
              </div>
              <div className="surface rounded-[1.75rem] p-5">
                <p className="text-sm font-semibold text-slate-500">Заселение / выезд</p>
                <p className="mt-2 text-2xl font-black text-slate-950">
                  {siteConfig.checkinTime} / {siteConfig.checkoutTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell">
        <SectionHeading
          eyebrow="Каталог номеров"
          title="От семейных комнат до более приватных вариантов"
          description="Каждый номер можно открыть отдельно, посмотреть условия, удобства, календарь занятости и сразу перейти к платной броне."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      <section className="shell">
        <SectionHeading
          eyebrow="Дополнительная выручка"
          title="Не только проживание: услуги, впечатления и допродажа"
          description="На сайте уже предусмотрены бесплатные и платные услуги, которые можно включать и отключать через админку без вмешательства в код."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="shell">
        <SectionHeading
          eyebrow="Живая обстановка"
          title="Лента у моря вместо обезличенного блога"
          description="Фото, видео и короткие обновления помогают снимать сомнения: люди видят море, погоду, двор, загрузку и атмосферу прямо сейчас."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="shell">
        <div className="surface grid gap-6 rounded-[2rem] p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="space-y-3">
            <span className="kicker">Готово для запуска на VPS</span>
            <h2 className="section-title font-black text-slate-950">Docker + PostgreSQL + Cloudflare Tunnel уже предусмотрены.</h2>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Тебе останется заменить тексты, подгрузить реальные фото, заполнить реквизиты и включить оплату ЮKassa и OAuth-провайдеры, когда будут ключи.
            </p>
          </div>
          <Link href="/admin" className="cta-primary">
            Посмотреть админку
          </Link>
        </div>
      </section>
    </div>
  );
}
