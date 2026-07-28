import type { GameEvent } from "@/types/game";

/** El yazması, gerçekçi çekirdek olaylar */
export const realisticBaseEvents: GameEvent[] = [
  {
    id: "bebek-dogum",
    baslik: "Dünyaya Gözlerini Açtın",
    aciklama:
      "Hastane odasında ilk kez dış dünyanın seslerini duyuyorsun. Annen bitkin ama mutlu; baban kapıda bekliyor.",
    kategori: "yasam",
    yasGrubu: ["bebek"],
    oncelik: 100,
    secenekler: [
      {
        id: "s1",
        metin: "Sakin uyu",
        sonuc: "İlk saatlerin huzurlu geçti. Ailen nöbet tutuyor.",
        etkiler: [{ tip: "mutluluk", deger: 3 }],
      },
      {
        id: "s2",
        metin: "Ağlayarak ihtiyaç bildir",
        sonuc: "Hemşire ve annen hemen ilgilendi.",
        etkiler: [{ tip: "mutluluk", deger: 2 }],
      },
    ],
  },
  {
    id: "ilkokul-okul-yolu",
    baslik: "İlkokul Servisi",
    aciklama:
      "Servis kapıda. Çantan ağır; biraz heyecan, biraz korku var. Annen elini sallıyor.",
    kategori: "egitim",
    yasGrubu: ["ilkokul"],
    oncelik: 90,
    secenekler: [
      {
        id: "s1",
        metin: "Gülümseyip bin",
        sonuc: "Yeni bir düzen başladı. Arkadaş edinmeye açıksın.",
        etkiler: [
          { tip: "ozellik", deger: 3, ozellik: "sosyallik" },
          { tip: "mutluluk", deger: 4 },
        ],
      },
      {
        id: "s2",
        metin: "Annenin yanında bir dakika daha kal",
        sonuc: "Ayrılık zor oldu ama servise bindin.",
        etkiler: [
          { tip: "stres", deger: 3 },
          { tip: "mutluluk", deger: 1 },
        ],
      },
    ],
  },
  {
    id: "ergen-lgs-baskisi",
    baslik: "Sınav Dönemi Baskısı",
    aciklama:
      "Lise sınavı yaklaşıyor. Ailen beklenti içinde; dershanede herkes yarış halinde. Uykun bozulmaya başladı.",
    kategori: "egitim",
    yasGrubu: ["ergen"],
    oncelik: 85,
    secenekler: [
      {
        id: "s1",
        metin: "Disiplinli programa uy",
        sonuc: "Yorucu ama verimli bir dönem. Notların toparlandı.",
        etkiler: [
          { tip: "ozellik", deger: 6, ozellik: "zeka" },
          { tip: "stres", deger: 6 },
        ],
      },
      {
        id: "s2",
        metin: "Denge kur: ders + kısa mola",
        sonuc: "Sürdürülebilir bir tempo tutturdun.",
        etkiler: [
          { tip: "ozellik", deger: 3, ozellik: "zeka" },
          { tip: "stres", deger: 2 },
        ],
      },
      {
        id: "s3",
        metin: "Baskıya yenil, ertele",
        sonuc: "Kaygı arttı. Aileyle tartışmalar çıktı.",
        etkiler: [
          { tip: "stres", deger: 10 },
          { tip: "mutluluk", deger: -5 },
        ],
      },
    ],
  },
  {
    id: "genc-askere-gitme",
    baslik: "Askerlik Planı",
    aciklama:
      "Yakın çevrende askerlik konuşuluyor. Senin için de karar zamanı yaklaşıyor.",
    kategori: "yasam",
    yasGrubu: ["genc"],
    oncelik: 40,
    secenekler: [
      {
        id: "s1",
        metin: "Planını netleştir ve hazırlan",
        sonuc: "Belirsizlik azaldı. Ailen destekledi.",
        etkiler: [
          { tip: "ozellik", deger: 3, ozellik: "guven" },
          { tip: "stres", deger: -2 },
        ],
      },
      {
        id: "s2",
        metin: "Ertele, kariyere odaklan",
        sonuc: "Zaman kazandın ama kafanda soru işareti kaldı.",
        etkiler: [{ tip: "stres", deger: 3 }],
      },
    ],
  },
  {
    id: "yetiskin-evlilik-karari",
    baslik: "Aile Baskısı: Evlilik",
    aciklama:
      "Akrabalar 'ne zaman evleniyorsun?' diye soruyor. Partnerinle ilişkiniz var ama zamanlama net değil.",
    kategori: "aile",
    yasGrubu: ["yetiskin"],
    oncelik: 50,
    secenekler: [
      {
        id: "s1",
        metin: "Partnerinle açık konuş",
        sonuc: "Ortak bir yol haritası çıkardınız.",
        etkiler: [
          { tip: "mutluluk", deger: 5 },
          { tip: "ozellik", deger: 3, ozellik: "empati" },
        ],
      },
      {
        id: "s2",
        metin: "Aileye sınır koy",
        sonuc: "Rahatladın ama bazı akrabalar kırıldı.",
        etkiler: [
          { tip: "stres", deger: -3 },
          { tip: "ozellik", deger: 2, ozellik: "guven" },
        ],
      },
      {
        id: "s3",
        metin: "Konuyu savuştur",
        sonuc: "Baskı devam ediyor.",
        etkiler: [{ tip: "stres", deger: 5 }],
      },
    ],
  },
  {
    id: "orta-emeklilik-hesabi",
    baslik: "Emeklilik Hesabı",
    aciklama:
      "SGK dökümüne bakıyorsun. Prim günlerin ve birikimin seni düşündürüyor. Sağlık harcamaları da artıyor.",
    kategori: "finans",
    yasGrubu: ["orta_yas"],
    oncelik: 55,
    secenekler: [
      {
        id: "s1",
        metin: "Birikimi gözden geçir, plan yap",
        sonuc: "Daha net bir tablo çıkardın.",
        etkiler: [
          { tip: "stres", deger: -4 },
          { tip: "ozellik", deger: 2, ozellik: "guven" },
        ],
      },
      {
        id: "s2",
        metin: "Ek iş / yan gelir düşün",
        sonuc: "Yorucu ama gelirin arttı.",
        etkiler: [
          { tip: "para", deger: 8000 },
          { tip: "stres", deger: 6 },
        ],
      },
      {
        id: "s3",
        metin: "Ertele",
        sonuc: "Kaygı birikti.",
        etkiler: [{ tip: "stres", deger: 7 }],
      },
    ],
  },
  {
    id: "yasli-ilac-duzeni",
    baslik: "İlaç Saatleri",
    aciklama:
      "Kronik bir rahatsızlık için düzenli ilaç kullanman gerekiyor. Bazen unutuyorsun; çocukların hatırlatıyor.",
    kategori: "saglik",
    yasGrubu: ["yasli", "ileri_yas"],
    oncelik: 60,
    secenekler: [
      {
        id: "s1",
        metin: "Alarm kur, düzene uy",
        sonuc: "Kontrollerin daha iyi gitti.",
        etkiler: [{ tip: "saglik", deger: 8 }],
      },
      {
        id: "s2",
        metin: "Düzensiz kullan",
        sonuc: "Dalgalı bir dönem yaşadın.",
        etkiler: [
          { tip: "saglik", deger: -5 },
          { tip: "stres", deger: 4 },
        ],
      },
    ],
  },
  {
    id: "mahalle-komsu",
    baslik: "Komşu Yardımı",
    aciklama:
      "Yaşlı komşun market poşetlerini taşıyamıyor. Merdiven boşluğunda karşılaştınız.",
    kategori: "sosyal",
    yasGrubu: ["ilkokul", "ergen", "genc", "yetiskin", "orta_yas"],
    oncelik: 35,
    secenekler: [
      {
        id: "s1",
        metin: "Poşetleri taşı",
        sonuc: "Komşu teşekkür etti. Mahallede adın duyuldu.",
        etkiler: [
          { tip: "ozellik", deger: 3, ozellik: "comertlik" },
          { tip: "mutluluk", deger: 3 },
        ],
      },
      {
        id: "s2",
        metin: "Selam verip geç",
        sonuc: "Nötr bir gün. Kimse kırılmadı ama fırsat kaçtı.",
        etkiler: [],
      },
    ],
  },
  {
    id: "okul-sinav-sirasi",
    baslik: "Sınıf Sıralaması",
    aciklama:
      "Karne günü. Sınıf ortalaması ve sıralaman açıklandı. Ailen sonucu merak ediyor.",
    kategori: "egitim",
    yasGrubu: ["ilkokul", "ergen"],
    oncelik: 70,
    secenekler: [
      {
        id: "s1",
        metin: "Sonucu kabul et, gelecek dönem planla",
        sonuc: "Gerçekçi bir hedef koydun.",
        etkiler: [
          { tip: "ozellik", deger: 3, ozellik: "zeka" },
          { tip: "stres", deger: -2 },
        ],
      },
      {
        id: "s2",
        metin: "Aileye abartılı anlat",
        sonuc: "Kısa süre övgü aldın ama baskı arttı.",
        etkiler: [
          { tip: "stres", deger: 5 },
          { tip: "ozellik", deger: -2, ozellik: "guven" },
        ],
      },
    ],
  },
  {
    id: "din-ramazan",
    baslik: "Ramazan Sofrası",
    aciklama:
      "Aile iftara çağırıyor. Bazı akrabalar ibadet konusunda ısrarcı; sen kendi kararını vermek istiyorsun.",
    kategori: "aile",
    yasGrubu: ["ergen", "genc", "yetiskin", "orta_yas"],
    oncelik: 40,
    secenekler: [
      {
        id: "s1",
        metin: "Saygıyla katıl, kendi sınırını koru",
        sonuc: "Aile bağın güçlendi; baskı azalmadı ama çatışma olmadı.",
        etkiler: [
          { tip: "mutluluk", deger: 3 },
          { tip: "ozellik", deger: 2, ozellik: "empati" },
        ],
      },
      {
        id: "s2",
        metin: "Nazikçe reddet",
        sonuc: "Bazı akrabalar üzüldü. İç huzurun korundu.",
        etkiler: [
          { tip: "stres", deger: 3 },
          { tip: "ozellik", deger: 2, ozellik: "guven" },
        ],
      },
    ],
  },
  {
    id: "siyaset-secim",
    baslik: "Seçim Günü",
    aciklama:
      "Sandık kuruldu. Ailen ve arkadaşların farklı görüşlerde. Sosyal medya gergin.",
    kategori: "yasam",
    yasGrubu: ["genc", "yetiskin", "orta_yas", "yasli"],
    oncelik: 45,
    minYas: 18,
    secenekler: [
      {
        id: "s1",
        metin: "Oyunu kullan, tartışmaya girme",
        sonuc: "Vatandaşlık görevini yaptın. Gerginlikten uzak durdun.",
        etkiler: [
          { tip: "ozellik", deger: 2, ozellik: "guven" },
          { tip: "stres", deger: -2 },
        ],
      },
      {
        id: "s2",
        metin: "Aile sohbetinde sert tartış",
        sonuc: "Masada hava bozuldu. İlişkiler gerildi.",
        etkiler: [
          { tip: "stres", deger: 8 },
          { tip: "mutluluk", deger: -4 },
        ],
      },
    ],
  },
  {
    id: "suc-trafik-ceza",
    baslik: "Trafik Cezası",
    aciklama:
      "Radar yakaladı. Hız sınırını biraz aşmıştın. Ceza tutarı cebini zorlayacak.",
    kategori: "finans",
    yasGrubu: ["genc", "yetiskin", "orta_yas"],
    oncelik: 35,
    minYas: 18,
    secenekler: [
      {
        id: "s1",
        metin: "Cezayı zamanında öde",
        sonuc: "Konu kapandı. Daha dikkatli sürmeye söz verdin.",
        etkiler: [{ tip: "para", deger: -1800 }],
      },
      {
        id: "s2",
        metin: "İtiraz etmeyi dene",
        sonuc: "Zaman kaybettin; ceza yine geldi.",
        etkiler: [
          { tip: "para", deger: -1800 },
          { tip: "stres", deger: 5 },
        ],
      },
    ],
  },
];
