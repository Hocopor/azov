import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { getBookingSettings } from "@/lib/settings";
import { getBlockedDateRanges } from "@/lib/availability";
import { MiniCalendar } from "@/components/mini-calendar";
import { BookingForm } from "@/components/forms/booking-form";
import { formatMoney } from "@/lib/utils";

export default async function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [room, settings] = await Promise.all([
    db.room.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        amenities: { include: { amenity: true } },
      },
    }),
    getBookingSettings(),
  ]);

  if (!room) notFound();

  const ranges = await getBlockedDateRanges(room.id);
  const images = room.images.length ? room.images : [{ id: "placeholder", roomId: room.id, alt: room.title, url: "/placeholders/room.svg", sortOrder: 0, createdAt: new Date() }];

  return (
    <div className="shell space-y-12 py-12">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <Link href="/rooms" className="text-sm font-semibold text-slate-500">
              ← Ко всем номерам
            </Link>
            <span className="kicker">Карточка номера</span>
            <h1 className="section-title font-black text-slate-950">{room.title}</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">{room.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="surface rounded-[1.75rem] p-5">
              <p className="text-sm text-slate-500">Стоимость</p>
              <p className="mt-2 text-3xl font-black text-slate-950">от {formatMoney(room.priceFrom)}</p>
            </div>
            <div className="surface rounded-[1.75rem] p-5">
              <p className="text-sm text-slate-500">Вместимость</p>
              <p className="mt-2 text-3xl font-black text-slate-950">до {room.capacityAdults + room.capacityChildren} гостей</p>
            </div>
            <div className="surface rounded-[1.75rem] p-5">
              <p className="text-sm text-slate-500">Кухня</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{room.kitchenType === "PRIVATE" ? "Своя" : "Общая на 3 номера"}</p>
            </div>
            <div className="surface rounded-[1.75rem] p-5">
              <p className="text-sm text-slate-500">Кондиционер</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{room.airConditioning ? "Есть" : "Нет"}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {images.map((image) => (
              <div key={image.id} className="relative h-72 overflow-hidden rounded-[1.75rem] bg-slate-200">
                <Image src={image.url} alt={image.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface rounded-[2rem] p-6">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-slate-950">Что внутри</h2>
            <div className="flex flex-wrap gap-3">
              {room.amenities.map((item) => (
                <span key={item.amenityId} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700">
                  {item.amenity.name}
                </span>
              ))}
            </div>
          </div>

          <div className="surface rounded-[2rem] p-6">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-slate-950">Календарь занятости</h2>
            <MiniCalendar ranges={[...ranges.bookings, ...ranges.blocks]} />
          </div>

          <BookingForm roomId={room.id} roomTitle={room.title} roomPriceFrom={room.priceFrom} settings={settings} />
        </div>
      </div>
    </div>
  );
}
