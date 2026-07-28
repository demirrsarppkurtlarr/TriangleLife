import type { AgeGroup, EventCategory, EventChoice, EventEffect, GameEvent } from "@/types/game";
import { getAgeGroup } from "@/lib/constants";

/** Aktif hikâye bayrağı — yıllarca yan etki üretir */
export interface StoryFlag {
  id: string;
  label: string;
  kalanYil: number;
  /** Her yıl otomatik uygulanan etkiler */
  yillikEtki?: EventEffect[];
}

/** Belirli bir yılda patlayacak devam olayı */
export interface PendingFollowUp {
  id: string;
  baslik: string;
  aciklama: string;
  kategori: EventCategory;
  secenekler: EventChoice[];
  tetikYil: number;
  minYas: number;
  maxYas: number;
  oncelik: number;
  /** Bu bayraklar hâlâ aktifse tetiklenir (hepsi) */
  requireFlags?: string[];
  /** Bu bayraklardan biri varsa iptal */
  cancelIfFlags?: string[];
}

export interface StoryThread {
  id: string;
  baslik: string;
  ozet: string;
  baslangicYil: number;
  aktif: boolean;
}

export interface StoryState {
  flags: StoryFlag[];
  pending: PendingFollowUp[];
  threads: StoryThread[];
  lastConsequenceIds: string[];
}

export function createEmptyStoryState(): StoryState {
  return { flags: [], pending: [], threads: [], lastConsequenceIds: [] };
}

export interface ConsequenceSeed {
  id: string;
  flag?: Omit<StoryFlag, "kalanYil"> & { sureYil: number };
  followUps?: Array<Omit<PendingFollowUp, "id" | "tetikYil"> & { delayYil: number }>;
  thread?: { baslik: string; ozet: string };
  /** İlişki puanını topluca etkile (anne/baba/kardes) */
  aileIliskiDelta?: number;
  bildirim?: string;
}

type SeedMatcher = {
  /** Olay başlığı veya id parçası */
  match: RegExp;
  /** Seçenek metni parçası (opsiyonel) */
  choiceMatch?: RegExp;
  /** Yaş aralığı */
  minYas?: number;
  maxYas?: number;
  build: (ctx: { yas: number; yil: number; choiceMetin: string }) => ConsequenceSeed[];
};

