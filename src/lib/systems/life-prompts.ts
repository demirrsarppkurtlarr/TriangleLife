import type { Character, Life, Property, Relationship, EventEffect } from "@/types/game";

export interface LifePromptChoice {
  id: string;
  metin: string;
  sonuc: string;
  etkiler?: EventEffect[];
  /** Özel eylem kodu — store'da işlenir */
  eylem?:
    | "ev_al_teklif"
    | "ise_basla"
    | "okula_git"
    | "evden_ayril"
    | "ehliyet"
    | "emekli_ol"
    | "yoksay";
}

export interface LifePrompt {
  id: string;
  baslik: string;
  aciklama: string;
  tip: "zorunlu" | "onemli" | "firsati";
  secenekler: LifePromptChoice[];
}

export interface LifePromptContext {
  player: Character;
  life: Life;
  properties: Property[];
  relationships: Relationship[];
  family: Character[];
  aileDurumu?: string;
  triggeredIds: string[];
}

type PromptDef = {
  id: string;
  tip: LifePrompt["tip"];
  minYas: number;
  maxYas: number;
  /** Aynı hayat içinde bir kez */
  once?: boolean;
  weight: number;
  kosul: (ctx: LifePromptContext) => boolean;
  build: (ctx: LifePromptContext) => LifePrompt;
};

function hasHome(properties: Property[]) {
  return properties.some((p) => p.tip === "ev" && p.satinAlindi);
}

function livingWithParents(player: Character, family: Character[]) {
  const parentsAlive = family.some(
    (f) =>
      f.durum === "yasiyor" &&
      (f.aileRolu === "anne" || f.aileRolu === "baba" || f.id === player.anneId || f.id === player.babaId)
  );
  return parentsAlive && player.yas >= 18 && !hasHome([]);
}

