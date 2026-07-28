import type { GameEvent, AgeGroup, EventCategory } from "@/types/game";
import { extraEvents } from "@/lib/events/events-extra";
import { generateProceduralEvents } from "@/lib/events/events-generated";

const baseEvents: GameEvent[] = [
  // Bebek olayları
  {
    id: "bebek-ilk-gun",
    baslik: "Hoş Geldin Dünyaya!",
    aciklama: "Gözlerini açtın. Annenin sıcak kollarında güvenli bir şekilde uyuyorsun. Hayatının ilk günü başladı.",
    kategori: "yasam",
    yasGrubu: ["bebek"],
    oncelik: 100,
    secenekler: [
      { id: "s1", metin: "Huzurlu uyumaya devam et", sonuc: "Annen seni sevgiyle sarıyor." },
      { id: "s2", metin: "Ağlamaya başla", sonuc: "Annen hemen ilgileniyor." },
    ],
  },
  {
    id: "bebek-ilk-adim",
    baslik: "İlk Adımlar",
    aciklama: "Bugün annenle birlikte yürümeye çalışıyorsun. Küçük adımlar atıyorsun!",
    kategori: "yasam",
    yasGrubu: ["bebek"],
    oncelik: 80,
    secenekler: [
      { id: "s1", metin: "Yürümeye devam et", sonuc: "İlk adımlarını attın!", etkiler: [{ tip: "mutluluk", deger: 5 }] },
      { id: "s2", metin: "Yorul ve otur", sonuc: "Biraz dinlenmek iyi geldi." },
    ],
  },
  {
    id: "bebek-ilk-kelime",
    baslik: "İlk Kelime",
    aciklama: "Annenle konuşurken ilk kelimeni söyledin. Ailen çok mutlu!",
    kategori: "aile",
    yasGrubu: ["bebek", "cocuk"],
    oncelik: 85,
    secenekler: [
      { id: "s1", metin: "Daha fazla kelime öğren", sonuc: "Zekân gelişiyor!", etkiler: [{ tip: "ozellik", deger: 3, ozellik: "zeka" }] },
      { id: "s2", metin: "Oyun oynamaya devam et", sonuc: "Eğlenceli bir gün geçirdin.", etkiler: [{ tip: "mutluluk", deger: 3 }] },
    ],
  },

  // Çocuk olayları
  {
    id: "cocuk-anaokulu",
    baslik: "Anaokuluna Başlıyorsun",
    aciklama: "Bugün anaokulunun ilk günü. Yeni arkadaşlar edineceksin!",
    kategori: "egitim",
    yasGrubu: ["cocuk"],
    oncelik: 90,
    secenekler: [
      { id: "s1", metin: "Heyecanla git", sonuc: "Yeni arkadaşlar edindin!", etkiler: [{ tip: "mutluluk", deger: 8 }, { tip: "ozellik", deger: 5, ozellik: "sosyallik" }] },
      { id: "s2", metin: "Biraz çekingen ol", sonuc: "Zamanla alışacaksın.", etkiler: [{ tip: "stres", deger: 5 }] },
      { id: "s3", metin: "Annenle gitmek iste", sonuc: "Annen seni okula bıraktı.", etkiler: [{ tip: "iliski", deger: 3 }] },
    ],
  },
  {
    id: "cocuk-dogum-gunu",
    baslik: "Doğum Günü Partisi",
    aciklama: "Ailen senin için küçük bir doğum günü partisi düzenledi!",
    kategori: "aile",
    yasGrubu: ["cocuk", "ilkokul"],
    oncelik: 70,
    secenekler: [
      { id: "s1", metin: "Arkadaşlarını davet et", sonuc: "Harika bir parti oldu!", etkiler: [{ tip: "mutluluk", deger: 10 }] },
      { id: "s2", metin: "Sadece aileyle kutla", sonuc: "Sakin ve huzurlu bir kutlama.", etkiler: [{ tip: "mutluluk", deger: 5 }] },
    ],
  },

  // İlkokul olayları
  {
    id: "ilkokul-baslangic",
    baslik: "İlkokula Başlıyorsun",
    aciklama: "Okul çantanı hazırladın. Bugün ilkokulun ilk günü!",
    kategori: "egitim",
    yasGrubu: ["ilkokul"],
    oncelik: 95,
    secenekler: [
      { id: "s1", metin: "Derslere odaklan", sonuc: "İyi bir öğrenci olmaya başladın.", etkiler: [{ tip: "ozellik", deger: 5, ozellik: "zeka" }] },
      { id: "s2", metin: "Sosyal aktivitelere katıl", sonuc: "Çok arkadaş edindin!", etkiler: [{ tip: "ozellik", deger: 5, ozellik: "sosyallik" }] },
    ],
  },
  {
    id: "ilkokul-sinav",
    baslik: "Sınıf Sınavı",
    aciklama: "Matematik sınavı var. Hazırlıklı mısın?",
    kategori: "egitim",
    yasGrubu: ["ilkokul"],
    oncelik: 60,
    secenekler: [
      { id: "s1", metin: "Çok çalış", sonuc: "Sınavda yüksek not aldın!", etkiler: [{ tip: "ozellik", deger: 8, ozellik: "zeka" }, { tip: "mutluluk", deger: 5 }] },
      { id: "s2", metin: "Normal çalış", sonuc: "Geçer not aldın.", etkiler: [{ tip: "ozellik", deger: 2, ozellik: "zeka" }] },
      { id: "s3", metin: "Çalışmadan git", sonuc: "Düşük not aldın.", etkiler: [{ tip: "stres", deger: 10 }] },
    ],
  },

  // Ergen olayları
  {
    id: "ergen-lise",
    baslik: "Liseye Başlıyorsun",
    aciklama: "Lise hayatı başlıyor. Yeni sorumluluklar ve fırsatlar seni bekliyor.",
    kategori: "egitim",
    yasGrubu: ["ergen"],
    oncelik: 90,
    secenekler: [
      { id: "s1", metin: "Akademik hedeflere odaklan", sonuc: "Üniversite hedefin belirledin.", etkiler: [{ tip: "ozellik", deger: 5, ozellik: "zeka" }] },
      { id: "s2", metin: "Sosyal hayata odaklan", sonuc: "Popüler bir öğrenci oldun.", etkiler: [{ tip: "ozellik", deger: 8, ozellik: "sosyallik" }] },
      { id: "s3", metin: "Spor kulübüne katıl", sonuc: "Fiziksel olarak gelişiyorsun.", etkiler: [{ tip: "saglik", deger: 10 }] },
    ],
  },
  {
    id: "ergen-parti",
    baslik: "Arkadaşının Partisi",
    aciklama: "Arkadaşın ev partisi düzenliyor. Gitmek istiyor musun?",
    kategori: "sosyal",
    yasGrubu: ["ergen"],
    oncelik: 50,
    secenekler: [
      { id: "s1", metin: "Partiye git", sonuc: "Eğlenceli bir gece geçirdin!", etkiler: [{ tip: "mutluluk", deger: 10 }, { tip: "ozellik", deger: 3, ozellik: "sosyallik" }] },
      { id: "s2", metin: "Evde kal ve ders çalış", sonuc: "Derslerine odaklandın.", etkiler: [{ tip: "ozellik", deger: 5, ozellik: "zeka" }] },
      { id: "s3", metin: "Ailene sor", sonuc: "Ailen izin vermedi.", etkiler: [{ tip: "stres", deger: 5 }] },
    ],
  },

  // Genç olayları
  {
    id: "genc-universite",
    baslik: "Üniversiteye Başlıyorsun",
    aciklama: "Üniversite hayatı başlıyor! Hangi alanda ilerlemek istiyorsun?",
    kategori: "egitim",
    yasGrubu: ["genc"],
    oncelik: 95,
    secenekler: [
      { id: "s1", metin: "Mühendislik oku", sonuc: "Mühendislik bölümüne başladın.", etkiler: [{ tip: "ozellik", deger: 8, ozellik: "zeka" }] },
      { id: "s2", metin: "Tıp oku", sonuc: "Tıp fakültesine başladın.", etkiler: [{ tip: "ozellik", deger: 10, ozellik: "zeka" }, { tip: "stres", deger: 5 }] },
      { id: "s3", metin: "İşletme oku", sonuc: "İşletme bölümüne başladın.", etkiler: [{ tip: "ozellik", deger: 5, ozellik: "guven" }] },
      { id: "s4", metin: "Sanat oku", sonuc: "Güzel sanatlar fakültesine başladın.", etkiler: [{ tip: "mutluluk", deger: 10 }] },
    ],
  },
  {
    id: "genc-ilk-is",
    baslik: "İlk İş Deneyimi",
    aciklama: "Part-time iş arıyorsun. Birkaç seçenek var.",
    kategori: "kariyer",
    yasGrubu: ["genc"],
    oncelik: 70,
    secenekler: [
      { id: "s1", metin: "Kafede garsonluk yap", sonuc: "İlk iş deneyimini kazandın.", etkiler: [{ tip: "para", deger: 2000 }] },
      { id: "s2", metin: "Staj yap", sonuc: "Kariyer için önemli bir adım attın.", etkiler: [{ tip: "ozellik", deger: 5, ozellik: "guven" }] },
      { id: "s3", metin: "Sadece okula odaklan", sonuc: "Eğitimine devam ediyorsun." },
    ],
  },

  // Yetişkin olayları
  {
    id: "yetiskin-kariyer",
    baslik: "Kariyer Seçimi",
    aciklama: "Profesyonel hayatına başlama zamanı geldi.",
    kategori: "kariyer",
    yasGrubu: ["yetiskin", "genc"],
    oncelik: 85,
    secenekler: [
      { id: "s1", metin: "Kurumsal şirkette çalış", sonuc: "Stabil bir iş buldun.", etkiler: [{ tip: "para", deger: 15000 }] },
      { id: "s2", metin: "Kendi işini kur", sonuc: "Girişimci ruhunu ortaya koydun!", etkiler: [{ tip: "ozellik", deger: 10, ozellik: "guven" }, { tip: "stres", deger: 10 }] },
      { id: "s3", metin: "Freelance çalış", sonuc: "Esnek çalışma hayatı başladı.", etkiler: [{ tip: "mutluluk", deger: 5 }] },
    ],
  },
  {
    id: "yetiskin-ev",
    baslik: "Ev Arıyorsun",
    aciklama: "Kendi evin olması zamanı geldi. Ne yapmak istiyorsun?",
    kategori: "finans",
    yasGrubu: ["yetiskin", "orta_yas"],
    oncelik: 60,
    secenekler: [
      { id: "s1", metin: "Ev kirala", sonuc: "Güzel bir ev kiraladın.", etkiler: [{ tip: "para", deger: -3000 }] },
      { id: "s2", metin: "Ev satın al", sonuc: "Kendi evin oldu!", etkiler: [{ tip: "para", deger: -500000 }, { tip: "mutluluk", deger: 15 }] },
      { id: "s3", metin: "Aileyle yaşamaya devam et", sonuc: "Aile yanında kalmaya devam ediyorsun.", etkiler: [{ tip: "para", deger: 1000 }] },
    ],
  },

  // Sağlık olayları
  {
    id: "saglik-hastalik",
    baslik: "Hasta Oldun",
    aciklama: "Grip yakaladın. Dinlenmeye ihtiyacın var.",
    kategori: "saglik",
    yasGrubu: ["bebek", "cocuk", "ilkokul", "ergen", "genc", "yetiskin", "orta_yas", "yasli"],
    oncelik: 40,
    secenekler: [
      { id: "s1", metin: "Doktora git", sonuc: "Tedavi gördün ve iyileşiyorsun.", etkiler: [{ tip: "saglik", deger: 15 }, { tip: "para", deger: -500 }] },
      { id: "s2", metin: "Evde dinlen", sonuc: "Birkaç gün dinlendin.", etkiler: [{ tip: "saglik", deger: 5 }] },
      { id: "s3", metin: "İşe/okula git", sonuc: "Hastalık uzadı.", etkiler: [{ tip: "saglik", deger: -10 }, { tip: "stres", deger: 5 }] },
    ],
  },
  {
    id: "saglik-spor",
    baslik: "Spor Yapmaya Başla",
    aciklama: "Sağlıklı yaşam için spor yapmaya başlamak istiyorsun.",
    kategori: "saglik",
    yasGrubu: ["ergen", "genc", "yetiskin", "orta_yas"],
    oncelik: 45,
    secenekler: [
      { id: "s1", metin: "Fitness salonuna yazıl", sonuc: "Düzenli spor yapmaya başladın.", etkiler: [{ tip: "saglik", deger: 15 }, { tip: "mutluluk", deger: 5 }, { tip: "para", deger: -500 }] },
      { id: "s2", metin: "Koşmaya başla", sonuc: "Her gün koşuyorsun.", etkiler: [{ tip: "saglik", deger: 10 }] },
      { id: "s3", metin: "Vazgeç", sonuc: "Spor yapmadan devam ediyorsun." },
    ],
  },

  // Sosyal olaylar
  {
    id: "sosyal-konser",
    baslik: "Konser Daveti",
    aciklama: "Arkadaşın seni bir konserde görmek istiyor!",
    kategori: "sosyal",
    yasGrubu: ["ergen", "genc", "yetiskin"],
    oncelik: 35,
    secenekler: [
      { id: "s1", metin: "Konserde git", sonuc: "Muhteşem bir gece!", etkiler: [{ tip: "mutluluk", deger: 12 }, { tip: "para", deger: -300 }] },
      { id: "s2", metin: "Evde kal", sonuc: "Sakin bir gece geçirdin." },
    ],
  },
  {
    id: "sosyal-tatil",
    baslik: "Tatil Planı",
    aciklama: "Tatil yapma zamanı! Nereye gitmek istersin?",
    kategori: "sosyal",
    yasGrubu: ["genc", "yetiskin", "orta_yas"],
    oncelik: 50,
    secenekler: [
      { id: "s1", metin: "Antalya'ya git", sonuc: "Güzel bir tatil geçirdin!", etkiler: [{ tip: "mutluluk", deger: 15 }, { tip: "para", deger: -5000 }] },
      { id: "s2", metin: "Yurt içi kültür turu", sonuc: "Tarihi yerler gezdin.", etkiler: [{ tip: "mutluluk", deger: 8 }, { tip: "para", deger: -2000 }] },
      { id: "s3", metin: "Evde dinlen", sonuc: "Sakin bir tatil.", etkiler: [{ tip: "stres", deger: -10 }] },
    ],
  },

  // Finans olayları
  {
    id: "finans-yatirim",
    baslik: "Yatırım Fırsatı",
    aciklama: "Bir yatırım danışmanı seninle görüşmek istiyor.",
    kategori: "finans",
    yasGrubu: ["genc", "yetiskin", "orta_yas"],
    oncelik: 40,
    secenekler: [
      { id: "s1", metin: "Hisse senedi al", sonuc: "Borsaya yatırım yaptın.", etkiler: [{ tip: "para", deger: -10000 }] },
      { id: "s2", metin: "Altın al", sonuc: "Güvenli yatırım yaptın.", etkiler: [{ tip: "para", deger: -5000 }] },
      { id: "s3", metin: "Yatırım yapma", sonuc: "Paranı sakladın." },
    ],
  },

  // Romantik olaylar
  {
    id: "romantik-tanisma",
    baslik: "Yeni Bir Tanışma",
    aciklama: "Güzel bir günde ilginç biriyle tanıştın.",
    kategori: "romantik",
    yasGrubu: ["ergen", "genc", "yetiskin"],
    oncelik: 55,
    secenekler: [
      { id: "s1", metin: "Konuşmaya devam et", sonuc: "Yeni bir arkadaşlık başladı.", etkiler: [{ tip: "mutluluk", deger: 8 }] },
      { id: "s2", metin: "Flört et", sonuc: "Romantik bir bağ kuruldu!", etkiler: [{ tip: "mutluluk", deger: 12 }] },
      { id: "s3", metin: "Uzak dur", sonuc: "Tanışmayı sonlandırdın." },
    ],
  },

  // Rastgele olaylar
  {
    id: "rastgele-hazine",
    baslik: "Şanslı Gün!",
    aciklama: "Yolda yürürken cebinde para buldun!",
    kategori: "rastgele",
    yasGrubu: ["cocuk", "ilkokul", "ergen", "genc", "yetiskin", "orta_yas"],
    oncelik: 20,
    secenekler: [
      { id: "s1", metin: "Parayı al", sonuc: "Küçük bir sürpriz!", etkiler: [{ tip: "para", deger: 500 }] },
      { id: "s2", metin: "Kayıp eşya bürosuna teslim et", sonuc: "İyi bir davranış!", etkiler: [{ tip: "ozellik", deger: 5, ozellik: "guven" }] },
    ],
  },
  {
    id: "rastgele-kaza",
    baslik: "Küçük Kaza",
    aciklama: "Dikkatsizlik sonucu küçük bir kaza yaşadın.",
    kategori: "rastgele",
    yasGrubu: ["cocuk", "ilkokul", "ergen", "genc", "yetiskin", "orta_yas", "yasli"],
    oncelik: 30,
    secenekler: [
      { id: "s1", metin: "Doktora git", sonuc: "Hafif yaralandın, tedavi gördün.", etkiler: [{ tip: "saglik", deger: -5 }, { tip: "para", deger: -300 }] },
      { id: "s2", metin: "Evde tedavi et", sonuc: "Kendi kendine iyileşiyorsun.", etkiler: [{ tip: "saglik", deger: -8 }] },
    ],
  },

  // Yaşlı olayları
  {
    id: "yasli-emeklilik",
    baslik: "Emeklilik Zamanı",
    aciklama: "Çalışma hayatını tamamladın. Emeklilik hayatı başlıyor!",
    kategori: "kariyer",
    yasGrubu: ["yasli", "orta_yas"],
    oncelik: 80,
    secenekler: [
      { id: "s1", metin: "Emekli ol ve dinlen", sonuc: "Huzurlu emeklilik hayatı.", etkiler: [{ tip: "mutluluk", deger: 10 }, { tip: "stres", deger: -20 }] },
      { id: "s2", metin: "Çalışmaya devam et", sonuc: "İş hayatına devam ediyorsun.", etkiler: [{ tip: "para", deger: 5000 }] },
    ],
  },
  {
    id: "yasli-torun",
    baslik: "Torun Ziyareti",
    aciklama: "Torunlarını ziyarete geldi. Onlarla vakit geçirmek istiyorsun.",
    kategori: "aile",
    yasGrubu: ["yasli", "ileri_yas"],
    oncelik: 65,
    secenekler: [
      { id: "s1", metin: "Onlarla oyun oyna", sonuc: "Mutlu bir gün geçirdin!", etkiler: [{ tip: "mutluluk", deger: 15 }] },
      { id: "s2", metin: "Hikayeler anlat", sonuc: "Torunlar hikayelerini dinledi.", etkiler: [{ tip: "mutluluk", deger: 10 }] },
    ],
  },

  // Ek olaylar
  {
    id: "aile-aile-yemegi",
    baslik: "Aile Yemeği",
    aciklama: "Ailen birlikte yemek yemek istiyor.",
    kategori: "aile",
    yasGrubu: ["cocuk", "ilkokul", "ergen", "genc", "yetiskin", "orta_yas"],
    oncelik: 45,
    secenekler: [
      { id: "s1", metin: "Katıl", sonuc: "Güzel bir aile yemeği yaptınız.", etkiler: [{ tip: "mutluluk", deger: 8 }] },
      { id: "s2", metin: "Bahane bul", sonuc: "Ailen biraz kırıldı.", etkiler: [{ tip: "stres", deger: 5 }] },
    ],
  },
  {
    id: "kariyer-terfi",
    baslik: "Terfi Fırsatı",
    aciklama: "Patronun seni terfi ettirmek istiyor!",
    kategori: "kariyer",
    yasGrubu: ["genc", "yetiskin", "orta_yas"],
    oncelik: 55,
    secenekler: [
      { id: "s1", metin: "Kabul et", sonuc: "Terfi aldın!", etkiler: [{ tip: "para", deger: 5000 }, { tip: "mutluluk", deger: 10 }] },
      { id: "s2", metin: "Reddet", sonuc: "Mevcut pozisyonunda kaldın.", etkiler: [{ tip: "stres", deger: -5 }] },
    ],
  },
  {
    id: "sosyal-festival",
    baslik: "Şehir Festivali",
    aciklama: "Şehirde büyük bir festival düzenleniyor!",
    kategori: "sosyal",
    yasGrubu: ["ergen", "genc", "yetiskin", "orta_yas"],
    oncelik: 40,
    secenekler: [
      { id: "s1", metin: "Festivale git", sonuc: "Eğlenceli bir gün!", etkiler: [{ tip: "mutluluk", deger: 10 }, { tip: "para", deger: -200 }] },
      { id: "s2", metin: "Evde kal", sonuc: "Sessiz bir gün geçirdin." },
    ],
  },
  {
    id: "finans-miras",
    baslik: "Akrabadan Miras",
    aciklama: "Uzak bir akrabadan miras kaldı!",
    kategori: "finans",
    yasGrubu: ["genc", "yetiskin", "orta_yas", "yasli"],
    oncelik: 25,
    secenekler: [
      { id: "s1", metin: "Mirası kabul et", sonuc: "Beklenmedik bir gelir!", etkiler: [{ tip: "para", deger: 50000 }] },
    ],
  },
  {
    id: "saglik-depresyon",
    baslik: "Moralin Bozuk",
    aciklama: "Son zamanlarda kendini kötü hissediyorsun.",
    kategori: "saglik",
    yasGrubu: ["ergen", "genc", "yetiskin", "orta_yas", "yasli"],
    oncelik: 35,
    secenekler: [
      { id: "s1", metin: "Psikoloğa git", sonuc: "Profesyonel destek aldın.", etkiler: [{ tip: "stres", deger: -15 }, { tip: "para", deger: -800 }] },
      { id: "s2", metin: "Arkadaşlarınla konuş", sonuc: "Destek aldın.", etkiler: [{ tip: "mutluluk", deger: 5 }] },
      { id: "s3", metin: "Görmezden gel", sonuc: "Stresin arttı.", etkiler: [{ tip: "stres", deger: 10 }] },
    ],
  },
  {
    id: "romantik-evlilik-teklifi",
    baslik: "Evlilik Teklifi",
    aciklama: "Sevgilin sana evlilik teklif ediyor!",
    kategori: "romantik",
    yasGrubu: ["genc", "yetiskin"],
    oncelik: 70,
    minYas: 18,
    secenekler: [
      { id: "s1", metin: "Evet de", sonuc: "Nişanlandınız!", etkiler: [{ tip: "mutluluk", deger: 20 }] },
      { id: "s2", metin: "Hayır de", sonuc: "İlişki sona erdi.", etkiler: [{ tip: "mutluluk", deger: -10 }, { tip: "stres", deger: 15 }] },
    ],
  },
  {
    id: "rastgele-piyango",
    baslik: "Piyango Bileti",
    aciklama: "Bir piyango bileti aldın. Sonuçları açıklandı!",
    kategori: "rastgele",
    yasGrubu: ["genc", "yetiskin", "orta_yas"],
    oncelik: 15,
    secenekler: [
      { id: "s1", metin: "Bileti kontrol et", sonuc: "Bu sefer kazanamadın.", etkiler: [{ tip: "para", deger: -50 }] },
      { id: "s2", metin: "Bir daha al", sonuc: "Şansını tekrar denedin!", etkiler: [{ tip: "para", deger: -50 }, { tip: "mutluluk", deger: 3 }] },
    ],
  },
  {
    id: "egitim-burs",
    baslik: "Burs Fırsatı",
    aciklama: "Üniversitede burs kazanma şansın var!",
    kategori: "egitim",
    yasGrubu: ["genc"],
    oncelik: 60,
    secenekler: [
      { id: "s1", metin: "Başvur", sonuc: "Burs kazandın!", etkiler: [{ tip: "para", deger: 3000 }, { tip: "ozellik", deger: 5, ozellik: "zeka" }] },
      { id: "s2", metin: "Başvurma", sonuc: "Fırsatı kaçırdın." },
    ],
  },
  {
    id: "ileri-yas-vasiyet",
    baslik: "Vasiyetname",
    aciklama: "Vasiyetname hazırlama zamanı geldi.",
    kategori: "yasam",
    yasGrubu: ["ileri_yas", "yasli"],
    oncelik: 50,
    secenekler: [
      { id: "s1", metin: "Hazırla", sonuc: "Vasiyetname düzenlendi.", etkiler: [{ tip: "mutluluk", deger: 5 }] },
      { id: "s2", metin: "Ertele", sonuc: "Konuyu erteledin." },
    ],
  },
];

const events: GameEvent[] = [
  ...baseEvents,
  ...extraEvents,
  ...generateProceduralEvents(500),
];

export function getEventsForAgeGroup(ageGroup: AgeGroup): GameEvent[] {
  return events.filter((e) => e.yasGrubu.includes(ageGroup));
}

export function getRandomEvent(ageGroup: AgeGroup): GameEvent | null {
  const available = getEventsForAgeGroup(ageGroup);
  if (available.length === 0) return null;

  const totalWeight = available.reduce((sum, e) => sum + e.oncelik, 0);
  let random = Math.random() * totalWeight;

  for (const event of available) {
    random -= event.oncelik;
    if (random <= 0) return event;
  }

  return available[0];
}

export function getEventsByCategory(category: EventCategory): GameEvent[] {
  return events.filter((e) => e.kategori === category);
}

export function getAllEvents(): GameEvent[] {
  return events;
}

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  aile: "Aile",
  egitim: "Eğitim",
  kariyer: "Kariyer",
  saglik: "Sağlık",
  sosyal: "Sosyal",
  finans: "Finans",
  romantik: "Romantik",
  rastgele: "Rastgele",
  yasam: "Yaşam",
};
