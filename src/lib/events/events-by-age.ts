import type { AgeGroup, EventCategory, EventChoice, EventEffect, GameEvent } from "@/types/game";

type AgeBand = {
  id: string;
  yasGrubu: AgeGroup;
  minYas: number;
  maxYas: number;
  scenes: Array<{
    baslik: string;
    aciklama: string;
    kategori: EventCategory;
    oncelik: number;
    /** Bu yaş bandına özel seçenekler — başka bantta kullanılmaz */
    secenekler: EventChoice[];
  }>;
};

function e(
  tip: EventEffect["tip"],
  deger: number,
  ozellik?: EventEffect["ozellik"]
): EventEffect {
  return ozellik ? { tip, deger, ozellik } : { tip, deger };
}

/** Her yaş bandı tamamen ayrı hikâye + tamamen ayrı seçenekler */
const AGE_BANDS: AgeBand[] = [
  // ——— BEBEK 0 ———
  {
    id: "bebek-0",
    yasGrubu: "bebek",
    minYas: 0,
    maxYas: 0,
    scenes: [
      {
        baslik: "İlk Günler",
        aciklama: "Dünya bulanık ve gürültülü. Annenin kalp atışını arıyorsun; ışıklar fazla parlak.",
        kategori: "yasam",
        oncelik: 90,
        secenekler: [
          { id: "s1", metin: "Annenin göğsüne yaslan", sonuc: "Güvende hissettin. İlk bağ güçlendi.", etkiler: [e("mutluluk", 4)] },
          { id: "s2", metin: "Sertçe ağla", sonuc: "İhtiyaçların fark edildi. Hemşire yardımcı oldu.", etkiler: [e("mutluluk", 2), e("stres", 2)] },
          { id: "s3", metin: "Uykuya dal", sonuc: "İlk günün sessiz geçti.", etkiler: [e("saglik", 2)] },
        ],
      },
      {
        baslik: "Bez Değişimi",
        aciklama: "Soğuk mendil ve ani hareket. Rahatsızsın; baban elini ovuşturuyor.",
        kategori: "aile",
        oncelik: 70,
        secenekler: [
          { id: "s1", metin: "Tekme atıp protesto et", sonuc: "Baban güldü, annen acele etti.", etkiler: [e("stres", 2)] },
          { id: "s2", metin: "Sakin kal", sonuc: "Hızlı bitti. Rahatladın.", etkiler: [e("mutluluk", 2)] },
        ],
      },
      {
        baslik: "Emzirme Saati",
        aciklama: "Karnın acıktı. Annen seni kaldırıyor; oda loş.",
        kategori: "saglik",
        oncelik: 80,
        secenekler: [
          { id: "s1", metin: "Hemen em", sonuc: "Doydun ve uyudun.", etkiler: [e("saglik", 3), e("mutluluk", 3)] },
          { id: "s2", metin: "Huysuzlan, bırak", sonuc: "Biraz uğraştılar. Sonunda doydun.", etkiler: [e("stres", 3), e("saglik", 1)] },
        ],
      },
    ],
  },
  // ——— BEBEK 1 ———
  {
    id: "bebek-1",
    yasGrubu: "bebek",
    minYas: 1,
    maxYas: 1,
    scenes: [
      {
        baslik: "İlk Adımlar",
        aciklama: "Mobilyaya tutunuyorsun. Bir adım deniyorsun; yer uzak görünüyor.",
        kategori: "yasam",
        oncelik: 85,
        secenekler: [
          { id: "s1", metin: "Cesaretle adım at", sonuc: "Düştün ama kalktın. Ailen alkışladı.", etkiler: [e("ozellik", 3, "guven"), e("mutluluk", 4)] },
          { id: "s2", metin: "Geri çekil, emekle", sonuc: "Güvenli yolu seçtin. Zamanla deneyeceksin.", etkiler: [e("ozellik", 2, "sabir")] },
          { id: "s3", metin: "Ağlayıp kucağa iste", sonuc: "Annen aldı. Cesaretin biraz ertelendi.", etkiler: [e("mutluluk", 2), e("ozellik", -1, "guven")] },
        ],
      },
      {
        baslik: "Katı Gıdaya Geçiş",
        aciklama: "Kaşıktaki püre tuhaf. Tadını bilmiyorsun; yüzünü buruşturuyorsun.",
        kategori: "saglik",
        oncelik: 75,
        secenekler: [
          { id: "s1", metin: "Bir kaşık daha dene", sonuc: "Alışmaya başladın.", etkiler: [e("saglik", 4)] },
          { id: "s2", metin: "Tükür ve başını çevir", sonuc: "Öğle yemeği uzadı. Annen sabırlı.", etkiler: [e("stres", 2)] },
        ],
      },
      {
        baslik: "Yabancı Yüz",
        aciklama: "Misafir amca seni almak istiyor. Kokusu tanıdık değil.",
        kategori: "sosyal",
        oncelik: 65,
        secenekler: [
          { id: "s1", metin: "Annenin arkasına saklan", sonuc: "Güvenli alanın korundu.", etkiler: [e("ozellik", 2, "empati")] },
          { id: "s2", metin: "Merakla uzan", sonuc: "Yeni bir yüz keşfettin.", etkiler: [e("ozellik", 3, "sosyallik")] },
        ],
      },
    ],
  },
  // ——— BEBEK 2 ———
  {
    id: "bebek-2",
    yasGrubu: "bebek",
    minYas: 2,
    maxYas: 2,
    scenes: [
      {
        baslik: "Hayır Dönemi",
        aciklama: "Her şeye 'yok' diyorsun. Baban ayakkabı giydirmek istiyor; sen istemiyorsun.",
        kategori: "aile",
        oncelik: 80,
        secenekler: [
          { id: "s1", metin: "Bağıra bağıra reddet", sonuc: "Kriz çıktı. Sonunda uzlaşma bulundu.", etkiler: [e("stres", 5), e("ozellik", 2, "guven")] },
          { id: "s2", metin: "Seçenek sunulunca kabul et", sonuc: "Kontrol hissi iyi geldi.", etkiler: [e("mutluluk", 3), e("ozellik", 2, "sabir")] },
          { id: "s3", metin: "Saklan", sonuc: "Kovalamaca oldu. Biraz eğlendin.", etkiler: [e("mutluluk", 4)] },
        ],
      },
      {
        baslik: "Tuvalet Eğitimi",
        aciklama: "Bez yerine lazımlık. Garip geliyor; annen teşvik ediyor.",
        kategori: "yasam",
        oncelik: 70,
        secenekler: [
          { id: "s1", metin: "Dene", sonuc: "Küçük bir başarı. Övgü aldın.", etkiler: [e("ozellik", 3, "guven"), e("mutluluk", 3)] },
          { id: "s2", metin: "Bez iste", sonuc: "Baskı azalınca daha rahat denedin.", etkiler: [e("stres", -2)] },
        ],
      },
      {
        baslik: "Parkta Kaydırak",
        aciklama: "Kaydırak yüksek görünüyor. Diğer çocuklar iniyor; sen kenardasın.",
        kategori: "sosyal",
        oncelik: 65,
        secenekler: [
          { id: "s1", metin: "Babanın eliyle in", sonuc: "Korkun azaldı. Tekrar denedin.", etkiler: [e("ozellik", 3, "guven"), e("mutluluk", 4)] },
          { id: "s2", metin: "Kumda oyna", sonuc: "Kendi alanını buldun.", etkiler: [e("mutluluk", 2)] },
        ],
      },
    ],
  },
  // ——— ÇOCUK 3 ———
  {
    id: "cocuk-3",
    yasGrubu: "cocuk",
    minYas: 3,
    maxYas: 3,
    scenes: [
      {
        baslik: "Kreşin İlk Günü",
        aciklama: "Kapıda annen gidiyor. Oda renkli ama yabancı. Öğretmen adını söylüyor.",
        kategori: "egitim",
        oncelik: 90,
        secenekler: [
          { id: "s1", metin: "Ağla ama içeride kal", sonuc: "Öğle oldu; oyunlar dikkatini dağıttı.", etkiler: [e("stres", 4), e("ozellik", 2, "sosyallik")] },
          { id: "s2", metin: "Annenin bacağını bırakma", sonuc: "Ayrılık uzadı. Sonunda içeri girdin.", etkiler: [e("stres", 6), e("mutluluk", -2)] },
          { id: "s3", metin: "Oyuncağa yönel", sonuc: "Merak korkuyu yendi.", etkiler: [e("mutluluk", 4), e("ozellik", 3, "guven")] },
        ],
      },
      {
        baslik: "Paylaşmak İstememek",
        aciklama: "En sevdiğin arabayı başka çocuk alıyor. İçinden bir şey kopuyor.",
        kategori: "sosyal",
        oncelik: 70,
        secenekler: [
          { id: "s1", metin: "Geri almaya çalış", sonuc: "Öğretmen araya girdi. Sıra kuralı öğrendin.", etkiler: [e("stres", 3), e("ozellik", 1, "sabir")] },
          { id: "s2", metin: "Öğretmene söyle", sonuc: "Adil çözüm bulundu.", etkiler: [e("ozellik", 3, "guven")] },
        ],
      },
    ],
  },
  // ——— ÇOCUK 4 ———
  {
    id: "cocuk-4",
    yasGrubu: "cocuk",
    minYas: 4,
    maxYas: 4,
    scenes: [
      {
        baslik: "Yalan mı Gerçek mi",
        aciklama: "Vazoyu sen kırdın. Annen soruyor. Cevabın boğazında düğümleniyor.",
        kategori: "aile",
        oncelik: 75,
        secenekler: [
          { id: "s1", metin: "İtiraf et", sonuc: "Kızgın ama gururlu. Güven kazandın.", etkiler: [e("ozellik", 4, "guven"), e("stres", 2)] },
          { id: "s2", metin: "Kardeşi suçla", sonuc: "Yalan ortaya çıktı. Ceza ağırlaştı.", etkiler: [e("stres", 6), e("ozellik", -3, "guven")] },
          { id: "s3", metin: "Bilmiyorum de", sonuc: "Şüphe kaldı. İçin rahat değil.", etkiler: [e("stres", 4)] },
        ],
      },
      {
        baslik: "Kostüm Günü",
        aciklama: "Anaokulunda kostüm partisi. Sen süper kahraman olmak istiyorsun; kostüm biraz büyük.",
        kategori: "sosyal",
        oncelik: 65,
        secenekler: [
          { id: "s1", metin: "Gururla giy", sonuc: "Alkışlandın. Özgüvenin arttı.", etkiler: [e("mutluluk", 5), e("ozellik", 3, "sosyallik")] },
          { id: "s2", metin: "Kostümü çıkar, utan", sonuc: "Köşede kaldın. Biraz üzgünsün.", etkiler: [e("mutluluk", -2), e("stres", 3)] },
        ],
      },
    ],
  },
  // ——— ÇOCUK 5 ———
  {
    id: "cocuk-5",
    yasGrubu: "cocuk",
    minYas: 5,
    maxYas: 5,
    scenes: [
      {
        baslik: "Okula Hazırlık Heyecanı",
        aciklama: "Çantan alındı. Defterler kokuyor. 'Büyük çocuk' olacaksın diyorsunuz.",
        kategori: "egitim",
        oncelik: 85,
        secenekler: [
          { id: "s1", metin: "Defterleri karıştır, heyecanlan", sonuc: "Motivasyonun yüksek.", etkiler: [e("mutluluk", 4), e("ozellik", 2, "zeka")] },
          { id: "s2", metin: "Korkunu söyle", sonuc: "Ailen seni dinledi. Rahatladın.", etkiler: [e("stres", -3), e("ozellik", 2, "empati")] },
        ],
      },
      {
        baslik: "Gece Korkusu",
        aciklama: "Karanlıkta dolaptan ses geliyor gibi. Uykun kaçtı.",
        kategori: "saglik",
        oncelik: 70,
        secenekler: [
          { id: "s1", metin: "Anne-babayı çağır", sonuc: "Işık açıldı. Güvende hissettin.", etkiler: [e("stres", -4), e("mutluluk", 2)] },
          { id: "s2", metin: "Yorganın altına gir", sonuc: "Sabaha kadar tedirgin uyudun.", etkiler: [e("stres", 5), e("saglik", -2)] },
        ],
      },
    ],
  },
  // ——— İLKOKUL 6-7 ———
  {
    id: "ilkokul-6-7",
    yasGrubu: "ilkokul",
    minYas: 6,
    maxYas: 7,
    scenes: [
      {
        baslik: "Alfabe Sırası",
        aciklama: "Tahtada harfler var. Öğretmen seni kaldırıyor. Sınıf seni izliyor.",
        kategori: "egitim",
        oncelik: 85,
        secenekler: [
          { id: "s1", metin: "Yüksek sesle oku", sonuc: "Alkış aldın. Okuma hevesin arttı.", etkiler: [e("ozellik", 4, "zeka"), e("ozellik", 2, "guven")] },
          { id: "s2", metin: "Fısıltıyla dene", sonuc: "Öğretmen yardımcı oldu. Geçtin.", etkiler: [e("ozellik", 2, "zeka"), e("stres", 2)] },
          { id: "s3", metin: "Sus, bilmiyorum de", sonuc: "Utandın. Eve ödevle döndün.", etkiler: [e("stres", 5), e("ozellik", -2, "guven")] },
        ],
      },
      {
        baslik: "Teneffüste Oyun",
        aciklama: "Kovalamaca başlıyor. Takıma alınmak istiyorsun ama kimse ismini söylemedi.",
        kategori: "sosyal",
        oncelik: 70,
        secenekler: [
          { id: "s1", metin: "Kendini öner", sonuc: "Oyuna girdin. Terledin, mutlu oldun.", etkiler: [e("ozellik", 4, "sosyallik"), e("mutluluk", 4)] },
          { id: "s2", metin: "Kenarda bekle", sonuc: "Sıkıldın. Bir dahaki sefere deneyeceksin.", etkiler: [e("mutluluk", -2)] },
          { id: "s3", metin: "Başka oyun bul", sonuc: "İki kişiyle kendi oyununu kurdun.", etkiler: [e("ozellik", 2, "guven"), e("mutluluk", 2)] },
        ],
      },
      {
        baslik: "Öğle Yemeği Kutusu",
        aciklama: "Kutunda sebze var. Yanındaki çocuğun cips paketi parlıyor.",
        kategori: "saglik",
        oncelik: 55,
        secenekler: [
          { id: "s1", metin: "Kendi yemeğini ye", sonuc: "Annenin emeğini düşündün. İyi ettin.", etkiler: [e("saglik", 3), e("ozellik", 2, "sabir")] },
          { id: "s2", metin: "Takas teklif et", sonuc: "Biraz cips, biraz sebze. İkiniz de memnun.", etkiler: [e("ozellik", 2, "sosyallik"), e("mutluluk", 2)] },
          { id: "s3", metin: "Yeme, at", sonuc: "Aç kaldın. Öğleden sonra halsizsin.", etkiler: [e("saglik", -3), e("stres", 2)] },
        ],
      },
    ],
  },
  // ——— İLKOKUL 8-9 ———
  {
    id: "ilkokul-8-9",
    yasGrubu: "ilkokul",
    minYas: 8,
    maxYas: 9,
    scenes: [
      {
        baslik: "Sınıf Başkanlığı",
        aciklama: "Öğretmen aday istiyor. Arkadaşların seni itiyor; sen emin değilsin.",
        kategori: "egitim",
        oncelik: 75,
        secenekler: [
          { id: "s1", metin: "Aday ol", sonuc: "Seçildin. Sorumluluk ağır ama gururlu.", etkiler: [e("ozellik", 5, "guven"), e("stres", 4)] },
          { id: "s2", metin: "Başkasını destekle", sonuc: "İyi bir dost oldun.", etkiler: [e("ozellik", 3, "empati"), e("ozellik", 2, "sosyallik")] },
          { id: "s3", metin: "Sessiz kal", sonuc: "Fırtına geçti. İçinde 'keşke' kaldı.", etkiler: [e("stres", 1)] },
        ],
      },
      {
        baslik: "Ödevi Unuttun",
        aciklama: "Defter evde. Öğretmen kontrol ediyor. Kalbin hızlı atıyor.",
        kategori: "egitim",
        oncelik: 80,
        secenekler: [
          { id: "s1", metin: "Dürüstçe söyle", sonuc: "Uyarı aldın ama saygı kazandın.", etkiler: [e("ozellik", 3, "guven"), e("stres", 3)] },
          { id: "s2", metin: "Hastaydım de", sonuc: "Yalanın belli oldu. Notun düştü.", etkiler: [e("stres", 7), e("ozellik", -3, "guven")] },
          { id: "s3", metin: "Arkadaşından kopya iste", sonuc: "Yakalandınız. İkiniz de uyarı aldınız.", etkiler: [e("stres", 8), e("ozellik", -2, "empati")] },
        ],
      },
      {
        baslik: "Takım Seçimi",
        aciklama: "Beden dersinde kaptanlar seçiyor. Sona kaldın.",
        kategori: "sosyal",
        oncelik: 65,
        secenekler: [
          { id: "s1", metin: "Gülümse, kabullen", sonuc: "Oyunda iyi iş çıkardın. Saygın arttı.", etkiler: [e("ozellik", 3, "sabir"), e("mutluluk", 2)] },
          { id: "s2", metin: "İçine kapan", sonuc: "Keyfin kaçtı. Ders boyunca sessizdin.", etkiler: [e("mutluluk", -4), e("stres", 4)] },
          { id: "s3", metin: "Sonraki maçta daha çok çalışacağına karar ver", sonuc: "Motivasyon buldun.", etkiler: [e("ozellik", 3, "guven"), e("saglik", 2)] },
        ],
      },
    ],
  },
  // ——— İLKOKUL 10-12 ———
  {
    id: "ilkokul-10-12",
    yasGrubu: "ilkokul",
    minYas: 10,
    maxYas: 12,
    scenes: [
      {
        baslik: "Grup Ödevi Krizi",
        aciklama: "Sunum yarın. Bir arkadaşın kısmını yapmamış. Grup dağılıyor.",
        kategori: "egitim",
        oncelik: 80,
        secenekler: [
          { id: "s1", metin: "Onun kısmını da sen bitir", sonuc: "Not yüksek ama yorgunsun; için yanıyor.", etkiler: [e("ozellik", 3, "zeka"), e("stres", 6), e("ozellik", 2, "sabir")] },
          { id: "s2", metin: "Öğretmene durumu anlat", sonuc: "Adil çözüm geldi. İlişki gerildi.", etkiler: [e("ozellik", 3, "guven"), e("stres", 3)] },
          { id: "s3", metin: "Grubu dağıt, yalnız sun", sonuc: "Cesurca yaptın. Not orta çıktı.", etkiler: [e("ozellik", 4, "guven"), e("ozellik", -2, "sosyallik")] },
        ],
      },
      {
        baslik: "Telefon İsteği",
        aciklama: "Sınıftaki herkesin telefonu var gibi. Sen aileden istiyorsun.",
        kategori: "aile",
        oncelik: 70,
        secenekler: [
          { id: "s1", metin: "Sorumluluk karşılığı pazarlık et", sonuc: "Eski bir telefon aldın. Kurallar net.", etkiler: [e("ozellik", 3, "guven"), e("mutluluk", 3)] },
          { id: "s2", metin: "Ağlayıp ısrar et", sonuc: "Tartışma büyüdü. Cevap hayır.", etkiler: [e("stres", 6), e("mutluluk", -3)] },
          { id: "s3", metin: "Ertele, arkadaşın tabletini paylaş", sonuc: "İdare ediyorsun. Kıskançlık azaldı.", etkiler: [e("ozellik", 2, "sabir")] },
        ],
      },
      {
        baslik: "Sınav Kaygısı",
        aciklama: "Matematik sınavı yarın. Miden bulanıyor; uykun kaçtı.",
        kategori: "saglik",
        oncelik: 75,
        secenekler: [
          { id: "s1", metin: "Kısa tekrar + erken yat", sonuc: "Sınav idare etti. Vücudun teşekkür etti.", etkiler: [e("ozellik", 3, "zeka"), e("saglik", 2), e("stres", -2)] },
          { id: "s2", metin: "Gece yarısına kadar ezberle", sonuc: "Sabah sersemsin. Bazı sorular uçtu.", etkiler: [e("ozellik", 2, "zeka"), e("saglik", -4), e("stres", 5)] },
          { id: "s3", metin: "Oyuna kaç", sonuc: "Rahatladın ama sınav kötü geçti.", etkiler: [e("mutluluk", 2), e("ozellik", -3, "zeka"), e("stres", 4)] },
        ],
      },
    ],
  },
  // ——— ERGEN 13-14 ———
  {
    id: "ergen-13-14",
    yasGrubu: "ergen",
    minYas: 13,
    maxYas: 14,
    scenes: [
      {
        baslik: "Ortaokul Koridoru",
        aciklama: "Büyükler geçerken omuz atıyor. Çantan yere düştü; gülenler var.",
        kategori: "sosyal",
        oncelik: 75,
        secenekler: [
          { id: "s1", metin: "Topla, yürü, umursama", sonuc: "Onurunu korudun. İçin biraz yandı.", etkiler: [e("ozellik", 3, "sabir"), e("stres", 3)] },
          { id: "s2", metin: "Sertçe karşılık ver", sonuc: "Kavga neredeyse çıktı. Öğretmen ayırdı.", etkiler: [e("stres", 8), e("ozellik", 2, "guven"), e("ozellik", -2, "empati")] },
          { id: "s3", metin: "Arkadaşına anlat, destek al", sonuc: "Yalnız olmadığını hissettin.", etkiler: [e("ozellik", 3, "sosyallik"), e("mutluluk", 2)] },
        ],
      },
      {
        baslik: "İlk Ciddi Beğeni",
        aciklama: "Sınıfta biriyle göz göze geliyorsun. Mesaj yazmak istiyorsun ama parmakların titriyor.",
        kategori: "romantik",
        oncelik: 70,
        secenekler: [
          { id: "s1", metin: "Selam mesajı at", sonuc: "Cevap geldi. Küçük bir kıpırtı başladı.", etkiler: [e("mutluluk", 5), e("ozellik", 2, "sosyallik"), e("stres", 2)] },
          { id: "s2", metin: "Arkadaşın aracılığıyla sor", sonuc: "Biraz utanç, biraz ilerleme.", etkiler: [e("mutluluk", 3), e("stres", 3)] },
          { id: "s3", metin: "Hiçbir şey yapma", sonuc: "Hayal dünyanda kaldı. Gerçek değişmedi.", etkiler: [e("stres", 2)] },
        ],
      },
      {
        baslik: "Aileyle Oda Kavgası",
        aciklama: "Kapını kilitlemek istiyorsun. Annen 'açık kalsın' diyor. Özel alan tartışması.",
        kategori: "aile",
        oncelik: 80,
        secenekler: [
          { id: "s1", metin: "Sakin sınır koy", sonuc: "Yarım uzlaşma: kapı aralık, saygı var.", etkiler: [e("ozellik", 4, "guven"), e("stres", -2)] },
          { id: "s2", metin: "Kapıyı çarp", sonuc: "Ceza geldi. Gerilim arttı.", etkiler: [e("stres", 7), e("mutluluk", -4)] },
          { id: "s3", metin: "Sus, içeride öfkelen", sonuc: "İçine attın. Uykun bozuldu.", etkiler: [e("stres", 5), e("saglik", -2)] },
        ],
      },
    ],
  },
  // ——— ERGEN 15-16 ———
  {
    id: "ergen-15-16",
    yasGrubu: "ergen",
    minYas: 15,
    maxYas: 16,
    scenes: [
      {
        baslik: "Lise Parti Daveti",
        aciklama: "Hafta sonu ev partisi. Ailen 'kimlerin evi?' diye soruyor. Sen detay vermek istemiyorsun.",
        kategori: "sosyal",
        oncelik: 80,
        secenekler: [
          { id: "s1", metin: "Dürüst anlat, izin al", sonuc: "Erken dönüş şartıyla gittin. Keyifliydi.", etkiler: [e("mutluluk", 5), e("ozellik", 2, "guven"), e("stres", 2)] },
          { id: "s2", metin: "Yalan söyle, git", sonuc: "Yakalandın. Güven sarsıldı.", etkiler: [e("stres", 9), e("ozellik", -4, "guven"), e("mutluluk", -3)] },
          { id: "s3", metin: "Gitme, film gecesi yap", sonuc: "Sakin bir gece. FOMO var ama pişman değilsin.", etkiler: [e("mutluluk", 2), e("stres", -2)] },
        ],
      },
      {
        baslik: "Dershane Baskısı",
        aciklama: "Deneme sonucu düşük. Koç 'daha çok soru' diyor. Gözlerin yanıyor.",
        kategori: "egitim",
        oncelik: 85,
        secenekler: [
          { id: "s1", metin: "Programı yeniden kur", sonuc: "Tempo arttı. Ufak ilerleme gördün.", etkiler: [e("ozellik", 5, "zeka"), e("stres", 5), e("saglik", -2)] },
          { id: "s2", metin: "Aileye 'yeter' de", sonuc: "Tartışma oldu ama nefes aldın.", etkiler: [e("stres", -3), e("ozellik", 3, "guven"), e("ozellik", -1, "zeka")] },
          { id: "s3", metin: "Ertele, telefona gömül", sonuc: "Kaygı büyüdü. Sonraki deneme daha kötü.", etkiler: [e("stres", 8), e("ozellik", -3, "zeka"), e("mutluluk", -2)] },
        ],
      },
      {
        baslik: "İlk İş Teklifi",
        aciklama: "Mahalledeki kafede hafta sonu garsonluk. Harçlık için cazip; okul için riskli.",
        kategori: "finans",
        oncelik: 65,
        secenekler: [
          { id: "s1", metin: "Kabul et, dengele", sonuc: "Küçük gelir + yorgunluk. Dersler idare etti.", etkiler: [e("para", 400), e("stres", 4), e("ozellik", 2, "guven")] },
          { id: "s2", metin: "Reddet, okula odaklan", sonuc: "Ailen takdir etti. Cebin boş kaldı.", etkiler: [e("ozellik", 2, "zeka"), e("mutluluk", 1)] },
          { id: "s3", metin: "Aileye danış", sonuc: "Ortak karar: kısa vardiya.", etkiler: [e("para", 200), e("ozellik", 2, "empati"), e("stres", 2)] },
        ],
      },
    ],
  },
  // ——— ERGEN 17 ———
  {
    id: "ergen-17",
    yasGrubu: "ergen",
    minYas: 17,
    maxYas: 17,
    scenes: [
      {
        baslik: "Tercih Robotu Gecesi",
        aciklama: "Üniversite tercihleri. Ailen 'güvenli bölüm' diyor; sen başka hayal kuruyorsun.",
        kategori: "egitim",
        oncelik: 95,
        secenekler: [
          { id: "s1", metin: "Kendi listenı savun", sonuc: "Risk aldın. İçin rahat, ailen tedirgin.", etkiler: [e("ozellik", 5, "guven"), e("stres", 5)] },
          { id: "s2", metin: "Ailenin listesine uy", sonuc: "Barış sağlandı. İçinde soru işareti kaldı.", etkiler: [e("stres", -2), e("mutluluk", -2), e("ozellik", 1, "sabir")] },
          { id: "s3", metin: "Orta yol bul", sonuc: "Hem güvenli hem bir hayal sırası koydun.", etkiler: [e("ozellik", 3, "zeka"), e("stres", 2)] },
        ],
      },
      {
        baslik: "Mezuniyet Töreni",
        aciklama: "Kep atılıyor. Arkadaşların ağlıyor. Bir dönem kapanıyor.",
        kategori: "yasam",
        oncelik: 80,
        secenekler: [
          { id: "s1", metin: "Herkesle fotoğraf çekil", sonuc: "Anılar birikti. Veda yumuşadı.", etkiler: [e("mutluluk", 6), e("ozellik", 3, "sosyallik")] },
          { id: "s2", metin: "Erken ayrıl", sonuc: "Kalabalık boğdu. Evde düşündün.", etkiler: [e("stres", -2), e("mutluluk", 1)] },
        ],
      },
      {
        baslik: "İlişki mi Yollar mı",
        aciklama: "Lise aşkın farklı şehirlere gidebilirsiniz. 'Ne olacağız?' sorusu masada.",
        kategori: "romantik",
        oncelik: 70,
        secenekler: [
          { id: "s1", metin: "Uzaktan denemeyi teklif et", sonuc: "Umut var ama belirsizlik de.", etkiler: [e("mutluluk", 3), e("stres", 4), e("ozellik", 2, "sevgi")] },
          { id: "s2", metin: "Temiz bir veda yap", sonuc: "Acıdı ama netlik geldi.", etkiler: [e("mutluluk", -5), e("ozellik", 3, "guven"), e("stres", 3)] },
          { id: "s3", metin: "Konuyu ertele", sonuc: "Yaz boyunca gerginlik sürdü.", etkiler: [e("stres", 6)] },
        ],
      },
    ],
  },
  // ——— GENÇ 18-19 ———
  {
    id: "genc-18-19",
    yasGrubu: "genc",
    minYas: 18,
    maxYas: 19,
    scenes: [
      {
        baslik: "Yurt Odası",
        aciklama: "İlk gece yurtta. Oda arkadaşı müzik açtı; sen uyumak istiyorsun. Ev özlemi bastırıyor.",
        kategori: "yasam",
        oncelik: 85,
        secenekler: [
          { id: "s1", metin: "Kulaklık tak, sınır koy", sonuc: "Saygı çerçevesi oluştu.", etkiler: [e("ozellik", 3, "guven"), e("stres", -2)] },
          { id: "s2", metin: "Tartış", sonuc: "İlk gece gerilimli geçti.", etkiler: [e("stres", 6), e("ozellik", -1, "sosyallik")] },
          { id: "s3", metin: "Anneni ara, ağla", sonuc: "Özlem boşaldı. Yarın daha iyi olacak.", etkiler: [e("mutluluk", 2), e("stres", -3)] },
        ],
      },
      {
        baslik: "İlk Maaş / Burs",
        aciklama: "Hesabına ilk kez kendi paran yattı. Ailene mi yollasan, biriktirsen mi, harcasan mı?",
        kategori: "finans",
        oncelik: 80,
        secenekler: [
          { id: "s1", metin: "Yarıyı biriktir, yarıyı idareli harca", sonuc: "Disiplinli başlangıç.", etkiler: [e("para", 800), e("ozellik", 3, "sabir")] },
          { id: "s2", metin: "Arkadaşlarla kutla", sonuc: "Güzel anı, ince cüzdan.", etkiler: [e("mutluluk", 5), e("para", -600), e("ozellik", 2, "sosyallik")] },
          { id: "s3", metin: "Ailene destek gönder", sonuc: "Gurur duydular. Senin bütçen daraldı.", etkiler: [e("ozellik", 4, "comertlik"), e("para", -400), e("mutluluk", 3)] },
        ],
      },
      {
        baslik: "Seçmen Kartı",
        aciklama: "İlk kez oy kullanma yaşındasın. Sandık kurulu; sosyal medya kaynıyor.",
        kategori: "yasam",
        oncelik: 60,
        secenekler: [
          { id: "s1", metin: "Araştırıp oyunu kullan", sonuc: "Vatandaşlık hissi güçlendi.", etkiler: [e("ozellik", 3, "guven"), e("stres", -1)] },
          { id: "s2", metin: "Gitme, 'bir şey değişmez' de", sonuc: "İçinde boşluk kaldı.", etkiler: [e("stres", 2)] },
        ],
      },
    ],
  },
  // ——— GENÇ 20-22 ———
  {
    id: "genc-20-22",
    yasGrubu: "genc",
    minYas: 20,
    maxYas: 22,
    scenes: [
      {
        baslik: "Staj Değerlendirmesi",
        aciklama: "Yönetici 'sorumluluk alabilir misin?' diye soruyor. Takım izliyor.",
        kategori: "kariyer",
        oncelik: 85,
        secenekler: [
          { id: "s1", metin: "Evet de, teslim tarihini netleştir", sonuc: "İlk gerçek görev. Stres + itibar.", etkiler: [e("ozellik", 5, "guven"), e("stres", 5), e("para", 1500)] },
          { id: "s2", metin: "Henüz hazır değilim de", sonuc: "Dürüstlük takdir edildi ama fırsat kaçtı.", etkiler: [e("ozellik", 2, "guven"), e("stres", -2)] },
          { id: "s3", metin: "Abartılı söz ver", sonuc: "Yetiştiremedin. İtibar çizildi.", etkiler: [e("stres", 9), e("ozellik", -3, "guven")] },
        ],
      },
      {
        baslik: "Ortak Ev Arayışı",
        aciklama: "Kira ilanları uçmuş. İki arkadaşınla ev bakıyorsunuz; depozito sorun.",
        kategori: "finans",
        oncelik: 75,
        secenekler: [
          { id: "s1", metin: "Uzak ama ucuz evi kabul et", sonuc: "Ulaşım yorucu, bütçe rahat.", etkiler: [e("para", -3000), e("stres", 4), e("mutluluk", 2)] },
          { id: "s2", metin: "Merkeze yakın, bütçeyi zorla", sonuc: "Sosyal hayat canlı, ay sonu korkutucu.", etkiler: [e("para", -7000), e("mutluluk", 4), e("stres", 6)] },
          { id: "s3", metin: "Bir yıl daha aile yanında kal", sonuc: "Biriktirdin ama özgürlük ertelendi.", etkiler: [e("para", 2000), e("stres", 3)] },
        ],
      },
      {
        baslik: "Ciddi İlişki Konuşması",
        aciklama: "Partnerin 'gelecek planımız ne?' diye soruyor. Sen kariyere odaklanmak istiyorsun.",
        kategori: "romantik",
        oncelik: 70,
        secenekler: [
          { id: "s1", metin: "Açık zaman çizelgesi ver", sonuc: "Güven arttı. Baskı azaldı.", etkiler: [e("mutluluk", 5), e("ozellik", 3, "sevgi"), e("stres", -2)] },
          { id: "s2", metin: "Belirsiz cevap ver", sonuc: "Soğukluk başladı.", etkiler: [e("mutluluk", -4), e("stres", 5)] },
          { id: "s3", metin: "Ara verelim de", sonuc: "Ayrıldınız. Boşluk ve rahatlama bir arada.", etkiler: [e("mutluluk", -6), e("stres", 4), e("ozellik", 2, "guven")] },
        ],
      },
    ],
  },
  // ——— GENÇ 23-25 ———
  {
    id: "genc-23-25",
    yasGrubu: "genc",
    minYas: 23,
    maxYas: 25,
    scenes: [
      {
        baslik: "İlk Tam Zamanlı İş",
        aciklama: "Sözleşme masada. SGK, mesai, deneme süresi. Kariyerin resmi başlangıcı.",
        kategori: "kariyer",
        oncelik: 90,
        secenekler: [
          { id: "s1", metin: "İmzala, öğrenmeye odaklan", sonuc: "Tempo yüksek ama rayına oturdun.", etkiler: [e("para", 12000), e("stres", 6), e("ozellik", 4, "guven")] },
          { id: "s2", metin: "Pazarlık et", sonuc: "Küçük zam kaptın. Cesaretin arttı.", etkiler: [e("para", 15000), e("ozellik", 5, "guven"), e("stres", 4)] },
          { id: "s3", metin: "Başka teklifi bekle", sonuc: "Riskli bekleyiş. Kaygı büyüdü.", etkiler: [e("stres", 7), e("para", -1000)] },
        ],
      },
      {
        baslik: "Askerlik / Muafiyet Planı",
        aciklama: "Çevrende herkes farklı yol seçiyor. Senin kararın da netleşmeli.",
        kategori: "yasam",
        oncelik: 55,
        secenekler: [
          { id: "s1", metin: "Takvimi netleştir", sonuc: "Belirsizlik azaldı.", etkiler: [e("stres", -4), e("ozellik", 2, "guven")] },
          { id: "s2", metin: "Ertele, kariyere bak", sonuc: "Zaman kazandın; soru işareti duruyor.", etkiler: [e("stres", 3)] },
        ],
      },
      {
        baslik: "Tükenmişlik İşareti",
        aciklama: "Pazartesi sabahı yataktan kalkmak istemiyorsun. İş dışındaki hiçbir şey keyif vermiyor.",
        kategori: "saglik",
        oncelik: 70,
        secenekler: [
          { id: "s1", metin: "İzin al, dinlen", sonuc: "Kısa nefes. Biraz toparlandın.", etkiler: [e("saglik", 5), e("stres", -5)] },
          { id: "s2", metin: "Spor + uyku düzeni kur", sonuc: "Yavaş iyileşme başladı.", etkiler: [e("saglik", 6), e("stres", -3)] },
          { id: "s3", metin: "Görmezden gel, kahve ile idare et", sonuc: "Daha derine battın.", etkiler: [e("saglik", -6), e("stres", 8)] },
        ],
      },
    ],
  },
  // ——— YETİŞKİN 26-30 ———
  {
    id: "yetiskin-26-30",
    yasGrubu: "yetiskin",
    minYas: 26,
    maxYas: 30,
    scenes: [
      {
        baslik: "Terfi mi İş Değişikliği mi",
        aciklama: "Şirket terfi teklif ediyor ama başka yerden daha yüksek maaş geldi.",
        kategori: "kariyer",
        oncelik: 85,
        secenekler: [
          { id: "s1", metin: "Terfiyi kabul et", sonuc: "Statü arttı. Maaş artışı sınırlı.", etkiler: [e("ozellik", 4, "guven"), e("para", 8000), e("stres", 4)] },
          { id: "s2", metin: "Yeni işe geç", sonuc: "Gelir arttı. Yeni ortam stresi var.", etkiler: [e("para", 18000), e("stres", 7), e("ozellik", 3, "guven")] },
          { id: "s3", metin: "Karşı teklif sun", sonuc: "Mevcut yerde zam kaptın.", etkiler: [e("para", 14000), e("ozellik", 5, "guven"), e("stres", 5)] },
        ],
      },
      {
        baslik: "Evlilik Baskısı",
        aciklama: "Düğün soruları her aile yemeğinde. Partnerinle zamanlama konuşulmamış.",
        kategori: "aile",
        oncelik: 70,
        secenekler: [
          { id: "s1", metin: "Partnerinle net konuş", sonuc: "Ortak yol haritası çıktı.", etkiler: [e("mutluluk", 5), e("ozellik", 3, "sevgi"), e("stres", -2)] },
          { id: "s2", metin: "Aileye sınır koy", sonuc: "Rahatladın; bazı akrabalar kırıldı.", etkiler: [e("ozellik", 4, "guven"), e("stres", -3)] },
          { id: "s3", metin: "Konuyu savuştur", sonuc: "Baskı devam ediyor.", etkiler: [e("stres", 6)] },
        ],
      },
      {
        baslik: "İlk Ev Kredisi Düşüncesi",
        aciklama: "Kira bitmiyor. Bankacı dosya istiyor. Peşinat hesabın sınırda.",
        kategori: "finans",
        oncelik: 75,
        secenekler: [
          { id: "s1", metin: "Dosya aç, risk al", sonuc: "Süreç başladı. Ay taksitleri baskı yapacak.", etkiler: [e("stres", 6), e("ozellik", 3, "guven"), e("para", -5000)] },
          { id: "s2", metin: "Bir yıl daha biriktir", sonuc: "Sabırlı plan. Kira devam.", etkiler: [e("para", 4000), e("ozellik", 2, "sabir")] },
          { id: "s3", metin: "Daha küçük eve bak", sonuc: "Gerçekçi bir orta yol.", etkiler: [e("stres", 3), e("mutluluk", 2)] },
        ],
      },
    ],
  },
  // ——— YETİŞKİN 31-35 ———
  {
    id: "yetiskin-31-35",
    yasGrubu: "yetiskin",
    minYas: 31,
    maxYas: 35,
    scenes: [
      {
        baslik: "Çocuk Planı",
        aciklama: "Saat tikliyor gibi hissediyorsun. Ekonomik belirsizlik var; kalbin karışık.",
        kategori: "aile",
        oncelik: 80,
        secenekler: [
          { id: "s1", metin: "Hazırlanmaya başla", sonuc: "Kontroller ve bütçe planı. Heyecan + korku.", etkiler: [e("stres", 4), e("mutluluk", 4), e("ozellik", 3, "sevgi")] },
          { id: "s2", metin: "Ertele, kariyere bak", sonuc: "Zaman kazandın. İçinde boşluk var.", etkiler: [e("stres", 3), e("ozellik", 2, "guven")] },
          { id: "s3", metin: "Partnerinle terapiye git", sonuc: "Konuşmak iyi geldi. Netlik arttı.", etkiler: [e("ozellik", 4, "empati"), e("stres", -3), e("para", -2000)] },
        ],
      },
      {
        baslik: "Orta Kademe Krizi",
        aciklama: "Ne junior ne yönetici. Sıkışmış hissediyorsun. LinkedIn'de herkes 'başarıyor'.",
        kategori: "kariyer",
        oncelik: 75,
        secenekler: [
          { id: "s1", metin: "Beceri yatırımı yap (kurs)", sonuc: "Yorucu ama umutlu.", etkiler: [e("ozellik", 5, "zeka"), e("para", -4000), e("stres", 3)] },
          { id: "s2", metin: "Şirket içi proje iste", sonuc: "Görünür oldun.", etkiler: [e("ozellik", 4, "guven"), e("stres", 4)] },
          { id: "s3", metin: "Şikayet et, hiçbir şey yapma", sonuc: "Morale indin.", etkiler: [e("mutluluk", -5), e("stres", 6)] },
        ],
      },
      {
        baslik: "Sağlık Check-up",
        aciklama: "Kan değerlerinde uyarı. Doktor 'hareket ve uyku' diyor. Masabaşı yaşamın faturası.",
        kategori: "saglik",
        oncelik: 70,
        secenekler: [
          { id: "s1", metin: "Rutin değiştir", sonuc: "Üç ayda fark görünüyor.", etkiler: [e("saglik", 8), e("stres", -3)] },
          { id: "s2", metin: "İlaçla idare et", sonuc: "Semptom yatıştı; kök neden duruyor.", etkiler: [e("saglik", 3), e("para", -1500)] },
          { id: "s3", metin: "Ertele", sonuc: "Yorgunluk arttı.", etkiler: [e("saglik", -7), e("stres", 4)] },
        ],
      },
    ],
  },
  // ——— YETİŞKİN 36-40 ———
  {
    id: "yetiskin-36-40",
    yasGrubu: "yetiskin",
    minYas: 36,
    maxYas: 40,
    scenes: [
      {
        baslik: "Okul Velisi Olmak",
        aciklama: "Çocuğunun öğretmeni toplantıya çağırdı. Davranış veya not konuşulacak.",
        kategori: "aile",
        oncelik: 80,
        secenekler: [
          { id: "s1", metin: "Dinle, evde destek planı kur", sonuc: "Çocuk rahatladı. Sen yoruldun ama bağ güçlendi.", etkiler: [e("ozellik", 4, "empati"), e("stres", 4), e("mutluluk", 2)] },
          { id: "s2", metin: "Öğretmeni suçla", sonuc: "İlişki bozuldu. Çözüm gelmedi.", etkiler: [e("stres", 7), e("ozellik", -2, "empati")] },
          { id: "s3", metin: "İş yüzünden iptal et", sonuc: "Suçluluk büyüdü.", etkiler: [e("stres", 5), e("mutluluk", -4)] },
        ],
      },
      {
        baslik: "Ebeveynlerin Sağlığı",
        aciklama: "Annen/baban hastanede. Bakım, izin, kardeşlerle görev paylaşımı konuşuluyor.",
        kategori: "aile",
        oncelik: 85,
        secenekler: [
          { id: "s1", metin: "İzin al, yanında ol", sonuc: "Bağ güçlendi. İşte yük arttı.", etkiler: [e("ozellik", 4, "sevgi"), e("stres", 6), e("para", -3000)] },
          { id: "s2", metin: "Bakıcı / destek ayarla", sonuc: "Pratik çözüm. İçinde pişmanlık var.", etkiler: [e("para", -8000), e("stres", 4), e("ozellik", 2, "sabir")] },
          { id: "s3", metin: "Kardeşlere bırak", sonuc: "Aile içinde kırgınlık doğdu.", etkiler: [e("stres", 5), e("ozellik", -3, "empati")] },
        ],
      },
      {
        baslik: "Yan Gelir Fikri",
        aciklama: "Freelance veya küçük bir yan iş fikrin var. Zamanın kısıtlı.",
        kategori: "finans",
        oncelik: 65,
        secenekler: [
          { id: "s1", metin: "Haftada 5 saat dene", sonuc: "Küçük ek gelir. Uyku azaldı.", etkiler: [e("para", 6000), e("stres", 5), e("saglik", -2)] },
          { id: "s2", metin: "Ertele", sonuc: "Fikir rafta kaldı.", etkiler: [e("stres", 1)] },
          { id: "s3", metin: "Ortak bul, paylaş", sonuc: "Yük azaldı. Kazanç paylaşıldı.", etkiler: [e("para", 3500), e("ozellik", 3, "sosyallik"), e("stres", 3)] },
        ],
      },
    ],
  },
  // ——— ORTA YAŞ 41-50 ———
  {
    id: "orta-41-50",
    yasGrubu: "orta_yas",
    minYas: 41,
    maxYas: 50,
    scenes: [
      {
        baslik: "Kırkın Ortasında Sorgular",
        aciklama: "Ayna ve eski fotoğraflar. 'Doğru yolda mıyım?' sorusu gece yarısı geliyor.",
        kategori: "yasam",
        oncelik: 80,
        secenekler: [
          { id: "s1", metin: "Küçük bir değişim başlat (hobi/spor)", sonuc: "Hayat yeniden renk aldı.", etkiler: [e("mutluluk", 6), e("saglik", 4), e("stres", -3)] },
          { id: "s2", metin: "Kariyeri kökten sorgula", sonuc: "Cesur ama sarsıcı bir dönem.", etkiler: [e("stres", 8), e("ozellik", 4, "guven")] },
          { id: "s3", metin: "Rutine tutun", sonuc: "Güvenli ama donuk.", etkiler: [e("stres", 2), e("mutluluk", -2)] },
        ],
      },
      {
        baslik: "Ergen Çocukla Çatışma",
        aciklama: "Kapılar çarpılıyor. Sen 'benim zamanımda' diyorsun; o 'anlamıyorsun' diyor.",
        kategori: "aile",
        oncelik: 85,
        secenekler: [
          { id: "s1", metin: "Dinle, yargısız soru sor", sonuc: "Buzlar çözüldü biraz.", etkiler: [e("ozellik", 5, "empati"), e("mutluluk", 3), e("stres", -2)] },
          { id: "s2", metin: "Ceza ver", sonuc: "İtaat kısa sürdü. Mesafe arttı.", etkiler: [e("stres", 6), e("ozellik", -2, "sevgi")] },
          { id: "s3", metin: "Eşinle ortak strateji kur", sonuc: "Tutarlılık geldi.", etkiler: [e("ozellik", 3, "sabir"), e("stres", -3)] },
        ],
      },
      {
        baslik: "Şirkette Küçülme",
        aciklama: "Resmi olmayan söylentiler: bazı ekipler gidecek. CV'ni güncellemek ister misin?",
        kategori: "kariyer",
        oncelik: 75,
        secenekler: [
          { id: "s1", metin: "Sessizce iş ara", sonuc: "Hazırlıklısın. Stres yönetilebilir.", etkiler: [e("stres", 4), e("ozellik", 3, "guven")] },
          { id: "s2", metin: "Yöneticinle net konuş", sonuc: "Netlik kazandın.", etkiler: [e("ozellik", 4, "guven"), e("stres", 3)] },
          { id: "s3", metin: "Görmezden gel", sonuc: "Belirsizlik ruhunu bozdu.", etkiler: [e("stres", 9), e("mutluluk", -4)] },
        ],
      },
    ],
  },
  // ——— ORTA YAŞ 51-60 ———
  {
    id: "orta-51-60",
    yasGrubu: "orta_yas",
    minYas: 51,
    maxYas: 60,
    scenes: [
      {
        baslik: "Emeklilik Hesabı",
        aciklama: "SGK dökümü ve birikim. Rakamlar umduğun gibi değil. Sağlık harcamaları artıyor.",
        kategori: "finans",
        oncelik: 90,
        secenekler: [
          { id: "s1", metin: "Planı yeniden yap", sonuc: "Netlik geldi. Harcama disiplini başlıyor.", etkiler: [e("stres", -4), e("ozellik", 3, "sabir")] },
          { id: "s2", metin: "Ek iş düşün", sonuc: "Gelir arttı, yorgunluk da.", etkiler: [e("para", 10000), e("stres", 6), e("saglik", -3)] },
          { id: "s3", metin: "Ertele", sonuc: "Kaygı birikti.", etkiler: [e("stres", 8)] },
        ],
      },
      {
        baslik: "Boş Yuva",
        aciklama: "Çocuklar evden gitti. Akşamlar sessiz. Eşinle bakışıyorsunuz.",
        kategori: "aile",
        oncelik: 75,
        secenekler: [
          { id: "s1", metin: "Birlikte yeni rutin kur", sonuc: "İlişki yeniden ısındı.", etkiler: [e("mutluluk", 6), e("ozellik", 4, "sevgi")] },
          { id: "s2", metin: "İşe daha çok gömül", sonuc: "Boşluk doldu ama ev soğuk.", etkiler: [e("para", 5000), e("mutluluk", -3), e("stres", 4)] },
          { id: "s3", metin: "Torun / hobilerle doldur", sonuc: "Anlam buldun.", etkiler: [e("mutluluk", 5), e("ozellik", 2, "sosyallik")] },
        ],
      },
      {
        baslik: "Kronik Ağrı",
        aciklama: "Bel veya diz. Basit hareketler zor. Doktor fizik tedavi öneriyor.",
        kategori: "saglik",
        oncelik: 80,
        secenekler: [
          { id: "s1", metin: "Tedaviye başla", sonuc: "Yavaş iyileşme. Disiplin lazım.", etkiler: [e("saglik", 7), e("para", -4000), e("stres", 2)] },
          { id: "s2", metin: "Ağrı kesiciyle idare et", sonuc: "Kısa rahatlama. Sorun büyüyor.", etkiler: [e("saglik", -3), e("stres", 3)] },
          { id: "s3", metin: "Hareketi kes, dinlen", sonuc: "Kaslar daha da zayıfladı.", etkiler: [e("saglik", -5), e("mutluluk", -2)] },
        ],
      },
    ],
  },
  // ——— YAŞLI 61-70 ———
  {
    id: "yasli-61-70",
    yasGrubu: "yasli",
    minYas: 61,
    maxYas: 70,
    scenes: [
      {
        baslik: "Emekliliğin İlk Ayı",
        aciklama: "Çalar saat yok. Takvim boş. Bir yanda huzur, bir yanda 'ben kimim?' sorusu.",
        kategori: "yasam",
        oncelik: 90,
        secenekler: [
          { id: "s1", metin: "Gönüllü / kurs bul", sonuc: "Yeni bir ritim doğdu.", etkiler: [e("mutluluk", 6), e("ozellik", 3, "sosyallik"), e("stres", -3)] },
          { id: "s2", metin: "Torunlara daha çok zaman ayır", sonuc: "Bağ güçlendi. Yorgun ama mutlu.", etkiler: [e("mutluluk", 7), e("ozellik", 3, "sevgi"), e("saglik", -1)] },
          { id: "s3", metin: "Televizyona gömül", sonuc: "Günler kaydı. Moral düştü.", etkiler: [e("mutluluk", -4), e("saglik", -3)] },
        ],
      },
      {
        baslik: "İlaç Kutusu",
        aciklama: "Sabah-öğle-akşam ilaçlar. Bazen karıştırıyorsun. Çocukların hatırlatıyor.",
        kategori: "saglik",
        oncelik: 80,
        secenekler: [
          { id: "s1", metin: "Alarm ve kutu düzeni kur", sonuc: "Kontroller düzeldi.", etkiler: [e("saglik", 8), e("stres", -2)] },
          { id: "s2", metin: "Ezbere devam et", sonuc: "Bir doz unuttun. Dalgalı hafta.", etkiler: [e("saglik", -4), e("stres", 4)] },
        ],
      },
      {
        baslik: "Eski Dost Ziyareti",
        aciklama: "Yıllardır görmediğin arkadaşın aradı. Çay için çağırıyor.",
        kategori: "sosyal",
        oncelik: 65,
        secenekler: [
          { id: "s1", metin: "Git, hatıraları yeşert", sonuc: "Kalbin ısındı.", etkiler: [e("mutluluk", 7), e("ozellik", 3, "sosyallik")] },
          { id: "s2", metin: "Bahane bul", sonuc: "Yalnızlık sürdü.", etkiler: [e("mutluluk", -2)] },
        ],
      },
    ],
  },
  // ——— YAŞLI 71-80 ———
  {
    id: "yasli-71-80",
    yasGrubu: "yasli",
    minYas: 71,
    maxYas: 80,
    scenes: [
      {
        baslik: "Düşme Korkusu",
        aciklama: "Banyoda ayakların kaydı. Bir şey olmadı ama korku kaldı. Çocuklar baston konuşuyor.",
        kategori: "saglik",
        oncelik: 85,
        secenekler: [
          { id: "s1", metin: "Ev düzenlemesi + baston kabul et", sonuc: "Gururun kırıldı ama güvenliğin arttı.", etkiler: [e("saglik", 5), e("ozellik", 2, "sabir"), e("stres", -2)] },
          { id: "s2", metin: "Reddet, 'daha gencim' de", sonuc: "Risk sürüyor. Aile gerildi.", etkiler: [e("stres", 5), e("ozellik", 2, "guven")] },
          { id: "s3", metin: "Fizik tedaviye git", sonuc: "Denge çalışması iyi geldi.", etkiler: [e("saglik", 6), e("para", -2500)] },
        ],
      },
      {
        baslik: "Vasiyet Konuşması",
        aciklama: "Noter ve aile. Kimse konuşmak istemiyor ama zamanı geldi.",
        kategori: "aile",
        oncelik: 70,
        secenekler: [
          { id: "s1", metin: "Net ve adil konuş", sonuc: "Rahatlama + duygusal yük.", etkiler: [e("stres", -3), e("ozellik", 3, "guven"), e("mutluluk", -1)] },
          { id: "s2", metin: "Ertele", sonuc: "Belirsizlik ailede gerilim yaratıyor.", etkiler: [e("stres", 5)] },
        ],
      },
      {
        baslik: "Torunla Teknoloji",
        aciklama: "Torunun video görüşme açmanı istiyor. Ekran karmaşık geliyor.",
        kategori: "sosyal",
        oncelik: 60,
        secenekler: [
          { id: "s1", metin: "Öğrenmeye çalış", sonuc: "Bağ koptu değil, güçlendi.", etkiler: [e("mutluluk", 6), e("ozellik", 3, "zeka")] },
          { id: "s2", metin: "Telefonda konuş yeter de", sonuc: "İletişim sürdü ama mesafe var.", etkiler: [e("mutluluk", 2)] },
        ],
      },
    ],
  },
  // ——— İLERİ YAŞ 81+ ———
  {
    id: "ileri-81",
    yasGrubu: "ileri_yas",
    minYas: 81,
    maxYas: 120,
    scenes: [
      {
        baslik: "Hatıra Sandığı",
        aciklama: "Eski mektuplar ve fotoğraflar. Bazı yüzler artık yok. Gözlerin doluyor.",
        kategori: "yasam",
        oncelik: 85,
        secenekler: [
          { id: "s1", metin: "Torunlara hikâye anlat", sonuc: "Mirası kelimelerle aktardın.", etkiler: [e("mutluluk", 6), e("ozellik", 4, "sevgi")] },
          { id: "s2", metin: "Tek başına ağla, sonra toparlan", sonuc: "Yas işlendi. Huzur geldi.", etkiler: [e("stres", -4), e("mutluluk", 2)] },
          { id: "s3", metin: "Kutuyu kapat", sonuc: "Acı ertelendi.", etkiler: [e("stres", 3)] },
        ],
      },
      {
        baslik: "Bakım Kararı",
        aciklama: "Çocukların 'yanımızda kal' veya 'bakım evi' seçenekleri. Sen dinliyorsun.",
        kategori: "aile",
        oncelik: 90,
        secenekler: [
          { id: "s1", metin: "Aile yanında kalmayı seç", sonuc: "Sıcak ama bazen yük gibi hissediyorsun.", etkiler: [e("mutluluk", 4), e("ozellik", 2, "sevgi"), e("stres", 3)] },
          { id: "s2", metin: "Profesyonel bakım kabul et", sonuc: "Düzenli bakım. Özlem var.", etkiler: [e("saglik", 5), e("mutluluk", -2), e("stres", 2)] },
          { id: "s3", metin: "Bağımsızlığa tutun", sonuc: "Riskli ama onurlu hissettin.", etkiler: [e("ozellik", 3, "guven"), e("saglik", -3), e("stres", 4)] },
        ],
      },
      {
        baslik: "Sessiz Bir Sabah",
        aciklama: "Pencere kenarı. Kuşlar var. Bugün için büyük plan yok; küçük bir seçim var.",
        kategori: "yasam",
        oncelik: 70,
        secenekler: [
          { id: "s1", metin: "Kısa yürüyüş / balkon", sonuc: "Hava iyi geldi.", etkiler: [e("saglik", 3), e("mutluluk", 3)] },
          { id: "s2", metin: "Komşuya çay", sonuc: "Sohbet ısındırdı.", etkiler: [e("mutluluk", 5), e("ozellik", 2, "sosyallik")] },
          { id: "s3", metin: "Dinlen, müzik aç", sonuc: "Huzurlu bir gün.", etkiler: [e("stres", -4), e("mutluluk", 3)] },
        ],
      },
      {
        baslik: "Son Kontrol",
        aciklama: "Doktor 'değerler idare eder' diyor. Sen ömür boyu biriktirdiğin hikâyeyi düşünüyorsun.",
        kategori: "saglik",
        oncelik: 75,
        secenekler: [
          { id: "s1", metin: "Tavsiyelere uy", sonuc: "Özen devam ediyor.", etkiler: [e("saglik", 4)] },
          { id: "s2", metin: "Bugünü yaşa, az endişelen", sonuc: "Ruhun hafifledi.", etkiler: [e("mutluluk", 4), e("stres", -3)] },
        ],
      },
    ],
  },
];

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) - h + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Her yaş bandı kendi sahnelerini üretir.
 * Başka bandın olayları / seçenekleri asla karışmaz.
 * Aynı sahneden birden fazla paket varsa tamamen farklı seçenek setleri kullanılır.
 */
