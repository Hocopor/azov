# Как заполнять `.env`

Ниже — понятная инструкция для каждого пункта из файла `.env.example`: что он делает, обязателен ли он, где его взять и в каком виде писать.

## Как редактировать `.env`

Сначала скопируй шаблон:

```bash
cp .env.example .env
nano .env
```

Правила:
- слева всегда имя переменной, справа значение;
- пробелы вокруг `=` не нужны;
- пустые необязательные поля можно оставить пустыми.

Пример:

```env
APP_URL=https://example.com
SMTP_PORT=587
AUTH_VK_ID=
```

---

# 1. Основные настройки приложения

## `NODE_ENV`
**Что делает:** включает production-режим Node.js и Next.js.

**Что писать:**
```env
NODE_ENV=production
```

**Где брать:** ниоткуда. Для сервера просто оставь `production`.

## `APP_URL`
**Что делает:** главный публичный адрес сайта. Используется для ссылок и возврата после оплаты.

**Обязательно:** да.

**Пример:**
```env
APP_URL=https://azov-breeze.ru
```

**Где брать:** твой основной домен.

**Важно:** без завершающего `/`.

## `NEXTAUTH_URL`
**Что делает:** публичный адрес сайта для системы авторизации.

**Обязательно:** да.

**Обычно:** то же самое, что `APP_URL`.

**Пример:**
```env
NEXTAUTH_URL=https://azov-breeze.ru
```

## `NEXTAUTH_SECRET`
**Что делает:** секретный ключ для сессий и авторизации.

**Обязательно:** да.

**Как сгенерировать:**
```bash
openssl rand -base64 32
```

или

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Пример:**
```env
NEXTAUTH_SECRET=3f99c4c5c6c5e1f8cf52f2d3b6d1f3f0b7f4a49d6d8c7a2f0d4c6e8a9b1c2d3e
```

---

# 2. База данных

## `DATABASE_URL`
**Что делает:** строка подключения к PostgreSQL.

**Обязательно:** да.

**Формат:**
```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public
```

**Пример для этого Docker-проекта:**
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/azov_booking?schema=public
```

**Где брать:**
- `USER`, `PASSWORD`, `DBNAME` — из настроек PostgreSQL;
- `HOST` — имя контейнера базы, здесь `db`;
- `PORT` — обычно `5432`.

Если в `docker-compose.yml` пароль и база не менялись, можешь оставить пример как есть.

---

# 3. Данные, которые показываются на сайте

## `PUBLIC_SITE_NAME`
Название объекта.

**Пример:**
```env
PUBLIC_SITE_NAME=Azov Breeze
```

## `PUBLIC_SITE_PHONE`
Телефон на сайте.

**Пример:**
```env
PUBLIC_SITE_PHONE=+7 (999) 123-45-67
```

## `PUBLIC_SITE_WHATSAPP`
Ссылка на WhatsApp.

**Правильно:**
```env
PUBLIC_SITE_WHATSAPP=https://wa.me/79991234567
```

**Как делать:** только цифры, без плюса, пробелов и скобок.

## `PUBLIC_SITE_TELEGRAM`
Ссылка на Telegram.

**Пример:**
```env
PUBLIC_SITE_TELEGRAM=https://t.me/azovbreeze
```

## `PUBLIC_SITE_ADDRESS`
Адрес или понятное описание локации.

**Пример:**
```env
PUBLIC_SITE_ADDRESS=Берег Азовского моря, ул. Морская, 7
```

## `PUBLIC_SITE_COORDS`
Координаты для карты.

**Пример:**
```env
PUBLIC_SITE_COORDS=47.123,36.456
```

**Где брать:** Яндекс Карты, Google Maps, 2ГИС.

## `PUBLIC_CHECKIN_TIME`
Время заезда.

**Пример:**
```env
PUBLIC_CHECKIN_TIME=14:00
```

## `PUBLIC_CHECKOUT_TIME`
Время выезда.

**Пример:**
```env
PUBLIC_CHECKOUT_TIME=11:00
```

## `PUBLIC_SEASON_LABEL`
Подпись сезона на сайте.

**Пример:**
```env
PUBLIC_SEASON_LABEL=Май — сентябрь
```

## `PUBLIC_BASE_CURRENCY`
Валюта сайта.

**Обычно:**
```env
PUBLIC_BASE_CURRENCY=RUB
```

---

# 4. Вход через соцсети

Если соцвходы пока не нужны, оставь эти поля пустыми.

## `AUTH_VK_ID`
## `AUTH_VK_SECRET`
Для входа через VK.

**Где брать:** в кабинете разработчика VK после создания приложения.

**Пример:**
```env
AUTH_VK_ID=12345678
AUTH_VK_SECRET=vk1.aBcDeFgHiJkLmNoP
```

## `AUTH_YANDEX_ID`
## `AUTH_YANDEX_SECRET`
Для входа через Яндекс.

**Где брать:** в кабинете разработчика Яндекса после создания OAuth-приложения.

**Пример:**
```env
AUTH_YANDEX_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
AUTH_YANDEX_SECRET=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

---

# 5. Оплата через ЮKassa

## `YOOKASSA_SHOP_ID`
ID магазина в ЮKassa.

**Обязательно для реальных оплат:** да.

**Пример:**
```env
YOOKASSA_SHOP_ID=123456
```

**Где брать:** в кабинете ЮKassa.

## `YOOKASSA_SECRET_KEY`
Секретный API-ключ ЮKassa.

