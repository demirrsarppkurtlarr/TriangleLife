export interface Neighbor {
  id: string;
  isim: string;
  yas: number;
  meslek: string;
  iliski: number;
}

export interface NeighborhoodState {
  mahalle: string;
  itibar: number;
  guvenlik: number;
  komşular: Neighbor[];
  sonOlay?: string;
}

const MAHALLE_ADLARI = [
  "Yeşiltepe", "Güneşli", "Merkez", "Bahçelievler", "Yeni Mahalle",
  "Çamlık", "Kültür", "İstiklal", "Atatürk", "Cumhuriyet",
];

const KOMŞU_ISIM = ["Ayşe teyze", "Mehmet amca", "Zeynep", "Can", "Fatma Hanım", "Ali Bey", "Selin", "Burak"];

export function createNeighborhood(sehir: string): NeighborhoodState {
  const seed = sehir.length + Math.floor(Math.random() * 5);
  const mahalle = MAHALLE_ADLARI[seed % MAHALLE_ADLARI.length];
  const count = 3 + Math.floor(Math.random() * 3);
  const komşular: Neighbor[] = Array.from({ length: count }, (_, i) => ({
    id: `nbr-${i}-${Date.now()}`,
    isim: KOMŞU_ISIM[(seed + i) % KOMŞU_ISIM.length],
    yas: 25 + ((seed * (i + 3)) % 50),
    meslek: ["Öğretmen", "Esnaf", "Emekli", "Mühendis", "Ev Hanımı"][i % 5],
    iliski: 40 + Math.floor(Math.random() * 30),
  }));

  return {
    mahalle: `${mahalle} (${sehir})`,
    itibar: 50,
    guvenlik: 45 + Math.floor(Math.random() * 30),
    komşular,
  };
}

export function neighborhoodYearTick(state: NeighborhoodState): NeighborhoodState {
  const drift = Math.floor((Math.random() - 0.5) * 6);
  const guvenlik = Math.max(20, Math.min(95, state.guvenlik + Math.floor((Math.random() - 0.5) * 4)));
  let sonOlay: string | undefined;
  if (Math.random() < 0.25) {
    sonOlay = [
      "Mahallede küçük bir hırsızlık haberi dolaşıyor.",
      "Park yenilendi; çocuklar sevindi.",
      "Marketin önünde uzun kuyruk oluştu.",
      "Komşular dayanışma için yardım kampanyası açtı.",
    ][Math.floor(Math.random() * 4)];
  }
  return {
    ...state,
    itibar: Math.max(0, Math.min(100, state.itibar + drift)),
    guvenlik,
    sonOlay,
    komşular: state.komşular.map((k) => ({
      ...k,
      iliski: Math.max(0, Math.min(100, k.iliski + Math.floor((Math.random() - 0.5) * 4))),
    })),
  };
}

export function helpNeighbor(state: NeighborhoodState, neighborId: string): NeighborhoodState {
  return {
    ...state,
    itibar: Math.min(100, state.itibar + 3),
    komşular: state.komşular.map((k) =>
      k.id === neighborId ? { ...k, iliski: Math.min(100, k.iliski + 5) } : k
    ),
    sonOlay: "Bir komşuya yardım ettin.",
  };
}