const SEED_RULES: SeedMatcher[] = [
  // ——— Okul / eğitim ———
  {
    match: /Ödev|Sınav|Alfabe|Grup Ödev|Dershane|Tercih|Okul/i,
    choiceMatch: /ertele|oyun|telefona|bahane|kopya|as/i,
    build: ({ yil }) => [
      {
        id: "egitim-ihmal",
        flag: {
          id: "egitim_acigi",
          label: "Eğitim açığı",
          sureYil: 2,
          yillikEtki: [
            { tip: "ozellik", deger: -1, ozellik: "zeka" },
            { tip: "stres", deger: 2 },
          ],
        },
        followUps: [
          {
            delayYil: 1,
            baslik: "Karne Şoku",
            aciklama:
              "Notların düşmüş. Öğretmen veli görüşmesi istiyor. Geçen yılki ihmalkârlığın faturası bugün kesiliyor.",
            kategori: "egitim",
            minYas: 6,
            maxYas: 18,
            oncelik: 95,
            requireFlags: ["egitim_acigi"],
            secenekler: [
              {
                id: "s1",
                metin: "Özür dile, destek iste",
                sonuc: "Aile destek oldu ama baskı arttı. Telafi programı başladı.",
                etkiler: [
                  { tip: "stres", deger: 4 },
                  { tip: "ozellik", deger: 2, ozellik: "guven" },
                ],
              },
              {
                id: "s2",
                metin: "Savunmaya geç",
                sonuc: "İlişkiler gerildi. Açık büyüdü.",
                etkiler: [
                  { tip: "stres", deger: 8 },
                  { tip: "mutluluk", deger: -4 },
                ],
              },
              {
                id: "s3",
                metin: "Sıkı çalışmaya yemin et",
                sonuc: "Disiplin geldi. Yorgun ama umutlusun.",
                etkiler: [
                  { tip: "ozellik", deger: 3, ozellik: "zeka" },
                  { tip: "stres", deger: 5 },
                ],
              },
            ],
          },
        ],
        thread: {
          baslik: "Eğitim açığı",
          ozet: "İhmal edilen dersler sonraki yıllarda geri dönecek.",
        },
        aileIliskiDelta: -3,
        bildirim: "Bu seçimin yan etkisi: eğitim açığı bayrağı aktif (2 yıl).",
      },
    ],
  },
  {
    match: /Ödev|Sınav|Alfabe|Grup Ödev|Dershane|Tercih|Okul|Sınıf/i,
    choiceMatch: /çalış|odaklan|dürüst|parmak|program|akademik/i,
    build: () => [
      {
        id: "egitim-ivme",
        flag: {
          id: "egitim_ivmesi",
          label: "Eğitim ivmesi",
          sureYil: 2,
          yillikEtki: [
            { tip: "ozellik", deger: 1, ozellik: "zeka" },
            { tip: "stres", deger: 1 },
          ],
        },
        followUps: [
          {
            delayYil: 1,
            baslik: "Öğretmenin Takdiri",
            aciklama:
              "Geçen yılki çaban fark edilmiş. Sınıfta örnek gösteriliyorsun; yeni bir sorumluluk teklif ediliyor.",
            kategori: "egitim",
            minYas: 6,
            maxYas: 18,
            oncelik: 80,
            requireFlags: ["egitim_ivmesi"],
            secenekler: [
              {
                id: "s1",
                metin: "Sorumluluğu kabul et",
                sonuc: "Özgüvenin arttı. İş yükün de.",
                etkiler: [
                  { tip: "ozellik", deger: 4, ozellik: "guven" },
                  { tip: "stres", deger: 3 },
                ],
              },
              {
                id: "s2",
                metin: "Nazikçe geri çevir",
                sonuc: "Saygı korundu. Fırsat kaçtı.",
                etkiler: [{ tip: "ozellik", deger: 1, ozellik: "empati" }],
              },
            ],
          },
        ],
        thread: { baslik: "Eğitim ivmesi", ozet: "Çalışkanlığın sonraki fırsatları açıyor." },
        aileIliskiDelta: 2,
        bildirim: "Yan etki: eğitim ivmesi (2 yıl) — ileride fırsat doğabilir.",
      },
    ],
  },

  // ——— Sosyal / arkadaş ———
  {
    match: /Arkadaş|Koridor|Parti|Davet|Takım|Teneffüs|Paylaş/i,
    choiceMatch: /kavga|sert|karşılık|suçla|dalga|bitir|uzaklaş/i,
    build: () => [
      {
        id: "sosyal-gerginlik",
        flag: {
          id: "sosyal_gerginlik",
          label: "Sosyal gerginlik",
          sureYil: 2,
          yillikEtki: [
            { tip: "ozellik", deger: -1, ozellik: "sosyallik" },
            { tip: "stres", deger: 2 },
            { tip: "mutluluk", deger: -1 },
          ],
        },
        followUps: [
          {
            delayYil: 1,
            baslik: "Eski Bir Tartışmanın Yankısı",
            aciklama:
              "Geçen yıl sertleştiğin kişiyle yeniden karşılaştın. Ortam soğuk; çevrendekiler izliyor.",
            kategori: "sosyal",
            minYas: 6,
            maxYas: 40,
            oncelik: 88,
            requireFlags: ["sosyal_gerginlik"],
            secenekler: [
              {
                id: "s1",
                metin: "Özür dile / barış teklif et",
                sonuc: "Buzlar biraz çözüldü. İtibarın toparlandı.",
                etkiler: [
                  { tip: "ozellik", deger: 3, ozellik: "empati" },
                  { tip: "mutluluk", deger: 3 },
                  { tip: "stres", deger: -2 },
                ],
              },
              {
                id: "s2",
                metin: "Umursama, geç",
                sonuc: "Mesafe sürdü. Yalnızlık hissi arttı.",
                etkiler: [
                  { tip: "mutluluk", deger: -3 },
                  { tip: "stres", deger: 3 },
                ],
              },
              {
                id: "s3",
                metin: "Yeniden tartış",
                sonuc: "İşler daha da bozuldu. Dedikodu çıktı.",
                etkiler: [
                  { tip: "stres", deger: 7 },
                  { tip: "ozellik", deger: -2, ozellik: "sosyallik" },
                ],
              },
            ],
          },
        ],
        thread: { baslik: "Sosyal gerginlik", ozet: "Sert bir anın sonuçları sonraki yıllarda peşini bırakmıyor." },
        bildirim: "Yan etki: sosyal gerginlik bayrağı — gelecek yıl yüzleşme gelebilir.",
      },
    ],
  },
  {
    match: /Arkadaş|Koridor|Parti|Davet|Takım|Teneffüs|Paylaş/i,
    choiceMatch: /özür|paylaş|destek|gülümse|öner|selam|dürüst/i,
    build: () => [
      {
        id: "sosyal-bag",
        flag: {
          id: "guclu_arkadaslik",
          label: "Güçlü arkadaşlık bağı",
          sureYil: 3,
          yillikEtki: [
            { tip: "ozellik", deger: 1, ozellik: "sosyallik" },
            { tip: "mutluluk", deger: 1 },
          ],
        },
        followUps: [
          {
            delayYil: 2,
            baslik: "Arkadaşın Zor Günü",
            aciklama:
              "Yıllardır iyi geçindiğin arkadaşın kriz yaşıyor. Senden yardım veya sır tutmanı istiyor.",
            kategori: "sosyal",
            minYas: 8,
            maxYas: 50,
            oncelik: 85,
            requireFlags: ["guclu_arkadaslik"],
            secenekler: [
              {
                id: "s1",
                metin: "Zaman ayır, destek ol",
                sonuc: "Bağ güçlendi. Senin stresi biraz arttı.",
                etkiler: [
                  { tip: "ozellik", deger: 3, ozellik: "empati" },
                  { tip: "stres", deger: 3 },
                  { tip: "mutluluk", deger: 2 },
                ],
              },
              {
                id: "s2",
                metin: "Mesafeli kal",
                sonuc: "Hayal kırıklığı oluştu. Bağ zayıfladı.",
                etkiler: [
                  { tip: "ozellik", deger: -2, ozellik: "sosyallik" },
                  { tip: "mutluluk", deger: -2 },
                ],
              },
            ],
          },
        ],
        thread: { baslik: "Güçlü arkadaşlık", ozet: "İyi bir bağ ileride hem yük hem destek olabilir." },
        bildirim: "Yan etki: güçlü arkadaşlık bağı (3 yıl).",
      },
    ],
  },

  // ——— Aile ———
  {
    match: /Aile|Anne|Baba|Oda|Kapı|Veli|Büyük/i,
    choiceMatch: /çarp|sert|savuştur|yalan|suçla|iptal/i,
    build: () => [
      {
        id: "aile-guven-kirigi",
        flag: {
          id: "aile_guven_kirigi",
          label: "Ailede güven kırığı",
          sureYil: 3,
          yillikEtki: [
            { tip: "stres", deger: 2 },
            { tip: "mutluluk", deger: -1 },
          ],
        },
        followUps: [
          {
            delayYil: 1,
            baslik: "Aile Masasında Hesaplaşma",
            aciklama:
              "Geçen yılki tavrın unutulmamış. Akşam yemeğinde konu yeniden açılıyor; hava ağır.",
            kategori: "aile",
            minYas: 5,
            maxYas: 60,
            oncelik: 92,
            requireFlags: ["aile_guven_kirigi"],
            secenekler: [
              {
                id: "s1",
                metin: "Samimi özür dile",
                sonuc: "Buzlar çözülmeye başladı. Güven yavaş onarılıyor.",
                etkiler: [
                  { tip: "ozellik", deger: 3, ozellik: "empati" },
                  { tip: "stres", deger: -2 },
                  { tip: "mutluluk", deger: 2 },
                ],
              },
              {
                id: "s2",
                metin: "Tartışmayı büyüt",
                sonuc: "Yara derinleşti. Evde soğukluk arttı.",
                etkiler: [
                  { tip: "stres", deger: 8 },
                  { tip: "mutluluk", deger: -5 },
                ],
              },
              {
                id: "s3",
                metin: "Sessizce dinle",
                sonuc: "Fırtına geçti ama güvensizlik sürüyor.",
                etkiler: [
                  { tip: "stres", deger: 3 },
                  { tip: "ozellik", deger: 1, ozellik: "sabir" },
                ],
              },
            ],
          },
        ],
        aileIliskiDelta: -8,
        thread: { baslik: "Aile güveni", ozet: "Kırılan güven sonraki sohbetlerde geri geliyor." },
        bildirim: "Yan etki: ailede güven kırığı — gelecek yıl yüzleşme olası.",
      },
    ],
  },
  {
    match: /Aile|Anne|Baba|Oda|Kapı|Veli|Büyük/i,
    choiceMatch: /sınır koy|açık konuş|dürüst|dinle|ağırla|plan/i,
    build: () => [
      {
        id: "aile-yakinlik",
        flag: {
          id: "aile_yakinligi",
          label: "Aile yakınlığı",
          sureYil: 2,
          yillikEtki: [
            { tip: "mutluluk", deger: 1 },
            { tip: "stres", deger: -1 },
          ],
        },
        aileIliskiDelta: 5,
        followUps: [
          {
            delayYil: 2,
            baslik: "Aile Destek Teklifi",
            aciklama:
              "Geçmişteki sağlıklı iletişimin sayesinde ailen zor bir dönemde yanındasın diyor. Somut bir destek (para/zaman) masada.",
            kategori: "aile",
            minYas: 12,
            maxYas: 70,
            oncelik: 75,
            requireFlags: ["aile_yakinligi"],
            secenekler: [
              {
                id: "s1",
                metin: "Teşekkür edip kabul et",
                sonuc: "Rahatladın. Bağ güçlendi.",
                etkiler: [
                  { tip: "para", deger: 3000 },
                  { tip: "mutluluk", deger: 4 },
                  { tip: "stres", deger: -3 },
                ],
              },
              {
                id: "s2",
                metin: "Nazikçe reddet, kendi başına çöz",
                sonuc: "Gururun korundu. Biraz daha zorlanacaksın.",
                etkiler: [
                  { tip: "ozellik", deger: 3, ozellik: "guven" },
                  { tip: "stres", deger: 2 },
                ],
              },
            ],
          },
        ],
        thread: { baslik: "Aile yakınlığı", ozet: "İyi iletişim ileride destek kapısı açabilir." },
        bildirim: "Yan etki: aile yakınlığı güçlendi.",
      },
    ],
  },

  // ——— Sağlık ———
  {
    match: /Sağlık|Ateş|Check-up|İlaç|Ağrı|Nezle|Kolesterol|Tüken/i,
    choiceMatch: /ertele|geçiştir|kahve|görmezden|düzensiz/i,
    build: () => [
      {
        id: "saglik-ihmal",
        flag: {
          id: "saglik_ihmali",
          label: "Sağlık ihmali",
          sureYil: 3,
          yillikEtki: [
            { tip: "saglik", deger: -3 },
            { tip: "stres", deger: 1 },
          ],
        },
        followUps: [
          {
            delayYil: 1,
            baslik: "Belirtiler Kötüleşti",
            aciklama:
              "Geçen yıl ertelediğin sağlık konusu geri döndü. Bu kez daha net ve daha pahalı.",
            kategori: "saglik",
            minYas: 0,
            maxYas: 120,
            oncelik: 96,
            requireFlags: ["saglik_ihmali"],
            secenekler: [
              {
                id: "s1",
                metin: "Hemen tedavi ol",
                sonuc: "Maliyet yüksek ama kontrol altına alındı.",
                etkiler: [
                  { tip: "saglik", deger: 10 },
                  { tip: "para", deger: -4000 },
                  { tip: "stres", deger: -2 },
                ],
              },
              {
                id: "s2",
                metin: "Yine idare et",
                sonuc: "Risk büyüyor. Vücudun uyarıyor.",
                etkiler: [
                  { tip: "saglik", deger: -8 },
                  { tip: "stres", deger: 6 },
                ],
              },
            ],
          },
          {
            delayYil: 2,
            baslik: "Kronikleşme Riski",
            aciklama:
              "İki yıldır süren ihmal doktorun 'kronikleşme' dediği noktaya geldi. Yaşam tarzı değişikliği şart.",
            kategori: "saglik",
            minYas: 18,
            maxYas: 120,
            oncelik: 90,
            requireFlags: ["saglik_ihmali"],
            secenekler: [
              {
                id: "s1",
                metin: "Disiplinli yaşama dön",
                sonuc: "Zor ama doğru yol. Yavaş toparlanma başladı.",
                etkiler: [
                  { tip: "saglik", deger: 8 },
                  { tip: "stres", deger: 3 },
                  { tip: "ozellik", deger: 2, ozellik: "sabir" },
                ],
              },
              {
                id: "s2",
                metin: "Kaderine bırak",
                sonuc: "Durum kırılganlaştı.",
                etkiler: [
                  { tip: "saglik", deger: -10 },
                  { tip: "mutluluk", deger: -4 },
                ],
              },
            ],
          },
        ],
        thread: { baslik: "Sağlık ihmali", ozet: "Ertelenen sorunlar büyüyerek geri geliyor." },
        bildirim: "Yan etki: sağlık ihmali — gelecek yıllarda komplikasyon çıkabilir.",
      },
    ],
  },
  {
    match: /Sağlık|Ateş|Check-up|İlaç|Ağrı|Nezle|Kolesterol|Tüken|Doktora/i,
    choiceMatch: /doktor|tedavi|diyet|düzen|alarm|rutin|spor/i,
    build: () => [
      {
        id: "saglik-duzeni",
        flag: {
          id: "saglik_duzeni",
          label: "Sağlık düzeni",
          sureYil: 2,
          yillikEtki: [{ tip: "saglik", deger: 2 }],
        },
        thread: { baslik: "Sağlık düzeni", ozet: "İyi alışkanlıklar bir süre seni koruyor." },
        bildirim: "Yan etki: sağlık düzeni aktif (2 yıl).",
      },
    ],
  },

  // ——— Kariyer / finans ———
  {
    match: /İş|Staj|Mesai|Terfi|Küçülme|Mülakat|Kariyer|Kredi|Ev Alma|Kira/i,
    choiceMatch: /abart|ertele|görmezden|risk|yalan/i,
    build: () => [
      {
        id: "kariyer-risk",
        flag: {
          id: "kariyer_riski",
          label: "Kariyer riski",
          sureYil: 2,
          yillikEtki: [
            { tip: "stres", deger: 3 },
            { tip: "ozellik", deger: -1, ozellik: "guven" },
          ],
        },
        followUps: [
          {
            delayYil: 1,
            baslik: "Geçmiş Kararın Faturası",
            aciklama:
              "Geçen yılki riskli veya ertelediğin karar bugün masaya geldi. Yönetici / alacaklı / ev sahibi net cevap istiyor.",
            kategori: "kariyer",
            minYas: 16,
            maxYas: 65,
            oncelik: 93,
            requireFlags: ["kariyer_riski"],
            secenekler: [
              {
                id: "s1",
                metin: "Zararı kabullen, düzelt",
                sonuc: "Pahalıya patladı ama temizlendin.",
                etkiler: [
                  { tip: "para", deger: -5000 },
                  { tip: "stres", deger: -2 },
                  { tip: "ozellik", deger: 2, ozellik: "guven" },
                ],
              },
              {
                id: "s2",
                metin: "Zaman kazanmaya çalış",
                sonuc: "Kısa nefes; baskı artarak devam ediyor.",
                etkiler: [
                  { tip: "stres", deger: 6 },
                  { tip: "mutluluk", deger: -3 },
                ],
              },
            ],
          },
        ],
        thread: { baslik: "Kariyer / para riski", ozet: "Ertelemek bazen maliyeti büyütür." },
        bildirim: "Yan etki: kariyer riski bayrağı — gelecek yıl hesap sorulabilir.",
      },
    ],
  },
  {
    match: /İş|Staj|Mesai|Terfi|Mülakat|Kariyer/i,
    choiceMatch: /dürüst|hazırlıklı|pazarlık|öğren|kabul|netleştir/i,
    build: () => [
      {
        id: "kariyer-itibar",
        flag: {
          id: "kariyer_itibari",
          label: "Kariyer itibarı",
          sureYil: 3,
          yillikEtki: [
            { tip: "ozellik", deger: 1, ozellik: "guven" },
            { tip: "para", deger: 500 },
          ],
        },
        followUps: [
          {
            delayYil: 2,
            baslik: "Referans / Fırsat Kapısı",
            aciklama:
              "Eski bir yöneticin veya müşterin seni hatırlıyor. Daha iyi bir pozisyon veya proje teklifi var.",
            kategori: "kariyer",
            minYas: 18,
            maxYas: 60,
            oncelik: 82,
            requireFlags: ["kariyer_itibari"],
            secenekler: [
              {
                id: "s1",
                metin: "Teklifi değerlendir, kabul et",
                sonuc: "Gelirin ve prestijin arttı. Tempo yükseldi.",
                etkiler: [
                  { tip: "para", deger: 12000 },
                  { tip: "ozellik", deger: 3, ozellik: "guven" },
                  { tip: "stres", deger: 4 },
                ],
              },
              {
                id: "s2",
                metin: "Mevcut yerinde kal",
                sonuc: "Güvenli ama fırsat kaçtı.",
                etkiler: [{ tip: "stres", deger: -1 }],
              },
            ],
          },
        ],
        thread: { baslik: "Kariyer itibarı", ozet: "İyi iş çıkarmak yıllar sonra kapı açabilir." },
        bildirim: "Yan etki: kariyer itibarı — ileride fırsat doğabilir.",
      },
    ],
  },

  // ——— Romantik ———
  {
    match: /Romantik|Sevgili|Flört|İlişki|Ciddiyet|Beğeni|Aşk/i,
    choiceMatch: /uzaklaş|ertele|bitir|yalan|belirsiz/i,
    build: () => [
      {
        id: "romantik-yarim",
        flag: {
          id: "romantik_yarim",
          label: "Yarım kalmış ilişki",
          sureYil: 2,
          yillikEtki: [
            { tip: "mutluluk", deger: -1 },
            { tip: "stres", deger: 1 },
          ],
        },
        followUps: [
          {
            delayYil: 1,
            baslik: "Eski Partnerden Mesaj",
            aciklama:
              "Geçen yıl netleştiremediğin ilişki geri döndü. Kısa bir mesaj: 'Konuşabilir miyiz?'",
            kategori: "romantik",
            minYas: 15,
            maxYas: 50,
            oncelik: 84,
            requireFlags: ["romantik_yarim"],
            secenekler: [
              {
                id: "s1",
                metin: "Konuş, netleş",
                sonuc: "Ya kapandı ya yeniden başladı. İçin rahatladı.",
                etkiler: [
                  { tip: "mutluluk", deger: 3 },
                  { tip: "stres", deger: -2 },
                  { tip: "ozellik", deger: 2, ozellik: "sevgi" },
                ],
              },
              {
                id: "s2",
                metin: "Cevap verme",
                sonuc: "Sessizlik de bir cevap. İçinde soru işareti kaldı.",
                etkiler: [
                  { tip: "stres", deger: 3 },
                  { tip: "mutluluk", deger: -2 },
                ],
              },
            ],
          },
        ],
        thread: { baslik: "Yarım ilişki", ozet: "Kapanmayan konular geri gelebilir." },
        bildirim: "Yan etki: yarım kalmış ilişki — gelecek yıl mesaj gelebilir.",
      },
    ],
  },
  {
    match: /Romantik|Sevgili|Flört|İlişki|Ciddiyet|Beğeni/i,
    choiceMatch: /ciddi|açık|net|zaman çizelgesi|selam/i,
    build: () => [
      {
        id: "romantik-guven",
        flag: {
          id: "romantik_guven",
          label: "Romantik güven",
          sureYil: 2,
          yillikEtki: [
            { tip: "mutluluk", deger: 2 },
            { tip: "ozellik", deger: 1, ozellik: "sevgi" },
          ],
        },
        thread: { baslik: "Romantik güven", ozet: "Açık iletişim ilişkiyi besliyor." },
        bildirim: "Yan etki: romantik güven duygusu güçlendi.",
      },
    ],
  },

  // ——— Genel stresli kaçış ———
  {
    match: /.*/,
    choiceMatch: /ertele|görmezden|kaç|sus|yok say/i,
    minYas: 10,
    build: ({ yas }) =>
      yas >= 10
        ? [
            {
              id: "erteleme-aliskanligi",
              flag: {
                id: "erteleme_aliskanligi",
                label: "Erteleme alışkanlığı",
                sureYil: 1,
                yillikEtki: [
                  { tip: "stres", deger: 2 },
                  { tip: "ozellik", deger: -1, ozellik: "sabir" },
                ],
              },
              bildirim: "Yan etki: erteleme alışkanlığı bir yıl seni zorlayabilir.",
            },
          ]
        : [],
  },
];

