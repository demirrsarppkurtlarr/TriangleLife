import type { AgeGroup, EventCategory, EventChoice, GameEvent } from "@/types/game";

type Template = {
  kategori: EventCategory;
  yasGrubu: AgeGroup[];
  oncelik: number;
  basliklar: string[];
  aciklamalar: string[];
  secenekler: EventChoice[];
};

const ALL_AGES: AgeGroup[] = [
  "bebek", "cocuk", "ilkokul", "ergen", "genc", "yetiskin", "orta_yas", "yasli", "ileri_yas",
];

const CHILD_AGES: AgeGroup[] = ["cocuk", "ilkokul"];
const TEEN_AGES: AgeGroup[] = ["ergen", "genc"];
const ADULT_AGES: AgeGroup[] = ["genc", "yetiskin", "orta_yas"];
const SENIOR_AGES: AgeGroup[] = ["orta_yas", "yasli", "ileri_yas"];

const templates: Template[] = [
  {
    kategori: "aile",
    yasGrubu: ALL_AGES.filter((a) => a !== "bebek"),
    oncelik: 40,
    basliklar: [
      "Aile Toplantısı", "Akşam Yemeği", "Aile Tartışması", "Akraba Ziyareti",
      "Bayram Kutlaması", "Aile Fotoğrafı", "Ev İşleri", "Aile Sırrı",
      "Kardeş Kıskançlığı", "Anne-Baba Konuşması", "Aile Tatili Planı", "Mirasa Dair Sohbet",
    ],
    aciklamalar: [
      "Ailenle önemli bir konu konuşulacak.",
      "Evde duygusal bir atmosfer var.",
      "Bir aile üyesi seninle konuşmak istiyor.",
      "Aile içinde yeni bir gelişme yaşandı.",
    ],
    secenekler: [
      { id: "s1", metin: "Yapıcı ol", sonuc: "İlişkilerin güçlendi.", etkiler: [{ tip: "mutluluk", deger: 6 }, { tip: "ozellik", deger: 3, ozellik: "empati" }] },
      { id: "s2", metin: "Sessiz kal", sonuc: "Ortam gergin kaldı.", etkiler: [{ tip: "stres", deger: 4 }] },
      { id: "s3", metin: "Tartışmaya gir", sonuc: "Kısa süreli bir gerginlik yaşandı.", etkiler: [{ tip: "stres", deger: 8 }, { tip: "mutluluk", deger: -4 }] },
    ],
  },
  {
    kategori: "egitim",
    yasGrubu: ["ilkokul", "ergen", "genc"],
    oncelik: 45,
    basliklar: [
      "Sınav Haftası", "Ödev Krizi", "Öğretmen Notu", "Kütüphane Günü",
      "Proje Sunumu", "Burs Başvurusu", "Ders Kulübü", "Sınıf Başkanlığı",
      "Yabancı Dil Kursu", "Online Ders", "Grup Çalışması", "Not Ortalaması",
    ],
    aciklamalar: [
      "Eğitim hayatında kritik bir an.",
      "Okulda yeni bir fırsat doğdu.",
      "Derslerin seni zorluyor.",
      "Akademik bir karar vermen gerekiyor.",
    ],
    secenekler: [
      { id: "s1", metin: "Çok çalış", sonuc: "Bilgin arttı.", etkiler: [{ tip: "ozellik", deger: 6, ozellik: "zeka" }, { tip: "stres", deger: 5 }] },
      { id: "s2", metin: "Dengeli ilerle", sonuc: "Makul bir ilerleme kaydettin.", etkiler: [{ tip: "ozellik", deger: 3, ozellik: "zeka" }] },
      { id: "s3", metin: "Ertele", sonuc: "Fırsatı kaçırdın.", etkiler: [{ tip: "stres", deger: 3 }] },
    ],
  },
  {
    kategori: "kariyer",
    yasGrubu: ADULT_AGES,
    oncelik: 50,
    basliklar: [
      "İş Görüşmesi", "Ofis Draması", "Yeni Proje", "Müşteri Şikayeti",
      "Ekip Toplantısı", "Mesai Uzatması", "İş Arkadaşı Yardımı", "Performans Değerlendirmesi",
      "İş Seyahati", "Yeni Yazılım", "Patronla Konuşma", "Kariyer Fırsatı",
    ],
    aciklamalar: [
      "İş hayatında yeni bir gelişme var.",
      "Kariyerin için önemli bir seçim anı.",
      "Ofiste beklenmedik bir durum oluştu.",
      "Mesleki bir fırsat kapıda.",
    ],
    secenekler: [
      { id: "s1", metin: "Profesyonel davran", sonuc: "İtibarın arttı.", etkiler: [{ tip: "ozellik", deger: 5, ozellik: "guven" }, { tip: "para", deger: 1500 }] },
      { id: "s2", metin: "Risk al", sonuc: "Cesur bir adım attın.", etkiler: [{ tip: "mutluluk", deger: 5 }, { tip: "stres", deger: 6 }] },
      { id: "s3", metin: "Pas geç", sonuc: "Güvenli tarafta kaldın." },
    ],
  },
  {
    kategori: "saglik",
    yasGrubu: ALL_AGES.filter((a) => a !== "bebek"),
    oncelik: 35,
    basliklar: [
      "Kontrol Muayenesi", "Uyku Problemi", "Beslenme Düzeni", "Spor Motivasyonu",
      "Baş Ağrısı", "Soğuk Algınlığı", "Vitamin Eksikliği", "Göz Yorgunluğu",
      "Bel Ağrısı", "Stres Belirtileri", "Diş Kontrolü", "Kan Tahlili",
    ],
    aciklamalar: [
      "Sağlığınla ilgili bir durum ortaya çıktı.",
      "Vücudun dinlenme sinyali veriyor.",
      "Sağlıklı yaşam için bir karar vermelisin.",
      "Küçük bir sağlık sorunu belirdi.",
    ],
    secenekler: [
      { id: "s1", metin: "Tedavi ol / dikkat et", sonuc: "Sağlığın düzeldi.", etkiler: [{ tip: "saglik", deger: 8 }, { tip: "para", deger: -250 }] },
      { id: "s2", metin: "Doğal yollarla çöz", sonuc: "Yavaş iyileşme.", etkiler: [{ tip: "saglik", deger: 4 }] },
      { id: "s3", metin: "Umursama", sonuc: "Durum kötüleşebilir.", etkiler: [{ tip: "saglik", deger: -6 }] },
    ],
  },
  {
    kategori: "sosyal",
    yasGrubu: ["ilkokul", "ergen", "genc", "yetiskin", "orta_yas"],
    oncelik: 40,
    basliklar: [
      "Arkadaş Daveti", "Parti Haberi", "Kulüp Toplantısı", "Komşu Sohbeti",
      "Online Topluluk", "Yardım Kampanyası", "Sinema Gecesi", "Kahve Buluşması",
      "Doğum Günü Daveti", "Yeni Tanışma", "Eski Arkadaş", "Mahalle Etkinliği",
    ],
    aciklamalar: [
      "Sosyal bir fırsat kapını çaldı.",
      "İnsanlarla vakit geçirme şansın var.",
      "Çevrende yeni bir sosyal olay var.",
      "Arkadaş çevrenden bir davet geldi.",
    ],
    secenekler: [
      { id: "s1", metin: "Katıl", sonuc: "Keyifli vakit geçirdin.", etkiler: [{ tip: "mutluluk", deger: 8 }, { tip: "ozellik", deger: 4, ozellik: "sosyallik" }, { tip: "para", deger: -150 }] },
      { id: "s2", metin: "Kısa uğra", sonuc: "Nazikçe katıldın.", etkiler: [{ tip: "mutluluk", deger: 4 }, { tip: "ozellik", deger: 2, ozellik: "sosyallik" }] },
      { id: "s3", metin: "Reddet", sonuc: "Evde kaldın." },
    ],
  },
  {
    kategori: "finans",
    yasGrubu: ADULT_AGES,
    oncelik: 35,
    basliklar: [
      "Beklenmedik Gider", "İndirim Fırsatı", "Bonus Haberi", "Fatura Şoku",
      "Yatırım Tavsiyesi", "Market Alışverişi", "Online Alışveriş", "Vergi Hatırlatması",
      "Kira Artışı", "Ek Gelir Fırsatı", "Tasarruf Planı", "Harçlık Düzeni",
    ],
    aciklamalar: [
      "Cüzdanını etkileyen bir karar anı.",
      "Finansal bir fırsat veya risk belirdi.",
      "Para konusunda dikkatli olmalısın.",
      "Bütçeni etkileyecek bir durum var.",
    ],
    secenekler: [
      { id: "s1", metin: "Akıllıca yönet", sonuc: "Finansal disiplin kazandın.", etkiler: [{ tip: "para", deger: 800 }, { tip: "ozellik", deger: 2, ozellik: "guven" }] },
      { id: "s2", metin: "Harcama yap", sonuc: "Kısa süreli mutluluk.", etkiler: [{ tip: "mutluluk", deger: 6 }, { tip: "para", deger: -1200 }] },
      { id: "s3", metin: "Ertele", sonuc: "Kararı erteledin." },
    ],
  },
  {
    kategori: "romantik",
    yasGrubu: TEEN_AGES.concat(["yetiskin"]),
    oncelik: 45,
    basliklar: [
      "Mesaj Beklentisi", "Romantik Akşam", "Kıskançlık Anı", "İlk Buluşma",
      "Özür Zamanı", "Sürpriz Hediye", "Uzun Mesafe", "Aileye Tanıtma",
      "Tartışma Sonrası", "Ortak Gelecek", "Flört Sinyali", "İlişki Molası",
    ],
    aciklamalar: [
      "Kalbinle ilgili bir karar vermen gerekiyor.",
      "Romantik hayatında yeni bir gelişme var.",
      "İlişkin test ediliyor.",
      "Duygusal bir an yaşanıyor.",
    ],
    secenekler: [
      { id: "s1", metin: "Samimi ol", sonuc: "Bağınız güçlendi.", etkiler: [{ tip: "mutluluk", deger: 10 }, { tip: "ozellik", deger: 3, ozellik: "sevgi" }] },
      { id: "s2", metin: "Temkinli ol", sonuc: "Mesafeni korudun.", etkiler: [{ tip: "stres", deger: -2 }] },
      { id: "s3", metin: "Uzaklaş", sonuc: "Soğuk bir dönem başladı.", etkiler: [{ tip: "mutluluk", deger: -6 }] },
    ],
  },
  {
    kategori: "rastgele",
    yasGrubu: ALL_AGES.filter((a) => a !== "bebek"),
    oncelik: 25,
    basliklar: [
      "Garip Rastlantı", "Kayıp Eşya", "Yağmur Baskını", "Sokak Sanatçısı",
      "Bedava Kahve", "Yanlış Numara", "Elektrik Kesintisi", "Komşu Yardımı",
      "Kedi Miyaavladı", "Şanslı Bilet", "Eski Fotoğraf", "Ani İlham",
    ],
    aciklamalar: [
      "Hayat bazen sürprizlerle gelir.",
      "Beklenmedik küçük bir olay yaşandı.",
      "Günün akışını değiştiren bir an.",
      "Rastgele bir durumla karşılaştın.",
    ],
    secenekler: [
      { id: "s1", metin: "Olumlu karşıla", sonuc: "Gününüz güzelleşti.", etkiler: [{ tip: "mutluluk", deger: 5 }] },
      { id: "s2", metin: "Merak et", sonuc: "İlginç bir deneyim.", etkiler: [{ tip: "ozellik", deger: 2, ozellik: "zeka" }] },
      { id: "s3", metin: "Umursama", sonuc: "Hayat normal aktı." },
    ],
  },
  {
    kategori: "yasam",
    yasGrubu: CHILD_AGES,
    oncelik: 40,
    basliklar: [
      "Park Macerası", "Oyuncak Paylaşımı", "Masal Saati", "Resim Yapma",
      "Bisiklet Denemesi", "Dondurma Sevinci", "Korku Filmi", "Gizli Kulüp",
      "Okul Servisi", "Öğle Arası", "Ev Ödevi İsyanı", "Yeni Ayakkabı",
    ],
    aciklamalar: [
      "Çocukluk yıllarının renkli bir anı.",
      "Küçük ama önemli bir seçim.",
      "Oyun ve keşif zamanı.",
      "Merak dolu bir gün.",
    ],
    secenekler: [
      { id: "s1", metin: "Heyecanla katıl", sonuc: "Harika anılar birikti.", etkiler: [{ tip: "mutluluk", deger: 8 }] },
      { id: "s2", metin: "Temkinli ol", sonuc: "Güvenli bir deneyim.", etkiler: [{ tip: "mutluluk", deger: 3 }] },
    ],
  },
  {
    kategori: "yasam",
    yasGrubu: SENIOR_AGES,
    oncelik: 40,
    basliklar: [
      "Anı Defteri", "Torun Oyunu", "Sabah Yürüyüşü", "Eski Dost Ziyareti",
      "Bahçe İşi", "Doktor Randevusu", "Emeklilik Kulübü", "Gazete Keyfi",
      "Aile Albümü", "Vasiyet Düşüncesi", "Komşu Çayı", "Nostalji Akşamı",
    ],
    aciklamalar: [
      "Yaşamın olgun döneminde yeni bir gün.",
      "Huzur ve anılar iç içe.",
      "Deneyiminle ilgili bir seçim.",
      "Sakin ama anlamlı bir an.",
    ],
    secenekler: [
      { id: "s1", metin: "Keyfini çıkar", sonuc: "İç huzurun arttı.", etkiler: [{ tip: "mutluluk", deger: 8 }, { tip: "stres", deger: -6 }] },
      { id: "s2", metin: "Paylaş", sonuc: "Sevdiklerinle bağın güçlendi.", etkiler: [{ tip: "mutluluk", deger: 6 }, { tip: "ozellik", deger: 3, ozellik: "sevgi" }] },
      { id: "s3", metin: "Dinlen", sonuc: "Sakin bir gün.", etkiler: [{ tip: "stres", deger: -4 }] },
    ],
  },
  {
    kategori: "yasam",
    yasGrubu: ["bebek"],
    oncelik: 50,
    basliklar: [
      "İlk Gülüş", "Mama Zamanı", "Uyku Düzeni", "Oyuncak Sesleri",
      "Banyo Keyfi", "Kucak Zamanı", "Göz Teması", "İlk Diş",
    ],
    aciklamalar: [
      "Bebeklik döneminin tatlı bir anı.",
      "Ailen seninle ilgileniyor.",
      "Yeni bir duyusal deneyim.",
      "Güvenli ve sıcak bir gün.",
    ],
    secenekler: [
      { id: "s1", metin: "Mutlu tepki ver", sonuc: "Ailen sevindi.", etkiler: [{ tip: "mutluluk", deger: 5 }] },
      { id: "s2", metin: "Ağla", sonuc: "İhtiyaçların karşılandı.", etkiler: [{ tip: "mutluluk", deger: 2 }] },
    ],
  },
];

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export function generateProceduralEvents(targetCount = 500): GameEvent[] {
  const events: GameEvent[] = [];
  let index = 0;

  while (events.length < targetCount) {
    const template = templates[index % templates.length];
    const variant = Math.floor(index / templates.length);
    const seed = hashString(`${template.kategori}-${index}-${variant}`);

    const baslik = pick(template.basliklar, seed);
    const aciklama = pick(template.aciklamalar, seed + 1);
    const suffix = variant > 0 ? ` #${variant + 1}` : "";

    events.push({
      id: `proc-${template.kategori}-${index}`,
      baslik: `${baslik}${suffix}`,
      aciklama,
      kategori: template.kategori,
      yasGrubu: template.yasGrubu,
      oncelik: Math.max(10, template.oncelik - (variant % 5)),
      secenekler: template.secenekler.map((s, i) => ({
        ...s,
        id: `s${i + 1}`,
        etkiler: s.etkiler?.map((e) => ({
          ...e,
          deger: e.deger + ((seed + i) % 3) - 1,
        })),
      })),
    });

    index++;
  }

  return events;
}