export function generateAgeExclusiveEvents(): GameEvent[] {
  const events: GameEvent[] = [];

  for (const band of AGE_BANDS) {
    band.scenes.forEach((scene, sceneIdx) => {
      // Ana paket
      events.push({
        id: `${band.id}-${sceneIdx}-a`,
        baslik: scene.baslik,
        aciklama: scene.aciklama,
        kategori: scene.kategori,
        yasGrubu: [band.yasGrubu],
        minYas: band.minYas,
        maxYas: band.maxYas,
        oncelik: scene.oncelik,
        secenekler: scene.secenekler.map((s, i) => ({ ...s, id: `s${i + 1}` })),
      });

      // Aynı olayın "farklı yol" versiyonu: seçenek sırası + sonuç nüansı (metinler aynı kalmaz diye
      // bandın diğer sahnelerinden seçenek ödünç ALINMAZ — sadece bu sahnenin kendi seçenekleri yeniden yazılır)
      if (scene.secenekler.length >= 2) {
        const seed = hashString(`${band.id}-${scene.baslik}`);
        const rewritten = scene.secenekler.map((s, i) => {
          const alt = rewriteChoiceForBand(band.id, s, seed + i);
          return { ...alt, id: `s${i + 1}` };
        });
        // Sıra değiştir
        const rot = (seed % (rewritten.length - 1)) + 1;
        const rotated = [...rewritten.slice(rot), ...rewritten.slice(0, rot)].map((s, i) => ({
          ...s,
          id: `s${i + 1}`,
        }));
        events.push({
          id: `${band.id}-${sceneIdx}-b`,
          baslik: scene.baslik,
          aciklama: scene.aciklama + " Bu sefer şartlar biraz daha zorlayıcı.",
          kategori: scene.kategori,
          yasGrubu: [band.yasGrubu],
          minYas: band.minYas,
          maxYas: band.maxYas,
          oncelik: Math.max(25, scene.oncelik - 8),
          secenekler: rotated,
        });
      }
    });
  }

  return events;
}

