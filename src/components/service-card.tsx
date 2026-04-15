import type { Service } from "@prisma/client";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="surface rounded-[2rem] p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-xl font-black tracking-tight text-slate-950">{service.name}</h3>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">{service.priceLabel}</span>
      </div>
      <p className="text-sm leading-7 text-slate-600">{service.summary}</p>
      <p className="mt-4 text-sm leading-7 text-slate-500">{service.description}</p>
    </article>
  );
}
