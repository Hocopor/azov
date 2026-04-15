import { db } from "@/lib/db";
import { SectionHeading } from "@/components/section-heading";
import { RoomCard } from "@/components/room-card";

export default async function RoomsPage() {
  const rooms = await db.room.findMany({
    where: { isPublished: true },
    include: { images: true, amenities: { include: { amenity: true } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="shell py-12">
      <SectionHeading
        eyebrow="Номера"
        title="Выбери формат отдыха под свой состав и ритм"
        description="У каждого номера отдельная карточка, свои удобства, фото, детали по кухне и понятный сценарий бронирования с онлайн-предоплатой."
      />
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
