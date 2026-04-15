import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CookieBanner } from "@/components/cookie-banner";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { siteConfig } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.appUrl),
  title: {
    default: `${siteConfig.name} — отдых у Азовского моря`,
    template: `%s · ${siteConfig.name}`,
  },
  description:
    "Уютные номера у Азовского моря: онлайн-бронирование, предоплата, личный кабинет, трансфер, услуги и живая лента с обстановкой у моря.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans text-slate-900 antialiased">
        <Suspense>
          <AnalyticsTracker />
        </Suspense>
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