**Обязательно для реальных оплат:** да.

**Пример:**
```env
YOOKASSA_SECRET_KEY=test_xxxxxxxxxxxxxxxxxxxxxxxx
```

или в боевом режиме:

```env
YOOKASSA_SECRET_KEY=live_xxxxxxxxxxxxxxxxxxxxxxxx
```

**Где брать:** в кабинете ЮKassa, раздел API.

## `YOOKASSA_WEBHOOK_SECRET`
Секрет для уведомлений от ЮKassa.

**Пример:**
```env
YOOKASSA_WEBHOOK_SECRET=my_yookassa_webhook_secret_123
```

**Где брать:** из настройки webhook или своего секрета для проверки уведомлений.

**Важно:** в текущем проекте это поле подготовлено под webhook-логику; лучше заполнить сразу и хранить как секрет.

---

# 6. Email-уведомления

Если письма пока не нужны, поля можно временно оставить пустыми.

## `SMTP_HOST`
SMTP-сервер.

**Пример:**
```env
SMTP_HOST=smtp.yandex.ru
```

или

```env
SMTP_HOST=smtp.gmail.com
```

## `SMTP_PORT`
SMTP-порт.

**Обычно:**
- `587` — STARTTLS
- `465` — SSL/TLS

**Пример:**
```env
SMTP_PORT=587
```

## `SMTP_USER`
Логин SMTP.

**Пример:**
```env
SMTP_USER=booking@azov-breeze.ru
```

## `SMTP_PASSWORD`
Пароль SMTP или пароль приложения.

**Пример:**
```env
SMTP_PASSWORD=veryStrongPassword123
```

## `SMTP_FROM`
Адрес отправителя.

**Пример:**
```env
SMTP_FROM=Azov Breeze <booking@azov-breeze.ru>
```

---

# 7. Cloudflare Tunnel

## `CLOUDFLARE_TUNNEL_TOKEN`
Токен для контейнера `cloudflared`, чтобы сайт открывался через Cloudflare Tunnel.

**Обязательно:** да, если используешь туннель через Docker.

**Где брать:** Cloudflare Zero Trust -> Tunnels -> твой tunnel -> token.

**Пример:**
```env
CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoi...очень_длинная_строка...
```

---

# 8. Первый администратор

## `ADMIN_EMAIL`
Почта первого администратора.

**Пример:**
```env
ADMIN_EMAIL=owner@azov-breeze.ru
```

## `ADMIN_PASSWORD`
Пароль первого администратора.

**Пример:**
```env
ADMIN_PASSWORD=StrongPassword_2026!
```

## `ADMIN_NAME`
Имя первого администратора.

**Пример:**
```env
ADMIN_NAME=Владелец
```

---

# Готовый пример `.env`

```env
# App
NODE_ENV=production
APP_URL=https://azov-breeze.ru
NEXTAUTH_URL=https://azov-breeze.ru
NEXTAUTH_SECRET=replace_with_long_random_secret

# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/azov_booking?schema=public

# Owner contacts shown on site
PUBLIC_SITE_NAME=Azov Breeze
PUBLIC_SITE_PHONE=+7 (999) 123-45-67
PUBLIC_SITE_WHATSAPP=https://wa.me/79991234567
PUBLIC_SITE_TELEGRAM=https://t.me/azovbreeze
PUBLIC_SITE_ADDRESS=Азовское море, ул. Морская, 7
PUBLIC_SITE_COORDS=47.123,36.456
PUBLIC_CHECKIN_TIME=14:00
PUBLIC_CHECKOUT_TIME=11:00
PUBLIC_SEASON_LABEL=Май — сентябрь
PUBLIC_BASE_CURRENCY=RUB

# OAuth (optional)
AUTH_VK_ID=
AUTH_VK_SECRET=
AUTH_YANDEX_ID=
AUTH_YANDEX_SECRET=

# Payment (YooKassa)
YOOKASSA_SHOP_ID=123456
YOOKASSA_SECRET_KEY=test_xxxxxxxxxxxxxxxxxxxxxxxx
YOOKASSA_WEBHOOK_SECRET=replace_with_webhook_secret

# Email
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=587
SMTP_USER=booking@azov-breeze.ru
SMTP_PASSWORD=replace_with_password
SMTP_FROM=Azov Breeze <booking@azov-breeze.ru>

# Cloudflare Tunnel (docker)
CLOUDFLARE_TUNNEL_TOKEN=replace_with_cloudflare_token

# Initial admin user for seed
ADMIN_EMAIL=owner@azov-breeze.ru
ADMIN_PASSWORD=replace_with_strong_password
ADMIN_NAME=Владелец
```

---

# Минимум, без которого не стоит запускать

Обязательно заполни:
- `APP_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `DATABASE_URL`
- `CLOUDFLARE_TUNNEL_TOKEN`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

Для реальной оплаты:
- `YOOKASSA_SHOP_ID`
- `YOOKASSA_SECRET_KEY`

Для писем:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`

---

# Частые ошибки

## Сайт не открывается
Проверь `CLOUDFLARE_TUNNEL_TOKEN`, `APP_URL`, `NEXTAUTH_URL` и логи `cloudflared`.

## Не работает вход
Проверь `NEXTAUTH_URL`, `NEXTAUTH_SECRET` и callback URL у VK/Яндекс.

## Не проходит оплата
Проверь `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY` и домен в `APP_URL`.

## Не уходят письма
Проверь `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` и не нужен ли пароль приложения.
