import { db } from "@/lib/db";
import { saveServiceAction } from "@/lib/actions";

export default async function AdminServicesPage() {
  const services = await db.service.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });

  return (
    <div className="space-y-6">
      <section className="surface rounded-[2rem] p-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Новая услуга</h1>
        <form action={saveServiceAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <input name="name" placeholder="Название" required />
          <input name="priceLabel" placeholder="Например: от 100 ₽ / бесплатно / по запросу" required />
          <input name="summary" placeholder="Коротко" className="md:col-span-2" required />
          <textarea name="description" placeholder="Подробное описание" className="md:col-span-2" required />
          <input name="sortOrder" type="number" defaultValue={10} required />
          <div className="grid gap-3 md:grid-cols-2 md:col-span-2">
            <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm text-slate-700">
              <input className="w-4" name="featured" type="checkbox" />
              Показывать на главной
            </label>
            <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm text-slate-700">
              <input className="w-4" name="isEnabled" type="checkbox" defaultChecked />
              Услуга активна
            </label>
          </div>
          <button className="cta-primary md:col-span-2 md:w-fit" type="submit">Сохранить услугу</button>
        </form>
      </section>

      {services.map((service) => (
        <section key={service.id} className="surface rounded-[2rem] p-8">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">{service.name}</h2>
          <form action={saveServiceAction} className="mt-6 grid gap-4 md:grid-cols-2">
            <input type="hidden" name="id" value={service.id} />
            <input name="name" defaultValue={service.name} required />
            <input name="priceLabel" defaultValue={service.priceLabel} required />
            <input name="summary" defaultValue={service.summary} className="md:col-span-2" required />
            <textarea name="description" defaultValue={service.description} className="md:col-span-2" required />
            <input name="sortOrder" type="number" defaultValue={service.sortOrder} required />
            <div className="grid gap-3 md:grid-cols-2 md:col-span-2">
              <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm text-slate-700">
                <input className="w-4" name="featured" type="checkbox" defaultChecked={service.featured} />
                Показывать на главной
              </label>
              <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm text-slate-700">
                <input className="w-4" name="isEnabled" type="checkbox" defaultChecked={service.isEnabled} />
                Услуга активна
              </label>
            </div>
            <button className="cta-primary md:col-span-2 md:w-fit" type="submit">Обновить</button>
          </form>
        </section>
      ))}
    </div>
  );
}
