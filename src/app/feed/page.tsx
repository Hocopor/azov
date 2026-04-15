import { db } from "@/lib/db";
import { SectionHeading } from "@/components/section-heading";
import { PostCard } from "@/components/post-card";

export default async function FeedPage() {
  const posts = await db.post.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } });

  return (
    <div className="shell py-12">
      <SectionHeading
        eyebrow="Лента у моря"
        title="Живые обновления вместо безликих новостей"
        description="Этот раздел помогает продавать доверие: здесь можно публиковать обстановку на пляже, видео двора, свежие фото моря, анонсы ужинов или выездов на сапах."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