const PROMPT_DEFS: PromptDef[] = [
  {
    id: "okul-baslangic",
    tip: "zorunlu",
    minYas: 6,
    maxYas: 6,
    once: true,
    weight: 100,
    kosul: () => true,
    build: () => ({
      id: "okul-baslangic",
      tip: "zorunlu",
      baslik: "İlkokula Başlama Zamanı",
      aciklama:
        "6 yaşına girdin. Türkiye'de zorunlu eğitim başlıyor. Servis veya yürüme yolu konuşuluyor; çantan hazır.",
      secenekler: [
        {
          id: "s1",
          metin: "Heyecanla başla",
          sonuc: "Okul hayatın resmen başladı.",
          etkiler: [
            { tip: "mutluluk", deger: 5 },
            { tip: "ozellik", deger: 3, ozellik: "zeka" },
          ],
          eylem: "okula_git",
        },
        {
          id: "s2",
          metin: "Korkarak ama git",
          sonuc: "İlk günler zor oldu ama alışıyorsun.",
          etkiler: [
            { tip: "stres", deger: 4 },
            { tip: "ozellik", deger: 2, ozellik: "guven" },
          ],
          eylem: "okula_git",
        },
      ],
    }),
  },
  {
    id: "ortaokul-gecis",
    tip: "onemli",
    minYas: 10,
    maxYas: 11,
    once: true,
    weight: 80,
    kosul: () => true,
    build: () => ({
      id: "ortaokul-gecis",
      tip: "onemli",
      baslik: "Ortaokula Geçiş",
      aciklama: "Dersler ağırlaşıyor. Yeni arkadaşlıklar ve sınavlar seni bekliyor.",
      secenekler: [
        {
          id: "s1",
          metin: "Derslere odaklan",
          sonuc: "Tempo arttı. Notların toparlandı.",
          etkiler: [
            { tip: "ozellik", deger: 4, ozellik: "zeka" },
            { tip: "stres", deger: 3 },
          ],
        },
        {
          id: "s2",
          metin: "Sosyal hayata ağırlık ver",
          sonuc: "Arkadaşların çoğaldı; dersler idare.",
          etkiler: [
            { tip: "ozellik", deger: 4, ozellik: "sosyallik" },
            { tip: "ozellik", deger: 1, ozellik: "zeka" },
          ],
        },
      ],
    }),
  },
  {
    id: "lise-tercih",
    tip: "zorunlu",
    minYas: 14,
    maxYas: 14,
    once: true,
    weight: 95,
    kosul: () => true,
    build: () => ({
      id: "lise-tercih",
      tip: "zorunlu",
      baslik: "Lise Tercihi",
      aciklama: "Anadolu, fen, meslek veya imam hatip… Ailenin ve puanının dengesi konuşuluyor.",
      secenekler: [
        {
          id: "s1",
          metin: "Akademik lise (Anadolu/Fen)",
          sonuc: "Yoğun müfredat. Üniversite yolu açıldı.",
          etkiler: [
            { tip: "ozellik", deger: 5, ozellik: "zeka" },
            { tip: "stres", deger: 5 },
          ],
        },
        {
          id: "s2",
          metin: "Meslek lisesi",
          sonuc: "Pratik beceri kazandın. Erken iş fırsatı var.",
          etkiler: [
            { tip: "ozellik", deger: 3, ozellik: "guven" },
            { tip: "para", deger: 200 },
          ],
        },
        {
          id: "s3",
          metin: "Ailenin önerdiği okula git",
          sonuc: "Barış korundu. Kendi tercihin ertelendi.",
          etkiler: [
            { tip: "ozellik", deger: 2, ozellik: "empati" },
            { tip: "stres", deger: 2 },
          ],
        },
      ],
    }),
  },
  {
    id: "ehliyet",
    tip: "firsati",
    minYas: 18,
    maxYas: 22,
    once: true,
    weight: 70,
    kosul: () => true,
    build: () => ({
      id: "ehliyet",
      tip: "firsati",
      baslik: "Ehliyet Alma Zamanı",
      aciklama: "18 oldun. Direksiyon kursu ve sınav masraftır ama bağımsızlık getirir.",
      secenekler: [
        {
          id: "s1",
          metin: "Kursaya yazıl (ücretli)",
          sonuc: "Ehliyetini aldın. Özgürlüğün arttı.",
          etkiler: [
            { tip: "para", deger: -12000 },
            { tip: "ozellik", deger: 4, ozellik: "guven" },
            { tip: "mutluluk", deger: 5 },
          ],
          eylem: "ehliyet",
        },
        {
          id: "s2",
          metin: "Birkaç yıl ertele",
          sonuc: "Toplu taşıma ile devam. Zaman kazandın.",
          etkiler: [{ tip: "stres", deger: 1 }],
          eylem: "yoksay",
        },
      ],
    }),
  },
  {
    id: "evden-ayril",
    tip: "onemli",
    minYas: 18,
    maxYas: 28,
    once: true,
    weight: 85,
    kosul: (ctx) => {
      const parents = ctx.family.filter(
        (f) => f.durum === "yasiyor" && (f.aileRolu === "anne" || f.aileRolu === "baba")
      );
      return parents.length > 0 && !hasHome(ctx.properties) && ctx.player.yas >= 18;
    },
    build: (ctx) => ({
      id: "evden-ayril",
      tip: "onemli",
      baslik: "Evden Ayrılma Kararı",
      aciklama: `${ctx.player.yas} yaşındasın. Ailenle yaşıyorsun. Kira, yurt veya kendi evin… Bağımsızlık pahalı ama özgür.`,
      secenekler: [
        {
          id: "s1",
          metin: "Kiraya çık / oda tut",
          sonuc: "Kendi düzenin başladı. Bütçe daraldı.",
          etkiler: [
            { tip: "para", deger: -8000 },
            { tip: "mutluluk", deger: 4 },
            { tip: "stres", deger: 5 },
          ],
          eylem: "evden_ayril",
        },
        {
          id: "s2",
          metin: "Bir süre daha aile yanında kal",
          sonuc: "Biriktirmeye devam. Özgürlük ertelendi.",
          etkiler: [
            { tip: "para", deger: 1500 },
            { tip: "stres", deger: 3 },
          ],
          eylem: "yoksay",
        },
        {
          id: "s3",
          metin: "Ev bakmaya başla",
          sonuc: "Peşinat ve kredi araştırması başladı.",
          etkiler: [
            { tip: "stres", deger: 4 },
            { tip: "ozellik", deger: 2, ozellik: "guven" },
          ],
          eylem: "ev_al_teklif",
        },
      ],
    }),
  },
  {
    id: "ev-al-zamani",
    tip: "onemli",
    minYas: 24,
    maxYas: 45,
    once: false,
    weight: 90,
    kosul: (ctx) => {
      if (hasHome(ctx.properties)) return false;
      if (ctx.player.yas < 24) return false;
      // Yılda bir kez şans / ihtiyaç
      if (ctx.triggeredIds.includes(`ev-al-zamani-${ctx.player.yas}`)) return false;
      // Para veya yaş baskısı
      const needByAge = ctx.player.yas >= 28 && ctx.player.yas % 3 === 0;
      const canAfford = ctx.life.para + ctx.life.bankaBakiyesi > 200000;
      return needByAge || (canAfford && ctx.player.yas >= 26 && Math.random() < 0.45);
    },
    build: (ctx) => {
      const cityNote =
        ctx.player.sehir === "İstanbul"
          ? "İstanbul'da fiyatlar çok yüksek; kredi kaçınılmaz görünüyor."
          : `${ctx.player.sehir}'de daha ulaşılabilir seçenekler var ama yine de büyük karar.`;
      return {
        id: `ev-al-zamani-${ctx.player.yas}`,
        tip: "onemli",
        baslik: "Ev Alma Zamanı Geldi mi?",
        aciklama: `${ctx.player.yas} yaşındasın ve hâlâ kendi evin yok. Kira ömür boyu sürmesin diye düşünüyorsun. ${cityNote}`,
        secenekler: [
          {
            id: "s1",
            metin: "Evet — ev bakmaya başla (Mülk sekmesi)",
            sonuc: "Karar netleşti. Uygun bir ev arıyorsun.",
            etkiler: [
              { tip: "stres", deger: 3 },
              { tip: "ozellik", deger: 3, ozellik: "guven" },
            ],
            eylem: "ev_al_teklif",
          },
          {
            id: "s2",
            metin: "Biraz daha biriktir",
            sonuc: "Peşinat hedefini yükselttin.",
            etkiler: [
              { tip: "para", deger: 3000 },
              { tip: "stres", deger: 2 },
            ],
            eylem: "yoksay",
          },
          {
            id: "s3",
            metin: "Kirada kalmaya devam",
            sonuc: "Esneklik korundu; uzun vadede maliyet artabilir.",
            etkiler: [{ tip: "stres", deger: 4 }],
            eylem: "yoksay",
          },
        ],
      };
    },
  },
  {
    id: "is-bul-18",
    tip: "onemli",
    minYas: 18,
    maxYas: 25,
    once: false,
    weight: 88,
    kosul: (ctx) => {
      if (ctx.player.meslek && ctx.player.meslek !== "Öğrenci" && ctx.player.gelir > 0) return false;
      return ctx.player.yas === 18 || ctx.player.yas === 20 || ctx.player.yas === 22;
    },
    build: () => ({
      id: "is-bul-18",
      tip: "onemli",
      baslik: "İş Bulma Zamanı",
      aciklama:
        "Gelirin yok veya öğrenci maaşın yok. Gerçek hayatta bu yaşta iş veya staj baskısı artar. Ne yapacaksın?",
      secenekler: [
        {
          id: "s1",
          metin: "Tam zamanlı iş ara",
          sonuc: "İşe başladın. Tempon değişti.",
          etkiler: [
            { tip: "para", deger: 2000 },
            { tip: "stres", deger: 5 },
            { tip: "ozellik", deger: 3, ozellik: "guven" },
          ],
          eylem: "ise_basla",
        },
        {
          id: "s2",
          metin: "Part-time / staj",
          sonuc: "Küçük gelir + deneyim.",
          etkiler: [
            { tip: "para", deger: 800 },
            { tip: "ozellik", deger: 2, ozellik: "zeka" },
            { tip: "stres", deger: 3 },
          ],
          eylem: "ise_basla",
        },
        {
          id: "s3",
          metin: "Aile desteğiyle oku",
          sonuc: "Eğitime odaklandın. Maddi bağımlılık sürüyor.",
          etkiler: [
            { tip: "ozellik", deger: 3, ozellik: "zeka" },
            { tip: "stres", deger: 2 },
          ],
          eylem: "yoksay",
        },
      ],
    }),
  },
  {
    id: "evlilik-baskisi",
    tip: "firsati",
    minYas: 27,
    maxYas: 38,
    once: false,
    weight: 55,
    kosul: (ctx) => {
      const married = ctx.relationships.some((r) => r.tip === "es");
      return !married && ctx.player.yas % 4 === 0;
    },
    build: () => ({
      id: "evlilik-baskisi",
      tip: "firsati",
      baslik: "Aile: Evlilik Konuşması",
      aciklama: "Akrabalar ve ailen 'ne zaman yuvalanı kuruyorsun?' diye soruyor. Gerçekçi bir sosyal baskı.",
      secenekler: [
        {
          id: "s1",
          metin: "Ciddi ilişki / niyet açıkla",
          sonuc: "Baskı azaldı; sorumluluk arttı.",
          etkiler: [
            { tip: "stres", deger: 3 },
            { tip: "ozellik", deger: 2, ozellik: "sevgi" },
          ],
        },
        {
          id: "s2",
          metin: "Sınır koy",
          sonuc: "Rahatladın; bazıları kırıldı.",
          etkiler: [
            { tip: "ozellik", deger: 3, ozellik: "guven" },
            { tip: "stres", deger: -2 },
          ],
        },
        {
          id: "s3",
          metin: "Konuyu geçiştir",
          sonuc: "Baskı gelecek yıl da gelecek.",
          etkiler: [{ tip: "stres", deger: 5 }],
        },
      ],
    }),
  },
  {
    id: "emeklilik",
    tip: "zorunlu",
    minYas: 60,
    maxYas: 65,
    once: true,
    weight: 95,
    kosul: (ctx) => ctx.player.meslek !== "Emekli" && ctx.player.yas >= 60,
    build: (ctx) => ({
      id: "emeklilik",
      tip: "zorunlu",
      baslik: "Emeklilik Dönemeci",
      aciklama: `${ctx.player.yas} yaş. Çalışma hayatın sorgulanıyor. SGK ve birikim masada.`,
      secenekler: [
        {
          id: "s1",
          metin: "Emekli ol",
          sonuc: "Tempon düştü. Yeni bir dönem başladı.",
          etkiler: [
            { tip: "stres", deger: -6 },
            { tip: "mutluluk", deger: 4 },
            { tip: "para", deger: 5000 },
          ],
          eylem: "emekli_ol",
        },
        {
          id: "s2",
          metin: "Birkaç yıl daha çalış",
          sonuc: "Gelir sürüyor; yorgunluk da.",
          etkiler: [
            { tip: "para", deger: 12000 },
            { tip: "saglik", deger: -3 },
            { tip: "stres", deger: 4 },
          ],
          eylem: "yoksay",
        },
      ],
    }),
  },
  {
    id: "saglik-kontrol",
    tip: "onemli",
    minYas: 40,
    maxYas: 80,
    once: false,
    weight: 50,
    kosul: (ctx) => ctx.player.saglik < 55 || (ctx.player.yas >= 45 && ctx.player.yas % 5 === 0),
    build: () => ({
      id: "saglik-kontrol",
      tip: "onemli",
      baslik: "Sağlık Kontrolü Şart",
      aciklama: "Yaşın ve vücut sinyallerin check-up istiyor. Ertelemek riskli.",
      secenekler: [
        {
          id: "s1",
          metin: "Doktora git",
          sonuc: "Kontrol yapıldı. Önlem aldın.",
          etkiler: [
            { tip: "saglik", deger: 8 },
            { tip: "para", deger: -1500 },
            { tip: "stres", deger: -2 },
          ],
        },
        {
          id: "s2",
          metin: "Ertele",
          sonuc: "Risk büyüdü.",
          etkiler: [
            { tip: "saglik", deger: -6 },
            { tip: "stres", deger: 5 },
          ],
        },
      ],
    }),
  },
  {
    id: "cocuk-dusun",
    tip: "firsati",
    minYas: 28,
    maxYas: 42,
    once: false,
    weight: 45,
    kosul: (ctx) => {
      const hasSpouse = ctx.relationships.some((r) => r.tip === "es");
      const hasChild = ctx.relationships.some((r) => r.tip === "cocuk");
      return hasSpouse && !hasChild && ctx.player.yas % 5 === 0;
    },
    build: () => ({
      id: "cocuk-dusun",
      tip: "firsati",
      baslik: "Çocuk Sahibi Olmayı Düşünmek",
      aciklama: "Eşinle gelecek konuşuluyor. Ekonomik ve duygusal hazırlık masada.",
      secenekler: [
        {
          id: "s1",
          metin: "Hazırlanmaya başla",
          sonuc: "Plan yaptınız. Heyecan + sorumluluk.",
          etkiler: [
            { tip: "mutluluk", deger: 5 },
            { tip: "stres", deger: 4 },
            { tip: "ozellik", deger: 3, ozellik: "sevgi" },
          ],
        },
        {
          id: "s2",
          metin: "Birkaç yıl bekle",
          sonuc: "Zaman kazandınız.",
          etkiler: [{ tip: "stres", deger: -1 }],
        },
      ],
    }),
  },
];

