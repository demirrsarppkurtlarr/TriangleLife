# TriangleLife

Doğumdan ölüme kendi hayatını yaşa. Her seçim geleceğini şekillendirir.

TriangleLife, derin aile ilişkileri, kariyer, eğitim, finans ve sosyal yaşam sistemlerine sahip modern bir yaşam simülasyonu oyunudur.

## Özellikler

- **Yaşam Simülasyonu** — 0 yaşından başlayarak hayatını yaşa
- **Aile Sistemi** — Rastgele oluşturulan aile, NPC'ler kendi hayatlarını yaşar
- **İlişkiler** — Sohbet, hediye, tatil, kavga ve daha fazlası
- **Eğitim** — Kreş'ten doktoraya tam eğitim sistemi
- **Kariyer** — Yüzlerce meslek ve şirket kurma
- **Finans** — Hisse, ETF, altın, kripto yatırımı, kredi ve vergi
- **Sağlık** — Sağlık, mutluluk, stres, uyku, beslenme takibi
- **Sosyal Yaşam** — Arkadaşlar, kulüpler, konserler, festivaller
- **Rastgele Olaylar** — Binlerce farklı yaşam olayı
- **NPC Yapay Zekası** — Hatırlama, affetme, kin tutma
- **Responsive Tasarım** — Mobil ve masaüstü için optimize
- **Açık/Koyu Tema** — Apple tasarım dilinden ilham alan arayüz

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 15, React 19, TypeScript |
| Stil | Tailwind CSS, Framer Motion |
| State | Zustand |
| Veritabanı | Supabase PostgreSQL |
| Deploy | Render |

## Kurulum

### Gereksinimler

- Node.js 20+
- npm 10+
- Supabase hesabı

### Adımlar

1. **Depoyu klonlayın**

```bash
git clone https://github.com/demirrsarppkurtlarr/TriangleLife.git
cd TriangleLife
```

2. **Bağımlılıkları yükleyin**

```bash
npm install
```

3. **Ortam değişkenlerini ayarlayın**

```bash
cp .env.example .env.local
```

`.env.local` dosyasını Supabase proje bilgilerinizle doldurun.

4. **Veritabanını oluşturun**

Supabase Dashboard → SQL Editor'a gidin ve `supabase/schema.sql` dosyasının içeriğini yapıştırıp çalıştırın.

5. **Geliştirme sunucusunu başlatın**

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

# Supabase Kurulumu

1. [Supabase](https://supabase.com) üzerinde yeni proje oluşturun
2. **SQL Editor**'a gidin
3. `supabase/schema.sql` dosyasının **tamamını** kopyalayıp yapıştırın ve çalıştırın
4. **Settings → API** bölümünden URL ve anon key'i alın
5. `.env.local` dosyasına ekleyin

### Auth Ayarları

Supabase Dashboard → Authentication → Providers:
- Email provider'ı etkinleştirin
- Site URL: `http://localhost:3000` (geliştirme) veya Render URL'niz (production)
- Redirect URLs: `http://localhost:3000/**` ve production URL'niz

## Render Deploy

`render.yaml` Blueprint dosyası hazırdır. İki yöntem:

### Yöntem A — Blueprint (önerilen)

1. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
2. GitHub deposunu bağlayın (`demirrsarppkurtlarr/TriangleLife`)
3. Blueprint `render.yaml` dosyasını okuyup servisi oluşturur
4. Şu secret değişkenleri manuel doldurun:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy edin

### Yöntem B — Manuel Web Service

| Ayar | Değer |
|------|-------|
| Runtime | Node |
| Region | Frankfurt |
| Branch | `main` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |
| Node Version | 20.18.0 (`NODE_VERSION`) |

### Ortam Değişkenleri

| Değişken | Açıklama | Kaynak |
|----------|----------|--------|
| `NODE_ENV` | `production` | Otomatik |
| `NODE_VERSION` | Node.js sürümü | Otomatik |
| `PORT` | Dinleme portu | Otomatik |
| `NEXT_TELEMETRY_DISABLED` | Telemetri kapalı | Otomatik |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL | Manuel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Manuel |

Deploy sonrası Supabase Auth → Site URL ve Redirect URLs'e Render domain'inizi ekleyin.

## Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── api/health/         # Sağlık kontrol endpoint
│   ├── globals.css         # Global stiller ve tema
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Ana sayfa
├── components/
│   ├── game/               # Oyun bileşenleri
│   ├── layout/             # Layout bileşenleri
│   ├── providers/          # Context sağlayıcılar
│   └── ui/                 # UI bileşenleri
├── lib/
│   ├── constants.ts        # Sabitler
│   ├── events/             # Olay havuzu
│   ├── generators.ts       # Karakter/aile oluşturucu
│   ├── supabase/           # Supabase istemcileri
│   └── utils.ts            # Yardımcı fonksiyonlar
├── store/
│   └── game-store.ts       # Zustand oyun state
└── types/
    └── game.ts             # TypeScript tipleri
supabase/
    └── schema.sql          # Tam veritabanı şeması
```

## Yaş Grupları

| Yaş | Grup |
|-----|------|
| 0-2 | Bebek |
| 3-5 | Çocuk |
| 6-12 | İlkokul |
| 13-17 | Ergen |
| 18-25 | Genç |
| 26-40 | Yetişkin |
| 41-60 | Orta Yaş |
| 61-80 | Yaşlı |
| 80+ | İleri Yaş |

## Lisans

Bu proje özel kullanım için geliştirilmiştir.
