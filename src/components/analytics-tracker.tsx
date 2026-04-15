"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ensureSession() {
  const key = "azov_session";
  const match = document.cookie.match(/(?:^|; )azov_session=([^;]+)/);
  if (match?.[1]) return match[1];
  const value = crypto.randomUUID();
  document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax`;
  return value;
}

function hasAnalyticsConsent() {
  return document.cookie.includes("azov_cookie_consent=analytics");
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const source = searchParams.get("utm_source");
    const medium = searchParams.get("utm_medium");
    const campaign = searchParams.get("utm_campaign");
    const cookieOptions = "; path=/; max-age=2592000; SameSite=Lax";

    if (source) document.cookie = `utm_source=${source}${cookieOptions}`;
    if (medium) document.cookie = `utm_medium=${medium}${cookieOptions}`;
    if (campaign) document.cookie = `utm_campaign=${campaign}${cookieOptions}`;
  }, [searchParams]);

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;
    const sessionId = ensureSession();
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "PAGE_VIEW",
        path: pathname,
        sessionId,
      }),
      keepalive: true,
    });
  }, [pathname]);

  return null;
}