/** Olay + seçimden yan etki tohumları üret */
export function buildConsequencesFromChoice(
  event: GameEvent,
  choice: EventChoice,
  yas: number,
  yil: number
): ConsequenceSeed[] {
  const seeds: ConsequenceSeed[] = [];
  const haystack = `${event.id} ${event.baslik} ${event.aciklama}`;
  const choiceText = choice.metin;

  for (const rule of SEED_RULES) {
    if (rule.minYas !== undefined && yas < rule.minYas) continue;
    if (rule.maxYas !== undefined && yas > rule.maxYas) continue;
    if (!rule.match.test(haystack) && !rule.match.test(event.baslik)) continue;
    if (rule.choiceMatch && !rule.choiceMatch.test(choiceText)) continue;
    seeds.push(...rule.build({ yas, yil, choiceMetin: choiceText }));
  }

  // Aynı id'li seed'leri tekilleştir
  const seen = new Set<string>();
  return seeds.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}

export function applyConsequenceSeeds(
  state: StoryState,
  seeds: ConsequenceSeed[],
  yil: number
): { state: StoryState; bildirimler: string[] } {
  let flags = [...state.flags];
  let pending = [...state.pending];
  let threads = [...state.threads];
  const bildirimler: string[] = [];
  const lastIds = [...state.lastConsequenceIds];

  for (const seed of seeds) {
    // Aynı seçim aynı anda iki kez tohum atmasın; yıllar sonra tekrar edebilir
    if (lastIds[0] === seed.id) continue;
    lastIds.unshift(seed.id);

    if (seed.flag) {
      flags = flags.filter((f) => f.id !== seed.flag!.id);
      flags.push({
        id: seed.flag.id,
        label: seed.flag.label,
        kalanYil: seed.flag.sureYil,
        yillikEtki: seed.flag.yillikEtki,
      });
    }

    if (seed.followUps) {
      for (const fu of seed.followUps) {
        const id = `${seed.id}-fu-${fu.delayYil}-${fu.baslik.slice(0, 12)}`;
        pending = pending.filter((p) => p.baslik !== fu.baslik);
        pending.push({
          id,
          baslik: fu.baslik,
          aciklama: fu.aciklama,
          kategori: fu.kategori,
          secenekler: fu.secenekler,
          tetikYil: yil + fu.delayYil,
          minYas: fu.minYas,
          maxYas: fu.maxYas,
          oncelik: fu.oncelik,
          requireFlags: fu.requireFlags,
          cancelIfFlags: fu.cancelIfFlags,
        });
      }
    }

    if (seed.thread) {
      threads = [
        {
          id: `thread-${seed.id}-${yil}`,
          baslik: seed.thread.baslik,
          ozet: seed.thread.ozet,
          baslangicYil: yil,
          aktif: true,
        },
        ...threads.filter((t) => t.baslik !== seed.thread!.baslik),
      ].slice(0, 12);
    }

    if (seed.bildirim) bildirimler.push(seed.bildirim);
  }

  return {
    state: {
      flags,
      pending,
      threads,
      lastConsequenceIds: lastIds.slice(0, 20),
    },
    bildirimler,
  };
}

