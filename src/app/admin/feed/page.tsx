import { db } from "@/lib/db";
import { savePostAction } from "@/lib/actions";

export default async function AdminFeedPage() {
  const posts = await db.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <section className="surface rounded-[2rem] p-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Новая запись</h1>
        <form action={savePostAction} className="mt-6 grid gap-4">
          <input name="title" placeholder="Заголовок" required />
          <input name="excerpt" placeholder="Короткое описание" />
          <input name="coverImage" placeholder="URL обложки или /uploads/file.jpg" />
          <textarea name="galleryInput" placeholder="Галерея: по одному URL на строку" />
          <input name="videoUrl" placeholder="URL видео или /uploads/video.mp4" />
          <textarea name="body" placeholder="Текст записи" required />
          <select name="status" defaultValue="DRAFT">
            <option value="DRAFT">Черновик</option>
            <option value="PUBLISHED">Опубликовать</option>
          </select>
          <button className="cta-primary w-full md:w-fit" type="submit">Сохранить запись</button>
        </form>
      </section>

      {posts.map((post) => (
        <section key={post.id} className="surface rounded-[2rem] p-8">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">{post.title}</h2>
          <form action={savePostAction} className="mt-6 grid gap-4">
            <input type="hidden" name="id" value={post.id} />
            <input name="title" defaultValue={post.title} required />
            <input name="excerpt" defaultValue={post.excerpt || ""} />
            <input name="coverImage" defaultValue={post.coverImage || ""} />
            <textarea name="galleryInput" defaultValue={post.gallery.join("\n")} />
            <input name="videoUrl" defaultValue={post.videoUrl || ""} />
            <textarea name="body" defaultValue={post.body} required />
            <select name="status" defaultValue={post.status}>
              <option value="DRAFT">Черновик</option>
              <option value="PUBLISHED">Опубликовать</option>
            </select>
            <button className="cta-primary w-full md:w-fit" type="submit">Обновить запись</button>
          </form>
        </section>
      ))}
    </div>
  );
}
