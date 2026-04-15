export const siteConfig = {
  name: process.env.PUBLIC_SITE_NAME || "Azov Breeze",
  phone: process.env.PUBLIC_SITE_PHONE || "+7 (900) 000-00-00",
  whatsapp: process.env.PUBLIC_SITE_WHATSAPP || "https://wa.me/79000000000",
  telegram: process.env.PUBLIC_SITE_TELEGRAM || "https://t.me/example",
  address: process.env.PUBLIC_SITE_ADDRESS || "Берег Азовского моря",
  coords: process.env.PUBLIC_SITE_COORDS || "47.123,36.456",
  checkinTime: process.env.PUBLIC_CHECKIN_TIME || "14:00",
  checkoutTime: process.env.PUBLIC_CHECKOUT_TIME || "11:00",
  seasonLabel: process.env.PUBLIC_SEASON_LABEL || "Май — сентябрь",
  currency: process.env.PUBLIC_BASE_CURRENCY || "RUB",
  appUrl: process.env.APP_URL || "http://localhost:3000",
};

export const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/rooms", label: "Номера" },
  { href: "/extras", label: "Услуги" },
  { href: "/feed", label: "Лента у моря" },
];
