import { db } from "@/lib/db";
import { saveRoomAction } from "@/lib/actions";

export default async function AdminRoomsPage() {
  const rooms = await db.room.findMany({ include: { images: { orderBy: { sortOrder: "asc" } } }, orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      {rooms.map((room) => (
        <section key={room.id} className="surface rounded-[2rem] p-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-950">{room.title}</h1>
          <p className="mt-2 text-sm text-slate-600">Редактирование карточки номера и списка изображений.</p>
          <form action={saveRoomAction} className="mt-6 grid gap-4">
            <input type="hidden" name="id" value={room.id} />
            <input name="title" defaultValue={room.title} required />
            <input name="shortDescription" defaultValue={room.shortDescription} required />
            <textarea name="description" defaultValue={room.description} required />
            <input name="priceFrom" type="number" defaultValue={room.priceFrom} required />
            <textarea
              name="imageUrls"
              defaultValue={room.images.map((image) => image.url).join("\n")}
              placeholder="По одному URL на строку. Можно использовать /uploads/your-file.jpg"
            />
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm text-slate-700">
                <input className="w-4" name="featured" type="checkbox" defaultChecked={room.featured} />
                Показывать как хит
              </label>
              <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm text-slate-700">
                <input className="w-4" name="isPublished" type="checkbox" defaultChecked={room.isPublished} />
                Номер опубликован
              </label>
            </div>
            <button className="cta-primary w-full md:w-fit" type="submit">Сохранить номер</button>
          </form>
        </section>
      ))}
    </div>
  );
}
