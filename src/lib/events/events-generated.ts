import type { AgeGroup, EventCategory, EventChoice, GameEvent } from "@/types/game";

type StoryTemplate = {
  kategori: EventCategory;
  yasGrubu: AgeGroup[];
  oncelik: number;
  scenes: Array<{
    baslik: string;
    aciklama: string;
    secenekler: EventChoice[];
  }>;
};

const stories: StoryTemplate[] = [
  {
    kategori: "aile",
    yasGrubu: ["bebek"],
    oncelik: 70,
    scenes: [
      {
        baslik: "Gece Ağlaması",
        aciklama: "Gece yarısı uyanıyorsun. Karnın acıkmış olabilir. Annen yorgun gözlerle yanına geliyor.",
        secenekler: [
          { id: "s1", metin: "Sakinleşene kadar ağla", sonuc: "Annen seni emzirip uyuttu. Sabah herkes yorgun.", etkiler: [{ tip: "mutluluk", deger: 2 }] },
          { id: "s2", metin: "Kucağa alınınca sus", sonuc: "Annenin kokusuyla çabuk sakinleştin.", etkiler: [{ tip: "mutluluk", deger: 4 }] },
        ],
      },
      {
        baslik: "İlk Aşı",
        aciklama: "Sağlık ocağında aşı sırası sende. İğneyi görünce geriliyorsun; hemşire gülümseyerek yaklaşıyor.",
        secenekler: [
          { id: "s1", metin: "Ağlayarak tepki ver", sonuc: "Aşı yapıldı. Bir süre huysuzlandın ama sağlığın korundu.", etkiler: [{ tip: "saglik", deger: 5 }, { tip: "stres", deger: 3 }] },
          { id: "s2", metin: "Oyuncakla dikkatini dağıt", sonuc: "Aşı hızlı geçti. Eve dönünce rahatladın.", etkiler: [{ tip: "saglik", deger: 5 }] },
        ],
      },
    ],
  },
  {
    kategori: "aile",
    yasGrubu: ["cocuk"],
    oncelik: 55,
    scenes: [
      {
        baslik: "Kreşte Paylaşım",
        aciklama: "En sevdiğin oyuncağı başka bir çocuk istiyor. Öğretmen ikinizi de izliyor.",
        secenekler: [
          { id: "s1", metin: "Sırayla oynamayı kabul et", sonuc: "Öğretmen seni övdü. Yeni bir arkadaşlık filizlendi.", etkiler: [{ tip: "ozellik", deger: 4, ozellik: "empati" }, { tip: "mutluluk", deger: 3 }] },
          { id: "s2", metin: "Oyuncağı bırakma", sonuc: "Kısa bir tartışma oldu. Öğretmen araya girdi.", etkiler: [{ tip: "stres", deger: 4 }, { tip: "ozellik", deger: -2, ozellik: "sosyallik" }] },
        ],
      },
      {
        baslik: "Diş Fırçalama Direnci",
        aciklama: "Baban dişlerini fırçalamanı istiyor ama sen uykulu ve isteksizsin.",
        secenekler: [
          { id: "s1", metin: "Fırçala ve yat", sonuc: "Alışkanlık kazanıyorsun. Baban memnun.", etkiler: [{ tip: "saglik", deger: 3 }] },
          { id: "s2", metin: "Ağlayıp ertele", sonuc: "Biraz tartıştınız. Sonunda fırçaladın ama gergin uyudun.", etkiler: [{ tip: "stres", deger: 3 }] },
        ],
      },
    ],
  },
  {
    kategori: "egitim",
    yasGrubu: ["ilkokul"],
    oncelik: 60,
    scenes: [
      {
        baslik: "Sınıfta Söz Alma",
        aciklama: "Öğretmen soru soruyor. Cevabı biliyorsun gibi ama emin değilsin. Birkaç el kalkmış durumda.",
        secenekler: [
          { id: "s1", metin: "Parmak kaldır ve dene", sonuc: "Cevabın doğru çıktı. Özgüvenin arttı.", etkiler: [{ tip: "ozellik", deger: 4, ozellik: "guven" }, { tip: "ozellik", deger: 2, ozellik: "zeka" }] },
          { id: "s2", metin: "Sessiz kal, dinle", sonuc: "Başkasının cevabını dinledin. Bir şeyler öğrendin.", etkiler: [{ tip: "ozellik", deger: 2, ozellik: "zeka" }] },
          { id: "s3", metin: "Yanlış cevap verip utan", sonuc: "Sınıf güldü. Bir süre çekingen kaldın.", etkiler: [{ tip: "stres", deger: 5 }, { tip: "ozellik", deger: -2, ozellik: "guven" }] },
        ],
      },
      {
        baslik: "Ödev Unutmak",
        aciklama: "Matematik ödevini evde unuttuğunu derste fark ediyorsun. Öğretmen kontrol ediyor.",
        secenekler: [
          { id: "s1", metin: "Dürüstçe söyle", sonuc: "Öğretmen uyarı verdi ama anlayışlıydı. Bir dahaki sefere dikkat edeceksin.", etkiler: [{ tip: "ozellik", deger: 2, ozellik: "guven" }, { tip: "stres", deger: 2 }] },
          { id: "s2", metin: "Bahane uydur", sonuc: "Yalanın belli oldu. Güven sarsıldı.", etkiler: [{ tip: "stres", deger: 6 }, { tip: "ozellik", deger: -3, ozellik: "guven" }] },
        ],
      },
    ],
  },
  {
    kategori: "sosyal",
    yasGrubu: ["ergen"],
    oncelik: 55,
    scenes: [
      {
        baslik: "Arkadaş Baskısı",
        aciklama: "Arkadaş grubun dersi asıp dışarı çıkmayı öneriyor. Sen kararsızsın; yarın sınavın var.",
        secenekler: [
          { id: "s1", metin: "Sınava çalışmayı seç", sonuc: "Arkadaşların bozuldu ama sınavın iyi geçti.", etkiler: [{ tip: "ozellik", deger: 4, ozellik: "zeka" }, { tip: "ozellik", deger: -2, ozellik: "sosyallik" }] },
          { id: "s2", metin: "Kısa bir tur atıp dön", sonuc: "Dengeyi korudun. Hem nefes aldın hem çalıştın.", etkiler: [{ tip: "mutluluk", deger: 3 }, { tip: "stres", deger: -2 }] },
          { id: "s3", metin: "Tüm günü dışarıda geçir", sonuc: "Eğlendin ama sınavda zorlandın. Ailen kızgın.", etkiler: [{ tip: "mutluluk", deger: 5 }, { tip: "stres", deger: 8 }, { tip: "ozellik", deger: -3, ozellik: "zeka" }] },
        ],
      },
      {
        baslik: "İlk Ciddi Tartışma",
        aciklama: "En yakın arkadaşınla küçük bir yanlış anlaşılma büyüyor. Mesajlar sertleşiyor.",
        secenekler: [
          { id: "s1", metin: "Yüz yüze konuşmayı teklif et", sonuc: "Konuşunca mesele çözüldü. İlişkiniz güçlendi.", etkiler: [{ tip: "ozellik", deger: 4, ozellik: "empati" }, { tip: "mutluluk", deger: 4 }] },
          { id: "s2", metin: "Bir süre mesafeli dur", sonuc: "Soğukluk sürdü. İkiniz de üzgünsünüz.", etkiler: [{ tip: "mutluluk", deger: -4 }, { tip: "stres", deger: 4 }] },
        ],
      },
    ],
  },
  {
    kategori: "kariyer",
    yasGrubu: ["genc"],
    oncelik: 60,
    scenes: [
      {
        baslik: "Staj Mülakatı",
        aciklama: "Küçük bir şirkette staj için görüşmeye girdin. Yönetici deneyimini ve motivasyonunu soruyor.",
        secenekler: [
          { id: "s1", metin: "Dürüst ve hazırlıklı cevap ver", sonuc: "Staja kabul edildin. İlk profesyonel adımın.", etkiler: [{ tip: "ozellik", deger: 5, ozellik: "guven" }, { tip: "para", deger: 1500 }] },
          { id: "s2", metin: "Abartılı iddialarda bulun", sonuc: "İlk hafta zorlandın; itibarın sarsıldı.", etkiler: [{ tip: "stres", deger: 7 }, { tip: "ozellik", deger: -2, ozellik: "guven" }] },
          { id: "s3", metin: "Teklifi geri çevir", sonuc: "Kapı kapandı. Başka arayışlara devam.", etkiler: [{ tip: "stres", deger: 2 }] },
        ],
      },
      {
        baslik: "Kira Gerçeği",
        aciklama: "Ailenden ayrı yaşamak istiyorsun ama maaşın ve birikimin sınırlı. Ortak ev ilanı gördün.",
        secenekler: [
          { id: "s1", metin: "Ortaya çıkıp odaya yerleş", sonuc: "Özgürlük arttı ama bütçe daraldı.", etkiler: [{ tip: "mutluluk", deger: 4 }, { tip: "para", deger: -4000 }, { tip: "stres", deger: 5 }] },
          { id: "s2", metin: "Bir yıl daha aile yanında kal", sonuc: "Biriktirmeye devam. İlişkiler bazen geriliyor.", etkiler: [{ tip: "para", deger: 1000 }, { tip: "stres", deger: 3 }] },
        ],
      },
    ],
  },
  {
    kategori: "finans",
    yasGrubu: ["yetiskin", "orta_yas"],
    oncelik: 50,
    scenes: [
      {
        baslik: "Beklenmeyen Diş Faturası",
        aciklama: "Kanal tedavisi gerekiyor. Özel klinikte fiyat yüksek; devlet hastanesinde sıra uzun.",
        secenekler: [
          { id: "s1", metin: "Özelde hemen yaptır", sonuc: "Ağrı geçti. Cüzdanın inceldi.", etkiler: [{ tip: "saglik", deger: 8 }, { tip: "para", deger: -6500 }] },
          { id: "s2", metin: "Devlet hastanesini bekle", sonuc: "Haftalarca rahatsız ettin ama daha ucuza çözüldü.", etkiler: [{ tip: "saglik", deger: 4 }, { tip: "stres", deger: 6 }, { tip: "para", deger: -800 }] },
          { id: "s3", metin: "Ağrıyı geçiştir", sonuc: "Sorun büyüdü. Sonra daha pahalıya patladı.", etkiler: [{ tip: "saglik", deger: -8 }, { tip: "stres", deger: 8 }] },
        ],
      },
      {
        baslik: "İşten Çıkarma Söylentisi",
        aciklama: "Şirkette küçülme konuşuluyor. Takım arkadaşların panikte; sen de güvende hissetmiyorsun.",
        secenekler: [
          { id: "s1", metin: "Sessizce yeni iş bak", sonuc: "Hazırlıklı oldun. Stresin yönetilebilir kaldı.", etkiler: [{ tip: "stres", deger: 3 }, { tip: "ozellik", deger: 3, ozellik: "guven" }] },
          { id: "s2", metin: "Yöneticinle net konuş", sonuc: "Netlik kazandın; belki fırsat da doğdu.", etkiler: [{ tip: "ozellik", deger: 4, ozellik: "guven" }] },
          { id: "s3", metin: "Görmezden gel", sonuc: "Belirsizlik ruh halini bozdu.", etkiler: [{ tip: "stres", deger: 10 }, { tip: "mutluluk", deger: -4 }] },
        ],
      },
    ],
  },
  {
    kategori: "saglik",
    yasGrubu: ["orta_yas", "yasli"],
    oncelik: 55,
    scenes: [
      {
        baslik: "Check-up Sonuçları",
        aciklama: "Kan değerlerinde borderline kolesterol çıkıyor. Doktor yaşam tarzı değişikliği öneriyor.",
        secenekler: [
          { id: "s1", metin: "Diyet ve yürüyüşe başla", sonuc: "Üç ayda değerler düzelmeye başladı.", etkiler: [{ tip: "saglik", deger: 10 }, { tip: "stres", deger: -3 }] },
          { id: "s2", metin: "İlaçla idare et", sonuc: "Kontrol altında ama kök neden duruyor.", etkiler: [{ tip: "saglik", deger: 4 }, { tip: "para", deger: -1200 }] },
          { id: "s3", metin: "Ertele", sonuc: "Risk büyüyor. Yorgunluğun arttı.", etkiler: [{ tip: "saglik", deger: -8 }] },
        ],
      },
    ],
  },
  {
    kategori: "romantik",
    yasGrubu: ["genc", "yetiskin"],
    oncelik: 45,
    scenes: [
      {
        baslik: "Ciddiyet Konuşması",
        aciklama: "Bir süredir gördüğün kişi 'nereye gidiyoruz?' diye soruyor. Sen de net değilsin.",
        secenekler: [
          { id: "s1", metin: "Ciddi ilişki istediğini söyle", sonuc: "Netlik ilişkiyi ilerletti.", etkiler: [{ tip: "mutluluk", deger: 6 }, { tip: "ozellik", deger: 3, ozellik: "sevgi" }] },
          { id: "s2", metin: "Zaman istediğini söyle", sonuc: "Saygı duyuldu ama belirsizlik sürdü.", etkiler: [{ tip: "stres", deger: 2 }] },
          { id: "s3", metin: "Uzaklaş", sonuc: "İlişki bitti. Bir süre yalnız kaldın.", etkiler: [{ tip: "mutluluk", deger: -6 }, { tip: "stres", deger: 5 }] },
        ],
      },
    ],
  },
  {
    kategori: "rastgele",
    yasGrubu: ["ilkokul", "ergen", "genc", "yetiskin", "orta_yas"],
    oncelik: 20,
    scenes: [
      {
        baslik: "Yağmurda Islanmak",
        aciklama: "Şemsiyesiz yakalandın. Durak dolu; eve 15 dakika yürüme var.",
        secenekler: [
          { id: "s1", metin: "Koşarak eve git", sonuc: "Islanınca üşüttün ama hızlı vardın.", etkiler: [{ tip: "saglik", deger: -3 }, { tip: "stres", deger: 2 }] },
          { id: "s2", metin: "Bir markete girip bekle", sonuc: "Zaman kaybettin ama kuru kaldın.", etkiler: [{ tip: "para", deger: -40 }] },
        ],
      },
      {
        baslik: "Kayıp Cüzdan Panik",
        aciklama: "Cüzdanını bulamıyorsun. Son gördüğün yer otobüs veya kafe olabilir.",
        secenekler: [
          { id: "s1", metin: "Geri dönüp ara", sonuc: "Kafede unutulmuş; görevli teslim etti.", etkiler: [{ tip: "mutluluk", deger: 5 }, { tip: "stres", deger: -4 }] },
          { id: "s2", metin: "Kartları iptal ettir", sonuc: "Güvenli ama zahmetli bir gün.", etkiler: [{ tip: "stres", deger: 6 }, { tip: "para", deger: -150 }] },
        ],
      },
    ],
  },
  {
    kategori: "yasam",
    yasGrubu: ["yasli", "ileri_yas"],
    oncelik: 50,
    scenes: [
      {
        baslik: "Yalnız Bir Öğleden Sonra",
        aciklama: "Ev sessiz. Torunlar gelmeyecek. Televizyon açık ama dikkatini çekmiyor.",
        secenekler: [
          { id: "s1", metin: "Komşuya çaya git", sonuc: "Sohbet iyi geldi. Yalnızlık hafifledi.", etkiler: [{ tip: "mutluluk", deger: 6 }, { tip: "ozellik", deger: 2, ozellik: "sosyallik" }] },
          { id: "s2", metin: "Eski fotoğraflara bak", sonuc: "Nostalji hem ısıttı hem hüzünlendirdi.", etkiler: [{ tip: "mutluluk", deger: 2 }, { tip: "stres", deger: -2 }] },
          { id: "s3", metin: "Kısa bir yürüyüş yap", sonuc: "Hava almak iyi geldi.", etkiler: [{ tip: "saglik", deger: 4 }, { tip: "mutluluk", deger: 3 }] },
        ],
      },
    ],
  },
  {
    kategori: "egitim",
    yasGrubu: ["ilkokul", "ergen"],
    oncelik: 55,
    scenes: [
      {
        baslik: "Öğretmen Görüşmesi",
        aciklama: "Veli toplantısında öğretmen notlarını ve davranışını anlatıyor. Ailen seni dinliyor.",
        secenekler: [
          { id: "s1", metin: "Eleştiriyi kabul et, plan yap", sonuc: "Ailen destekledi. Çalışma düzenin toparlandı.", etkiler: [{ tip: "ozellik", deger: 3, ozellik: "zeka" }, { tip: "stres", deger: 2 }] },
          { id: "s2", metin: "Savunmaya geç", sonuc: "Gerginlik arttı. Evde tartışma çıktı.", etkiler: [{ tip: "stres", deger: 6 }, { tip: "mutluluk", deger: -3 }] },
        ],
      },
      {
        baslik: "Kütüphane Ödevi",
        aciklama: "Proje için kaynak lazım. İnternet yeterli değil; kütüphaneye gitmen gerekiyor.",
        secenekler: [
          { id: "s1", metin: "Kütüphanede çalış", sonuc: "Kaynaklar güçlendirdi. Notun yükseldi.", etkiler: [{ tip: "ozellik", deger: 4, ozellik: "zeka" }] },
          { id: "s2", metin: "Yarım yamalak internetten yap", sonuc: "Geçtin ama yüzeysel kaldı.", etkiler: [{ tip: "ozellik", deger: 1, ozellik: "zeka" }, { tip: "stres", deger: 2 }] },
        ],
      },
    ],
  },
  {
    kategori: "sosyal",
    yasGrubu: ["cocuk", "ilkokul"],
    oncelik: 45,
    scenes: [
      {
        baslik: "Doğum Günü Daveti",
        aciklama: "Sınıftan bir çocuk seni doğum gününe çağırdı. Hediye almak ve gitmek istiyorsun.",
        secenekler: [
          { id: "s1", metin: "Git ve hediye götür", sonuc: "Eğlenceli bir öğleden sonra. Yeni bağlar kuruldu.", etkiler: [{ tip: "mutluluk", deger: 5 }, { tip: "ozellik", deger: 3, ozellik: "sosyallik" }, { tip: "para", deger: -80 }] },
          { id: "s2", metin: "Gitme", sonuc: "Evde kaldın. Biraz üzgün hissettin.", etkiler: [{ tip: "mutluluk", deger: -2 }] },
        ],
      },
    ],
  },
  {
    kategori: "kariyer",
    yasGrubu: ["yetiskin", "orta_yas"],
    oncelik: 50,
    scenes: [
      {
        baslik: "Mesai Baskısı",
        aciklama: "Proje teslimi yaklaştı. Müdür ekstra mesai istiyor; ailen akşam yemeğini bekliyor.",
        secenekler: [
          { id: "s1", metin: "Mesaiye kal", sonuc: "Teslim yetişti ama yorgunluk ve aile gerilimi arttı.", etkiler: [{ tip: "para", deger: 3000 }, { tip: "stres", deger: 8 }, { tip: "mutluluk", deger: -3 }] },
          { id: "s2", metin: "Sınır koy, yarın erken gel", sonuc: "Dengeyi korudun. Yönetici pek memnun değil.", etkiler: [{ tip: "stres", deger: 3 }, { tip: "ozellik", deger: 2, ozellik: "guven" }] },
        ],
      },
      {
        baslik: "Performans Görüşmesi",
        aciklama: "Yıllık değerlendirme. Zam ve unvan konuşulabilir ama kanıt göstermen lazım.",
        secenekler: [
          { id: "s1", metin: "Hazırlıklı sunum yap", sonuc: "Küçük bir zam aldın.", etkiler: [{ tip: "para", deger: 5000 }, { tip: "ozellik", deger: 3, ozellik: "guven" }] },
          { id: "s2", metin: "Pasif kal", sonuc: "Statüko devam. İçin sıkıldı.", etkiler: [{ tip: "stres", deger: 4 }] },
        ],
      },
    ],
  },
  {
    kategori: "saglik",
    yasGrubu: ["bebek", "cocuk"],
    oncelik: 50,
    scenes: [
      {
        baslik: "Ateş ve Nezle",
        aciklama: "Gece ateşin çıktı. Annen ıslak bezle alnını siliyor; doktora gidilsin mi diye tartışıyorlar.",
        secenekler: [
          { id: "s1", metin: "Doktora gidin", sonuc: "Kontrol edildi. İlaçla düzelme başladı.", etkiler: [{ tip: "saglik", deger: 6 }, { tip: "para", deger: -200 }] },
          { id: "s2", metin: "Evde dinlen", sonuc: "Birkaç gün huysuz geçti ama iyileştin.", etkiler: [{ tip: "saglik", deger: 2 }, { tip: "stres", deger: 3 }] },
        ],
      },
    ],
  },
  {
    kategori: "romantik",
    yasGrubu: ["ergen"],
    oncelik: 40,
    scenes: [
      {
        baslik: "Okul Koridoru",
        aciklama: "Beğendiğin biriyle göz göze geldiniz. Arkadaşların fısıldaşıyor. Ne diyeceksin?",
        secenekler: [
          { id: "s1", metin: "Selam verip geç", sonuc: "Küçük bir adım. Kapı açık kaldı.", etkiler: [{ tip: "ozellik", deger: 2, ozellik: "sosyallik" }, { tip: "mutluluk", deger: 2 }] },
          { id: "s2", metin: "Kaç ve utan", sonuc: "Fırsat kaçtı. İçin kıpır kıpır.", etkiler: [{ tip: "stres", deger: 3 }] },
          { id: "s3", metin: "Arkadaşlarınla dalga geç", sonuc: "Kaba kaçtı. İlişki geriledi.", etkiler: [{ tip: "ozellik", deger: -3, ozellik: "empati" }, { tip: "mutluluk", deger: -2 }] },
        ],
      },
    ],
  },
  {
    kategori: "finans",
    yasGrubu: ["ergen"],
    oncelik: 35,
    scenes: [
      {
        baslik: "Harçlık Bitmek Üzere",
        aciklama: "Ayın sonu. Arkadaşların dışarı çıkmak istiyor; cebinde az para kaldı.",
        secenekler: [
          { id: "s1", metin: "Evde kal, biriktir", sonuc: "Sıkıcı ama mantıklı bir seçim.", etkiler: [{ tip: "para", deger: 50 }, { tip: "mutluluk", deger: -1 }] },
          { id: "s2", metin: "Ucuz bir aktivite öner", sonuc: "Hem sosyal hem idareli oldun.", etkiler: [{ tip: "mutluluk", deger: 3 }, { tip: "para", deger: -40 }] },
          { id: "s3", metin: "Borç iste", sonuc: "Gittiniz ama borçlu kaldın.", etkiler: [{ tip: "mutluluk", deger: 2 }, { tip: "stres", deger: 4 }, { tip: "para", deger: -20 }] },
        ],
      },
    ],
  },
  {
    kategori: "aile",
    yasGrubu: ["genc", "yetiskin"],
    oncelik: 45,
    scenes: [
      {
        baslik: "Aile Büyüklerinin Ziyareti",
        aciklama: "Büyükanne/büyükbaba geliyor. Ev temizliği, yemek ve uzun sohbetler bekleniyor.",
        secenekler: [
          { id: "s1", metin: "İyi ağırla", sonuc: "Aile bağları güçlendi.", etkiler: [{ tip: "mutluluk", deger: 5 }, { tip: "ozellik", deger: 3, ozellik: "sevgi" }, { tip: "stres", deger: 3 }] },
          { id: "s2", metin: "Kısa uğra, bahaneyle çık", sonuc: "Rahatladın ama suçluluk hissettin.", etkiler: [{ tip: "stres", deger: -2 }, { tip: "mutluluk", deger: -2 }] },
        ],
      },
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

/** Gerçekçi hikâye şablonlarından 600+ varyasyon üretir */
export function generateProceduralEvents(targetCount = 600): GameEvent[] {
  const events: GameEvent[] = [];
  let index = 0;

  while (events.length < targetCount) {
    const story = stories[index % stories.length];
    const scene = story.scenes[index % story.scenes.length];
    const variant = Math.floor(index / stories.length);
    const seed = hashString(`${story.kategori}-${scene.baslik}-${variant}`);

    // Küçük gerçekçi varyasyon: etki değerlerini ±1 oynat
    const secenekler = scene.secenekler.map((s, i) => ({
      ...s,
      id: `s${i + 1}`,
      etkiler: s.etkiler?.map((e) => ({
        ...e,
        deger: e.deger + ((seed + i) % 3) - 1,
      })),
    }));

    const nuance = [
      "",
      " Bu sefer daha temkinlisin.",
      " Ailenin beklentisi yüksek.",
      " Zamanın kısıtlı.",
      " İçgüdülerin karışık.",
    ][variant % 5];

    events.push({
      id: `story-${story.kategori}-${index}`,
      baslik: scene.baslik,
      aciklama: scene.aciklama + nuance,
      kategori: story.kategori,
      yasGrubu: story.yasGrubu,
      oncelik: Math.max(15, story.oncelik - (variant % 8)),
      secenekler,
    });

    index++;
  }

  return events;
}