/** Yıl ilerleyince bayrak süreleri ve yıllık etkiler */
export function tickStoryYear(
  state: StoryState,
  yil: number
): {
  state: StoryState;
  yillikEtkiler: EventEffect[];
  mesajlar: string[];
} {
  const mesajlar: string[] = [];
  const yillikEtkiler: EventEffect[] = [];

  const flags = state.flags
    .map((f) => {
      if (f.yillikEtki) yillikEtkiler.push(...f.yillikEtki);
      return { ...f, kalanYil: f.kalanYil - 1 };
    })
    .filter((f) => {
      if (f.kalanYil <= 0) {
        mesajlar.push(`Hikâye etkisi sona erdi: ${f.label}`);
        return false;
      }
      return true;
    });

  const activeFlagIds = new Set(flags.map((f) => f.id));

  const pending = state.pending.filter((p) => {
    if (p.cancelIfFlags?.some((id) => activeFlagIds.has(id))) return false;
    if (p.tetikYil < yil - 1) return false; // çok kaçmış
    return true;
  });

  const threads = state.threads.map((t) => {
    const relatedFlag = flags.some((f) => t.baslik.toLowerCase().includes(f.label.split(" ")[0].toLowerCase()));
    return { ...t, aktif: relatedFlag || t.aktif };
  });

  return {
    state: { ...state, flags, pending, threads },
    yillikEtkiler,
    mesajlar,
  };
}

