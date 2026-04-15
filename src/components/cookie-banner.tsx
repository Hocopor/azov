"use client";

import { useEffect, useState } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = document.cookie.includes("azov_cookie_consent=");
    setVisible(!existing);
  }, []);

  if (!visible) return null;

  function saveConsent(analytics: boolean) {
    document.cookie = `azov_cookie_consent=${analytics ? "analytics" : "essential"}; path=/; max-age=31536000; SameSite=Lax`;
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/50 bg-slate-950 p-6 text-white shadow-2xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-lg font-black">Настройки cookies</p>
            <p className="text-sm leading-6 text-white/75">
              Мы используем обязательные cookies для авторизации и бронирования. Аналитические cookies включаются только с вашего согласия.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="cta-secondary" onClick={() => saveConsent(false)}>
              Только обязательные
            </button>
            <button className="cta-primary" onClick={() => saveConsent(true)}>
              Разрешить аналитику
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
