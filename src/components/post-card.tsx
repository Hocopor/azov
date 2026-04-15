import Image from "next/image";
import Link from "next/link";
import type { Post } from "@prisma/client";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="surface overflow-hidden rounded-[2rem]">
      <div className="relative h-56 bg-slate-200">
        <Image src={post.coverImage || "/placeholders/sea.svg"} alt={post.title} fill className="object-cover" />
      </div>
      <div className="space-y-4 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {post.publishedAt ? formatDate(post.publishedAt, "d MMMM yyyy") : "Черновик"}
        </p>
        <h3 className="text-2xl font-black tracking-tight text-slate-950">{post.title}</h3>
        <p className="text-sm leading-7 text-slate-600">{post.excerpt}</p>
        <Link href={`/feed/${post.slug}`} className="cta-secondary inline-flex">
          Открыть запись
        </Link>
      </div>
    </article>
  );
}