/** Bu yıl tetiklenecek devam olayını GameEvent olarak al */
export function popDueFollowUp(
  state: StoryState,
  yil: number,
  yas: number
): { event: GameEvent | null; state: StoryState } {
  const activeFlagIds = new Set(state.flags.map((f) => f.id));
  const due = state.pending
    .filter((p) => p.tetikYil <= yil)
    .filter((p) => yas >= p.minYas && yas <= p.maxYas)
    .filter((p) => !p.requireFlags || p.requireFlags.every((id) => activeFlagIds.has(id)))
    .filter((p) => !p.cancelIfFlags || !p.cancelIfFlags.some((id) => activeFlagIds.has(id)))
    .sort((a, b) => b.oncelik - a.oncelik);

  if (due.length === 0) return { event: null, state };

  const picked = due[0];
  const ageGroup = getAgeGroup(yas);
  const event: GameEvent = {
    id: `chain-${picked.id}`,
    baslik: picked.baslik,
    aciklama: picked.aciklama + " (Geçmiş bir seçiminin devamı)",
    kategori: picked.kategori,
    yasGrubu: [ageGroup as AgeGroup],
    minYas: picked.minYas,
    maxYas: picked.maxYas,
    oncelik: picked.oncelik,
    secenekler: picked.secenekler,
  };

  return {
    event,
    state: {
      ...state,
      pending: state.pending.filter((p) => p.id !== picked.id),
    },
  };
}

