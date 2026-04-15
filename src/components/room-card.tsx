import Image from "next/image";
import Link from "next/link";
import type { Room, RoomImage, RoomAmenity, Amenity } from "@prisma/client";
import { formatMoney } from "@/lib/utils";

type RoomCardProps = {
  room: Room & {
    images: RoomImage[];
    amenities: Array<RoomAmenity & { amenity: Amenity }>;
  };
};

export function RoomCard({ room }: RoomCardProps) {
  const image = room.images[0]?.url || "/placeholders/room.svg";

  return (
    <article className="surface overflow-hidden rounded-[2rem]">
      <div className="relative h-64">
        <Image src={image} alt={room.title} fill className="object-cover" />
      </div>
      <div className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-slate-950">{room.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{room.shortDescription}</p>
          </div>
          {room.featured ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Хит</span>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
          <div className="metric-card">до {room.capacityAdults + room.capacityChildren} гостей</div>
          <div className="metric-card">от {formatMoney(room.priceFrom)}</div>
          <div className="metric-card">{room.sizeSqm} м²</div>
          <div className="metric-card">{room.airConditioning ? "Есть кондиционер" : "Без кондиционера"}</div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
          {room.amenities.slice(0, 5).map((item) => (
            <span key={item.amenityId} className="rounded-full bg-white px-3 py-2">
              {item.amenity.name}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={`/rooms/${room.slug}`} className="cta-primary flex-1">
            Посмотреть номер
          </Link>
          <Link href={`/rooms/${room.slug}#booking`} className="cta-secondary flex-1">
            Забронировать
          </Link>
        </div>
      </div>
    </article>
  );
}
