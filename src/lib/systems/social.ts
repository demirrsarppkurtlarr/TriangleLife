export interface SocialActivity {
  id: string;
  ad: string;
  kategori: "kulup" | "konser" | "festival" | "etkinlik";
  maliyet: number;
  mutluluk: number;
  sosyallik: number;
  minYas: number;
  aciklama: string;
}

export const SOCIAL_ACTIVITIES: SocialActivity[] = [
  // Kulüpler
  { id: "kulup-kitap", ad: "Kitap Kulübü", kategori: "kulup", maliyet: 100, mutluluk: 5, sosyallik: 8, minYas: 12, aciklama: "Kitap kulübüne katıldın." },
  { id: "kulup-spor", ad: "Spor Kulübü", kategori: "kulup", maliyet: 300, mutluluk: 8, sosyallik: 10, minYas: 10, aciklama: "Spor kulübüne katıldın." },
  { id: "kulup-muzik", ad: "Müzik Kulübü", kategori: "kulup", maliyet: 200, mutluluk: 10, sosyallik: 8, minYas: 8, aciklama: "Müzik kulübüne katıldın." },
  { id: "kulup-fotograf", ad: "Fotoğraf Kulübü", kategori: "kulup", maliyet: 250, mutluluk: 7, sosyallik: 6, minYas: 14, aciklama: "Fotoğraf kulübüne katıldın." },
  { id: "kulup-yemek", ad: "Yemek Kulübü", kategori: "kulup", maliyet: 150, mutluluk: 8, sosyallik: 7, minYas: 16, aciklama: "Yemek kulübüne katıldın." },
  { id: "kulup-dans", ad: "Dans Kulübü", kategori: "kulup", maliyet: 400, mutluluk: 12, sosyallik: 10, minYas: 14, aciklama: "Dans kulübüne katıldın." },
  { id: "kulup-teknoloji", ad: "Teknoloji Kulübü", kategori: "kulup", maliyet: 200, mutluluk: 6, sosyallik: 8, minYas: 14, aciklama: "Teknoloji kulübüne katıldın." },
  { id: "kulup-doga", ad: "Doğa Yürüyüş Kulübü", kategori: "kulup", maliyet: 100, mutluluk: 10, sosyallik: 6, minYas: 12, aciklama: "Doğa yürüyüş kulübüne katıldın." },

  // Konserler
  { id: "konser-pop", ad: "Pop Konseri", kategori: "konser", maliyet: 500, mutluluk: 15, sosyallik: 5, minYas: 12, aciklama: "Pop konserine gittin!" },
  { id: "konser-rock", ad: "Rock Konseri", kategori: "konser", maliyet: 600, mutluluk: 15, sosyallik: 5, minYas: 14, aciklama: "Rock konserine gittin!" },
  { id: "konser-klasik", ad: "Klasik Müzik Konseri", kategori: "konser", maliyet: 400, mutluluk: 10, sosyallik: 3, minYas: 16, aciklama: "Klasik müzik konserine gittin." },
  { id: "konser-jazz", ad: "Caz Konseri", kategori: "konser", maliyet: 450, mutluluk: 12, sosyallik: 4, minYas: 18, aciklama: "Caz konserine gittin." },
  { id: "konser-rap", ad: "Rap Konseri", kategori: "konser", maliyet: 550, mutluluk: 14, sosyallik: 6, minYas: 14, aciklama: "Rap konserine gittin!" },

  // Festivaller
  { id: "festival-muzik", ad: "Müzik Festivali", kategori: "festival", maliyet: 1500, mutluluk: 20, sosyallik: 12, minYas: 16, aciklama: "Müzik festivaline katıldın!" },
  { id: "festival-film", ad: "Film Festivali", kategori: "festival", maliyet: 800, mutluluk: 12, sosyallik: 8, minYas: 14, aciklama: "Film festivaline katıldın." },
  { id: "festival-yemek", ad: "Yemek Festivali", kategori: "festival", maliyet: 600, mutluluk: 15, sosyallik: 8, minYas: 12, aciklama: "Yemek festivaline katıldın!" },
  { id: "festival-sanat", ad: "Sanat Festivali", kategori: "festival", maliyet: 700, mutluluk: 12, sosyallik: 6, minYas: 14, aciklama: "Sanat festivaline katıldın." },
  { id: "festival-teknoloji", ad: "Teknoloji Festivali", kategori: "festival", maliyet: 1000, mutluluk: 10, sosyallik: 10, minYas: 16, aciklama: "Teknoloji festivaline katıldın." },

  // Etkinlikler
  { id: "etkinlik-bar", ad: "Bar Gecesi", kategori: "etkinlik", maliyet: 300, mutluluk: 8, sosyallik: 10, minYas: 18, aciklama: "Arkadaşlarla bara gittin." },
  { id: "etkinlik-piknik", ad: "Piknik", kategori: "etkinlik", maliyet: 150, mutluluk: 10, sosyallik: 8, minYas: 6, aciklama: "Piknik yaptın." },
  { id: "etkinlik-sinema", ad: "Sinema", kategori: "etkinlik", maliyet: 200, mutluluk: 8, sosyallik: 5, minYas: 8, aciklama: "Sinema gecesi!" },
  { id: "etkinlik-oyun", ad: "Oyun Gecesi", kategori: "etkinlik", maliyet: 100, mutluluk: 10, sosyallik: 8, minYas: 10, aciklama: "Oyun gecesi düzenledin." },
  { id: "etkinlik-kahve", ad: "Kahve Buluşması", kategori: "etkinlik", maliyet: 80, mutluluk: 6, sosyallik: 7, minYas: 14, aciklama: "Arkadaşlarla kahve içtin." },
  { id: "etkinlik-yoga", ad: "Yoga Dersi", kategori: "etkinlik", maliyet: 250, mutluluk: 8, sosyallik: 4, minYas: 16, aciklama: "Yoga dersine katıldın." },
  { id: "etkinlik-tiyatro", ad: "Tiyatro", kategori: "etkinlik", maliyet: 350, mutluluk: 10, sosyallik: 5, minYas: 12, aciklama: "Tiyatro oyununa gittin." },
  { id: "etkinlik-muzik", ad: "Canlı Müzik", kategori: "etkinlik", maliyet: 400, mutluluk: 12, sosyallik: 6, minYas: 16, aciklama: "Canlı müzik dinledin." },
];

export const SOCIAL_CATEGORY_LABELS: Record<SocialActivity["kategori"], string> = {
  kulup: "Kulüpler",
  konser: "Konserler",
  festival: "Festivaller",
  etkinlik: "Etkinlikler",
};

export function getActivitiesForAge(yas: number): SocialActivity[] {
  return SOCIAL_ACTIVITIES.filter((a) => yas >= a.minYas);
}