/** Yaş bandına özgü seçenek metni yeniden yazımı — başka yaşın dili kullanılmaz */
function rewriteChoiceForBand(
  bandId: string,
  choice: EventChoice,
  seed: number
): EventChoice {
  const prefixes: Record<string, string[]> = {
    bebek: ["Ağlayarak ", "Sessizce ", "Tepki vererek "],
    cocuk: ["Öğretmene rağmen ", "Annenin yardımıyla ", "Kendi başına "],
    ilkokul: ["Sınıfta ", "Teneffüste karar verip ", "Ödevden önce "],
    ergen: ["Arkadaşlarına rağmen ", "Ailene danışmadan ", "Düşünerek "],
    genc: ["Bütçeni hesaplayıp ", "Kariyerini düşünerek ", "Cesaretle "],
    yetiskin: ["Aile dengesiyle ", "İş riskini göze alıp ", "Uzun vadeyi düşünerek "],
    orta: ["Deneyiminle ", "Sağlığını önceleyip ", "Pratik çözerek "],
    yasli: ["Sakinlikle ", "Aile desteğiyle ", "Kendi temponla "],
    ileri: ["Huzurla ", "Hatıraların ışığında ", "Nazikçe "],
  };

  let key = "genc";
  if (bandId.startsWith("bebek")) key = "bebek";
  else if (bandId.startsWith("cocuk")) key = "cocuk";
  else if (bandId.startsWith("ilkokul")) key = "ilkokul";
  else if (bandId.startsWith("ergen")) key = "ergen";
  else if (bandId.startsWith("genc")) key = "genc";
  else if (bandId.startsWith("yetiskin")) key = "yetiskin";
  else if (bandId.startsWith("orta")) key = "orta";
  else if (bandId.startsWith("yasli")) key = "yasli";
  else if (bandId.startsWith("ileri")) key = "ileri";

  const list = prefixes[key];
  const prefix = list[seed % list.length];
  // Zaten önekliyse tekrar ekleme
  const metin = choice.metin.startsWith(prefix.trim())
    ? choice.metin
    : `${prefix}${choice.metin.charAt(0).toLowerCase()}${choice.metin.slice(1)}`;

  return {
    ...choice,
    metin,
    sonuc: choice.sonuc,
    etkiler: choice.etkiler?.map((eff) => ({
      ...eff,
      deger: eff.deger + ((seed % 3) - 1),
    })),
  };
}

export function getAgeBands() {
  return AGE_BANDS;
}
