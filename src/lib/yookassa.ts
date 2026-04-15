import crypto from "node:crypto";

export async function createYooKassaPayment(payload: {
  amount: number;
  description: string;
  bookingId: string;
  customerEmail?: string | null;
  returnUrl: string;
}) {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;

  if (!shopId || !secretKey) {
    return { demo: true, redirectUrl: `${payload.returnUrl}?demoPayment=1&booking=${payload.bookingId}` };
  }

  const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");
  const response = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
      "Idempotence-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({
      amount: {
        value: payload.amount.toFixed(2),
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: payload.returnUrl,
      },
      description: payload.description,
      metadata: {
        bookingId: payload.bookingId,
      },
      receipt: payload.customerEmail
        ? {
            customer: {
              email: payload.customerEmail,
            },
            items: [
              {
                description: "Предоплата за бронирование проживания",
                quantity: "1.00",
                amount: {
                  value: payload.amount.toFixed(2),
                  currency: "RUB",
                },
                vat_code: 1,
                payment_mode: "full_prepayment",
                payment_subject: "service",
              },
            ],
          }
        : undefined,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`YooKassa error: ${errorBody}`);
  }

  const data = (await response.json()) as {
    id: string;
    status: string;
    confirmation?: { confirmation_url?: string };
  };

  return {
    demo: false,
    providerPaymentId: data.id,
    status: data.status,
    redirectUrl: data.confirmation?.confirmation_url,
    rawPayload: data,
  };
}
