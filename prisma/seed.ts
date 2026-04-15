import { PrismaClient, KitchenType, PostStatus, UserRole } from "@prisma/client";
import { hashPassword } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  const amenities = [
    "Wi-Fi",
    "Парковка",
    "Телевизор",
    "Холодильник",
    "Душ",
    "Туалет",
    "Кондиционер",
    "Общая кухня",
    "Своя кухня",
    "Мангальная зона",
  ];

  for (const name of amenities) {
    await prisma.amenity.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const amenityMap = Object.fromEntries(
    (await prisma.amenity.findMany()).map((amenity) => [amenity.name, amenity.id]),
  );

  const rooms = [
    {
      slug: "sea-family-1",
      title: "Семейный номер с террасой",
      shortDescription: "Спокойный номер для семьи с ребёнком и вечерних посиделок на своей террасе.",
      description: "Подходит для семьи или пары, которая хочет жить ближе к тихой части двора. Внутри базовый уют, отдельная кухня и акцент на спокойствие.",
      priceFrom: 4200,
      capacityAdults: 2,
      capacityChildren: 1,
      beds: "1 двуспальная + доп. место",
      sizeSqm: 24,
      kitchenType: KitchenType.PRIVATE,
      bathroomCount: 1,
      airConditioning: true,
      petsAllowed: false,
      smokingAllowed: false,
      featured: true,
      sortOrder: 1,
      amenityNames: ["Wi-Fi", "Парковка", "Телевизор", "Своя кухня", "Душ", "Туалет", "Кондиционер"],
    },
    {
      slug: "sea-family-2",
      title: "Светлый номер у беседки",
      shortDescription: "Практичный вариант для родителей с ребёнком, которые хотят быть ближе к общей зоне.",
      description: "Светлый номер с быстрым доступом к беседкам и детской зоне. Хороший баланс цены и комфорта для семейного отдыха.",
      priceFrom: 3800,
      capacityAdults: 2,
      capacityChildren: 2,
      beds: "1 двуспальная + 2 односпальные",
      sizeSqm: 26,
      kitchenType: KitchenType.PRIVATE,
      bathroomCount: 1,
      airConditioning: true,
      petsAllowed: true,
      smokingAllowed: false,
      featured: true,
      sortOrder: 2,
      amenityNames: ["Wi-Fi", "Парковка", "Телевизор", "Своя кухня", "Душ", "Туалет", "Кондиционер"],
    },
    {
      slug: "budget-room-1",
      title: "Уютный номер эконом+",
      shortDescription: "Хороший вариант для тех, кто больше времени проводит у моря, чем в комнате.",
      description: "Небольшой номер с базовым набором удобств и приятной ценой. Подходит для бюджетного отдыха на несколько ночей.",
      priceFrom: 2900,
      capacityAdults: 2,
      capacityChildren: 0,
      beds: "1 двуспальная",
      sizeSqm: 16,
      kitchenType: KitchenType.SHARED,
      bathroomCount: 1,
      airConditioning: false,
      petsAllowed: false,
      smokingAllowed: false,
      featured: false,
      sortOrder: 3,
      amenityNames: ["Wi-Fi", "Парковка", "Телевизор", "Общая кухня", "Душ", "Туалет"],
    },
    {
      slug: "budget-room-2",
      title: "Номер для пары",
      shortDescription: "Компактный и аккуратный вариант для двоих с общей кухней на три номера.",
      description: "Выбор для пары, которой нужен аккуратный номер без переплаты. Общая кухня рядом, двор и парковка включены.",
      priceFrom: 3000,
      capacityAdults: 2,
      capacityChildren: 0,
      beds: "1 двуспальная",
      sizeSqm: 17,
      kitchenType: KitchenType.SHARED,
      bathroomCount: 1,
      airConditioning: false,
      petsAllowed: false,
      smokingAllowed: false,
      featured: false,
      sortOrder: 4,
      amenityNames: ["Wi-Fi", "Парковка", "Телевизор", "Общая кухня", "Душ", "Туалет"],
    },
    {
      slug: "budget-room-3",
      title: "Номер с быстрым выходом во двор",
      shortDescription: "Удобен для гостей с детьми: легко выйти к песочнице и общей зоне.",
      description: "Практичный номер с быстрым выходом во двор. Хорошо подойдёт для неспешного летнего формата без лишней цены.",
      priceFrom: 3200,
      capacityAdults: 2,
      capacityChildren: 1,
      beds: "1 двуспальная + диванчик",
      sizeSqm: 18,
      kitchenType: KitchenType.SHARED,
      bathroomCount: 1,
      airConditioning: true,
      petsAllowed: false,
      smokingAllowed: false,
      featured: false,
      sortOrder: 5,
      amenityNames: ["Wi-Fi", "Парковка", "Телевизор", "Общая кухня", "Душ", "Туалет", "Кондиционер"],
    },
    {
      slug: "premium-room-1",
      title: "Просторный номер с кухней",
      shortDescription: "Для тех, кто любит больше пространства, кондиционер и своё ощущение приватности.",
      description: "Более просторный номер с отдельной кухней и акцентом на комфорт. Подходит для более долгих заездов и гостей с запросом на удобство.",
      priceFrom: 4700,
      capacityAdults: 3,
      capacityChildren: 1,
      beds: "1 двуспальная + 1 односпальная",
      sizeSqm: 29,
      kitchenType: KitchenType.PRIVATE,
      bathroomCount: 1,
      airConditioning: true,
      petsAllowed: true,
      smokingAllowed: false,
      featured: true,
      sortOrder: 6,
      amenityNames: ["Wi-Fi", "Парковка", "Телевизор", "Своя кухня", "Душ", "Туалет", "Кондиционер"],
    },
    {
      slug: "premium-room-2",
      title: "Тихий номер для длительного отдыха",
      shortDescription: "Номер, в котором удобно задержаться дольше пары дней: спокойно, светло и без суеты.",
      description: "Подойдёт для гостей, которые приезжают на неделю и больше. Есть своя кухня, холодильник и больше полезного пространства.",
      priceFrom: 5000,
      capacityAdults: 3,
      capacityChildren: 1,
      beds: "1 двуспальная + диван",
      sizeSqm: 30,
      kitchenType: KitchenType.PRIVATE,
      bathroomCount: 1,
      airConditioning: true,
      petsAllowed: true,
      smokingAllowed: false,
      featured: true,
      sortOrder: 7,
      amenityNames: ["Wi-Fi", "Парковка", "Телевизор", "Своя кухня", "Душ", "Туалет", "Кондиционер", "Холодильник"],
    },
  ];

  for (const room of rooms) {
    const upserted = await prisma.room.upsert({
      where: { slug: room.slug },
      update: {
        title: room.title,
        shortDescription: room.shortDescription,
        description: room.description,
        priceFrom: room.priceFrom,
        capacityAdults: room.capacityAdults,
        capacityChildren: room.capacityChildren,
        beds: room.beds,
        sizeSqm: room.sizeSqm,
        kitchenType: room.kitchenType,
        bathroomCount: room.bathroomCount,
        airConditioning: room.airConditioning,
        petsAllowed: room.petsAllowed,
        smokingAllowed: room.smokingAllowed,
        featured: room.featured,
        sortOrder: room.sortOrder,
      },
      create: {
        slug: room.slug,
        title: room.title,
        shortDescription: room.shortDescription,
        description: room.description,
        priceFrom: room.priceFrom,
        capacityAdults: room.capacityAdults,
        capacityChildren: room.capacityChildren,
        beds: room.beds,
        sizeSqm: room.sizeSqm,
        kitchenType: room.kitchenType,
        bathroomCount: room.bathroomCount,
        airConditioning: room.airConditioning,
        petsAllowed: room.petsAllowed,
        smokingAllowed: room.smokingAllowed,
        featured: room.featured,
        sortOrder: room.sortOrder,
      },
    });

    await prisma.roomImage.deleteMany({ where: { roomId: upserted.id } });
    await prisma.roomImage.create({
      data: {
        roomId: upserted.id,
        url: "/placeholders/room.svg",
        alt: room.title,
        sortOrder: 0,
      },
    });

    await prisma.roomAmenity.deleteMany({ where: { roomId: upserted.id } });
    await prisma.roomAmenity.createMany({
      data: room.amenityNames.map((name) => ({
        roomId: upserted.id,
        amenityId: amenityMap[name],
      })),
      skipDuplicates: true,
    });
  }

  const services = [
    {
      slug: "transfer",
      name: "Трансфер",
      summary: "Платный трансфер из нужной точки по согласованию.",
      description: "Можно заранее указать, откуда и когда забрать. Если точное время неизвестно, система сохранит пометку и напомнит связаться с гостем.",
      priceLabel: "по запросу",
      featured: true,
      isEnabled: true,
      sortOrder: 1,
    },
    {
      slug: "sup-rides",
      name: "Прогулки на сапах",
      summary: "Выезд на сапах и прокат в спокойные дни.",
      description: "Можно использовать как бесплатную опцию, так и как отдельное предложение с доплатой в зависимости от формата.",
      priceLabel: "по запросу",
      featured: true,
      isEnabled: true,
      sortOrder: 2,
    },
    {
      slug: "laundry",
      name: "Стирка",
      summary: "Базовая бытовая услуга, которую гости часто спрашивают заранее.",
      description: "Стандартная бытовая стирка с фиксированной стоимостью.",
      priceLabel: "100 ₽",
      featured: true,
      isEnabled: true,
      sortOrder: 3,
    },
    {
      slug: "home-dinners",
      name: "Домашние ужины",
      summary: "Блок под твои фирменные блюда или предзаказ на вечер.",
      description: "Изначально выключен, чтобы можно было включить позже, когда определишься с меню и датами.",
      priceLabel: "по предзаказу",
      featured: false,
      isEnabled: false,
      sortOrder: 4,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "owner@example.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const adminName = process.env.ADMIN_NAME || "Владелец";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      role: UserRole.ADMIN,
      passwordHash: hashPassword(adminPassword),
    },
    create: {
      name: adminName,
      email: adminEmail,
      role: UserRole.ADMIN,
      phone: "+7 (900) 000-00-00",
      passwordHash: hashPassword(adminPassword),
    },
  });

  const existingPost = await prisma.post.findUnique({ where: { slug: "sea-today-demo" } });
  if (!existingPost) {
    await prisma.post.create({
      data: {
        slug: "sea-today-demo",
        title: "Море сегодня: спокойная вода и мягкий вечерний свет",
        excerpt: "Показываем, как выглядит берег прямо сейчас, чтобы гостям было проще решиться на бронь.",
        body: "Сегодня берег спокойный, вода чистая, ветер умеренный.\n\nТакие посты хорошо работают как триггер доверия: люди видят не рекламную абстракцию, а реальную обстановку и атмосферу.\n\nВ этом разделе удобно публиковать короткие видео, фото двора, море, свободные даты или анонсы ужинов.",
        coverImage: "/placeholders/sea.svg",
        gallery: ["/placeholders/yard.svg", "/placeholders/sea.svg"],
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }

  await prisma.setting.upsert({
    where: { key: "booking" },
    update: {},
    create: {
      key: "booking",
      value: {
        depositMode: "percent",
        depositFixed: 3000,
        depositPercent: 20,
        paymentWindowMinutes: 30,
        freeCancellationDays: 21,
        partialRefundDays: 14,
        partialRefundPercent: 50,
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