/**
 * BitLife tarzı: yıl başında yaşa göre zorunlu/önemli popup seç.
 * Yoksa null → rastgele olay devam eder.
 */
export function pickLifePrompt(ctx: LifePromptContext): LifePrompt | null {
  const yas = ctx.player.yas;
  const candidates = PROMPT_DEFS.filter((d) => {
    if (yas < d.minYas || yas > d.maxYas) return false;
    if (d.once && ctx.triggeredIds.some((id) => id === d.id || id.startsWith(d.id + "-"))) {
      return false;
    }
    try {
      return d.kosul(ctx);
    } catch {
      return false;
    }
  });

  if (candidates.length === 0) return null;

  // Zorunlu öncelikli
  const zorunlu = candidates.filter((c) => c.tip === "zorunlu");
  const pool = zorunlu.length > 0 ? zorunlu : candidates;

  const total = pool.reduce((s, c) => s + c.weight, 0);
  let r = Math.random() * total;
  for (const def of pool) {
    r -= def.weight;
    if (r <= 0) return def.build(ctx);
  }
  return pool[0].build(ctx);
}

export function familyYearlyNews(
  family: Character[],
  relationships: Relationship[],
  yil: number
): { family: Character[]; relationships: Relationship[]; messages: string[] } {
  const messages: string[] = [];
  let updatedFamily = family.map((f) => ({ ...f }));
  let updatedRels = relationships.map((r) => ({ ...r }));

  for (const member of updatedFamily) {
    if (member.durum === "oldu") continue;

    // İlişki doğal aşınma (BitLife: ilgilenmezsen düşer)
    updatedRels = updatedRels.map((r) => {
      if (r.targetId !== member.id) return r;
      const decay = member.aileRolu === "anne" || member.aileRolu === "baba" ? 1 : 2;
      return { ...r, puan: Math.max(10, r.puan - decay) };
    });

    // Aile haberi
    if (Math.random() < 0.22) {
      const news = [
        `${member.isim} yeni bir hobi edindi.`,
        `${member.isim} sağlık kontrolüne gitti.`,
        `${member.isim} seninle daha çok vakit geçirmek istiyor.`,
        `${member.isim} işte zor bir dönem geçiriyor.`,
        `${member.isim} ${member.sehir}'de bir etkinliğe katıldı.`,
        `${member.isim} hakkında aile sohbetinde konuşuldu.`,
        `${member.isim} seni aradı / sordu.`,
      ];
      messages.push(news[Math.floor(Math.random() * news.length)]);
    }

    // Kardeş işe girer
    if (member.aileRolu === "kardes" && member.yas === 18 && (!member.meslek || member.meslek === "Öğrenci")) {
      member.meslek = "Satış Temsilcisi";
      member.gelir = 12000;
      messages.push(`${member.isim} 18 yaşında işe başladı.`);
    }

    // Ebeveyn ölümü biraz daha görünür
    if ((member.aileRolu === "anne" || member.aileRolu === "baba") && member.yas > 72 && Math.random() < 0.04) {
      member.durum = "oldu";
      member.saglik = 0;
      messages.push(`${member.isim} (${member.aileRolu}) vefat etti.`);
    }

    void yil;
  }

  return { family: updatedFamily, relationships: updatedRels, messages };
}

// livingWithParents unused helper - keep for future or remove
void livingWithParents;
