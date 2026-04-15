import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function FeedPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });
  if (!post || post.status !== "PUBLISHED") notFound();

  return (
    <article className="shell space-y-8 py-12">
      <div className="space-y-4">
        <span className="kicker">Лента у моря</span>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          {post.publishedAt ? formatDate(post.publishedAt, "d MMMM yyyy, HH:mm") : "Черновик"}
        </p>
        <h1 className="section-title font-black text-slate-950">{post.title}</h1>
        {post.excerpt ? <p className="max-w-3xl text-lg leading-8 text-slate-600">{post.excerpt}</p> : null}
      </div>

      <div className="relative h-[360px] overflow-hidden rounded-[2rem] bg-slate-200">
        <Image src={post.coverImage || "/placeholders/sea.svg"} alt={post.title} fill className="object-cover" />
      </div>

      {post.gallery.length ? (
        <div className="grid gap-4 md:grid-cols-3">
          {post.gallery.map((image) => (
            <div key={image} className="relative h-56 overflow-hidden rounded-[1.5rem] bg-slate-200">
              <Image src={image} alt={post.title} fill className="object-cover" />
            </div>
          ))}
        </div>
      ) : null}

      {post.videoUrl ? (
        <div className="surface rounded-[2rem] p-4">
          <video className="w-full rounded-[1.5rem]" controls src={post.videoUrl} />
        </div>
      ) : null}

      <div className="surface prose max-w-none rounded-[2rem] p-8">
        {post.body.split("\n").map((paragraph, index) =>
          paragraph.trim() ? <p key={index}>{paragraph}</p> : null,
        )}
      </div>
    </article>
  );
}