/** Bayraklara göre rastgele olay önceliğini çarp */
export function weightBoostForFlags(event: GameEvent, flags: StoryFlag[]): number {
  let mult = 1;
  const text = `${event.baslik} ${event.aciklama} ${event.kategori}`.toLowerCase();
  for (const f of flags) {
    if (f.id.includes("egitim") && (text.includes("okul") || text.includes("sınav") || event.kategori === "egitim")) {
      mult *= 1.4;
    }
    if (f.id.includes("saglik") && event.kategori === "saglik") mult *= 1.5;
    if (f.id.includes("sosyal") && event.kategori === "sosyal") mult *= 1.35;
    if (f.id.includes("aile") && event.kategori === "aile") mult *= 1.4;
    if (f.id.includes("kariyer") && (event.kategori === "kariyer" || event.kategori === "finans")) mult *= 1.35;
    if (f.id.includes("romantik") && event.kategori === "romantik") mult *= 1.45;
    if (f.id.includes("erteleme") && /ertele|kaç|bekle/i.test(event.baslik)) mult *= 1.2;
  }
  return mult;
}

export function storyFlagsSummary(flags: StoryFlag[]): string {
  if (flags.length === 0) return "";
  return flags.map((f) => `${f.label} (${f.kalanYil}y)`).join(" · ");
}
