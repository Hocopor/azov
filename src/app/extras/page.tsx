import { db } from "@/lib/db";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";

const included = [
  "Бесплатные сапборды",
  "Уборка номеров",
  "Мангал и беседки",
  "Парковка",
  "Wi-Fi",
  "Сушка белья и зона ручной стирки",
  "Детская площадка",
  "Велосипеды",
];

export default async function ExtrasPage() {
  const services = await db.service.findMany({ where: { isEnabled: true }, orderBy: [{ featured: "desc" }, { sortOrder: "asc" }] });

  return (
    <div className="shell space-y-12 py-12">
      <SectionHeading
        eyebrow="Услуги и удобства"
        title="Проживание + то, за что гости обычно готовы доплачивать"
        description="Раздел уже рассчитан не только на информирование, но и на допродажу: трансфер, локальные активности, аренду и спецпредложения по питанию."
      />

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="surface rounded-[2rem] p-6">
          <h2 className="mb-5 text-2xl font-black tracking-tight text-slate-950">Уже входит в отдых</h2>
          <div className="grid gap-3">
            {included.map((item) => (
              <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}
