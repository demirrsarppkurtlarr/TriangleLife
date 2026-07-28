-- ============================================================
-- TriangleLife — Tam Veritabanı Şeması
-- Supabase SQL Editor'a tek seferde yapıştırılabilir
-- Sıfırdan kurulum veya yeniden kurulum için hazırlanmıştır
-- ============================================================

-- ============================================================
-- TEMİZLİK (mevcut kurulum varsa kaldırır)
-- ============================================================

DROP VIEW IF EXISTS family_summary CASCADE;
DROP VIEW IF EXISTS player_summary CASCADE;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS advance_year(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_age_group(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;

DROP TABLE IF EXISTS npc_memories CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS social_activities CASCADE;
DROP TABLE IF EXISTS career_records CASCADE;
DROP TABLE IF EXISTS education_records CASCADE;
DROP TABLE IF EXISTS company_employees CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS event_logs CASCADE;
DROP TABLE IF EXISTS relationships CASCADE;
DROP TABLE IF EXISTS characters CASCADE;
DROP TABLE IF EXISTS lives CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS vehicle_type CASCADE;
DROP TYPE IF EXISTS investment_type CASCADE;
DROP TYPE IF EXISTS property_type CASCADE;
DROP TYPE IF EXISTS event_category CASCADE;
DROP TYPE IF EXISTS relationship_type CASCADE;
DROP TYPE IF EXISTS education_level CASCADE;
DROP TYPE IF EXISTS age_group CASCADE;
DROP TYPE IF EXISTS life_status CASCADE;
DROP TYPE IF EXISTS gender_type CASCADE;

-- ============================================================
-- UZANTILAR
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM TİPLERİ
-- ============================================================

CREATE TYPE gender_type AS ENUM ('erkek', 'kadin');
CREATE TYPE life_status AS ENUM ('yasiyor', 'oldu');
CREATE TYPE age_group AS ENUM (
  'bebek', 'cocuk', 'ilkokul', 'ergen', 'genc',
  'yetiskin', 'orta_yas', 'yasli', 'ileri_yas'
);
CREATE TYPE education_level AS ENUM (
  'kres', 'anaokulu', 'ilkokul', 'ortaokul', 'lise',
  'universite', 'yuksek_lisans', 'doktora', 'yok'
);
CREATE TYPE relationship_type AS ENUM (
  'anne', 'baba', 'kardes', 'es', 'cocuk', 'arkadas',
  'sevgili', 'akraba', 'is_arkadasi', 'diger'
);
CREATE TYPE event_category AS ENUM (
  'aile', 'egitim', 'kariyer', 'saglik', 'sosyal',
  'finans', 'romantik', 'rastgele', 'yasam'
);
CREATE TYPE property_type AS ENUM ('ev', 'arac');
CREATE TYPE investment_type AS ENUM ('hisse', 'etf', 'altin', 'kripto');
CREATE TYPE vehicle_type AS ENUM (
  'bisiklet', 'motosiklet', 'otomobil', 'suv', 'spor',
  'elektrikli', 'yat', 'helikopter', 'jet'
);

-- ============================================================
-- PROFİLLER (auth.users ile bağlantılı)
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- HAYATLAR
-- ============================================================

CREATE TABLE lives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  baslangic_yili INTEGER NOT NULL,
  mevcut_yil INTEGER NOT NULL,
  para NUMERIC(15, 2) NOT NULL DEFAULT 0,
  banka_bakiyesi NUMERIC(15, 2) NOT NULL DEFAULT 0,
  kredi_borcu NUMERIC(15, 2) NOT NULL DEFAULT 0,
  ev_id UUID,
  arac_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lives_user_id ON lives(user_id);
CREATE INDEX idx_lives_aktif ON lives(aktif) WHERE aktif = TRUE;

-- ============================================================
-- KARAKTERLER
-- ============================================================

CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  life_id UUID NOT NULL REFERENCES lives(id) ON DELETE CASCADE,
  isim TEXT NOT NULL,
  soyisim TEXT NOT NULL,
  yas INTEGER NOT NULL DEFAULT 0,
  dogum_yili INTEGER NOT NULL,
  cinsiyet gender_type NOT NULL,
  meslek TEXT,
  gelir NUMERIC(12, 2) NOT NULL DEFAULT 0,
  is_player BOOLEAN NOT NULL DEFAULT FALSE,

  -- Kişilik özellikleri
  mutluluk INTEGER NOT NULL DEFAULT 50 CHECK (mutluluk BETWEEN 0 AND 100),
  saglik INTEGER NOT NULL DEFAULT 70 CHECK (saglik BETWEEN 0 AND 100),
  zeka INTEGER NOT NULL DEFAULT 50 CHECK (zeka BETWEEN 0 AND 100),
  sabir INTEGER NOT NULL DEFAULT 50 CHECK (sabir BETWEEN 0 AND 100),
  comertlik INTEGER NOT NULL DEFAULT 50 CHECK (comertlik BETWEEN 0 AND 100),
  sosyallik INTEGER NOT NULL DEFAULT 50 CHECK (sosyallik BETWEEN 0 AND 100),
  guven INTEGER NOT NULL DEFAULT 50 CHECK (guven BETWEEN 0 AND 100),
  sevgi INTEGER NOT NULL DEFAULT 50 CHECK (sevgi BETWEEN 0 AND 100),
  empati INTEGER NOT NULL DEFAULT 50 CHECK (empati BETWEEN 0 AND 100),

  -- Sağlık sistemi
  stres INTEGER NOT NULL DEFAULT 20 CHECK (stres BETWEEN 0 AND 100),
  uyku INTEGER NOT NULL DEFAULT 70 CHECK (uyku BETWEEN 0 AND 100),
  beslenme INTEGER NOT NULL DEFAULT 70 CHECK (beslenme BETWEEN 0 AND 100),
  kilo NUMERIC(5, 1) NOT NULL DEFAULT 50,
  psikoloji INTEGER NOT NULL DEFAULT 60 CHECK (psikoloji BETWEEN 0 AND 100),

  egitim education_level NOT NULL DEFAULT 'yok',
  durum life_status NOT NULL DEFAULT 'yasiyor',
  anne_id UUID REFERENCES characters(id),
  baba_id UUID REFERENCES characters(id),
  es_id UUID REFERENCES characters(id),
  sehir TEXT NOT NULL DEFAULT 'İstanbul',
  ulke TEXT NOT NULL DEFAULT 'Türkiye',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_characters_life_id ON characters(life_id);
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_is_player ON characters(is_player) WHERE is_player = TRUE;

-- ============================================================
-- İLİŞKİLER
-- ============================================================

CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  life_id UUID NOT NULL REFERENCES lives(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  tip relationship_type NOT NULL,
  puan INTEGER NOT NULL DEFAULT 50 CHECK (puan BETWEEN 0 AND 100),
  romantik BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(life_id, character_id, target_id)
);

CREATE INDEX idx_relationships_life_id ON relationships(life_id);
CREATE INDEX idx_relationships_character_id ON relationships(character_id);

-- ============================================================
-- OLAY KAYITLARI
-- ============================================================

CREATE TABLE event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  life_id UUID NOT NULL REFERENCES lives(id) ON DELETE CASCADE,
  yil INTEGER NOT NULL,
  yas INTEGER NOT NULL,
  baslik TEXT NOT NULL,
  aciklama TEXT NOT NULL,
  kategori event_category NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_logs_life_id ON event_logs(life_id);
CREATE INDEX idx_event_logs_created_at ON event_logs(created_at DESC);

-- ============================================================
-- MÜLKLER (Ev ve Araç)
-- ============================================================

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  life_id UUID NOT NULL REFERENCES lives(id) ON DELETE CASCADE,
  tip property_type NOT NULL,
  ad TEXT NOT NULL,
  deger NUMERIC(15, 2) NOT NULL,
  kira NUMERIC(12, 2) NOT NULL DEFAULT 0,
  satin_alindi BOOLEAN NOT NULL DEFAULT FALSE,
  arac_tipi vehicle_type,
  detaylar JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_properties_life_id ON properties(life_id);

-- lives tablosuna foreign key ekle
ALTER TABLE lives
  ADD CONSTRAINT fk_lives_ev FOREIGN KEY (ev_id) REFERENCES properties(id),
  ADD CONSTRAINT fk_lives_arac FOREIGN KEY (arac_id) REFERENCES properties(id);

-- ============================================================
-- ŞİRKETLER
-- ============================================================

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  life_id UUID NOT NULL REFERENCES lives(id) ON DELETE CASCADE,
  ad TEXT NOT NULL,
  sektor TEXT NOT NULL,
  deger NUMERIC(15, 2) NOT NULL DEFAULT 0,
  gelir NUMERIC(12, 2) NOT NULL DEFAULT 0,
  calisan_sayisi INTEGER NOT NULL DEFAULT 0,
  kurulus_yili INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_companies_life_id ON companies(life_id);

-- ============================================================
-- ŞİRKET ÇALIŞANLARI
-- ============================================================

CREATE TABLE company_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  pozisyon TEXT NOT NULL,
  maas NUMERIC(12, 2) NOT NULL,
  baslangic_yili INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company_id, character_id)
);

CREATE INDEX idx_company_employees_company_id ON company_employees(company_id);

-- ============================================================
-- YATIRIMLAR
-- ============================================================

CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  life_id UUID NOT NULL REFERENCES lives(id) ON DELETE CASCADE,
  tip investment_type NOT NULL,
  sembol TEXT NOT NULL,
  miktar NUMERIC(18, 8) NOT NULL,
  alis_fiyati NUMERIC(15, 2) NOT NULL,
  mevcut_fiyat NUMERIC(15, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_investments_life_id ON investments(life_id);

-- ============================================================
-- KREDİLER
-- ============================================================

CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  life_id UUID NOT NULL REFERENCES lives(id) ON DELETE CASCADE,
  tutar NUMERIC(15, 2) NOT NULL,
  kalan_borc NUMERIC(15, 2) NOT NULL,
  faiz_orani NUMERIC(5, 2) NOT NULL,
  aylik_odeme NUMERIC(12, 2) NOT NULL,
  baslangic_yili INTEGER NOT NULL,
  bitis_yili INTEGER NOT NULL,
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_loans_life_id ON loans(life_id);
CREATE INDEX idx_loans_aktif ON loans(aktif) WHERE aktif = TRUE;

-- ============================================================
-- EĞİTİM KAYITLARI
-- ============================================================

CREATE TABLE education_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  seviye education_level NOT NULL,
  kurum TEXT,
  baslangic_yili INTEGER NOT NULL,
  bitis_yili INTEGER,
  not_ortalamasi NUMERIC(4, 2),
  tamamlandi BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_education_records_character_id ON education_records(character_id);

-- ============================================================
-- KARİYER KAYITLARI
-- ============================================================

CREATE TABLE career_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  meslek TEXT NOT NULL,
  sirket TEXT,
  maas NUMERIC(12, 2) NOT NULL,
  baslangic_yili INTEGER NOT NULL,
  bitis_yili INTEGER,
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_career_records_character_id ON career_records(character_id);

-- ============================================================
-- SOSYAL ETKİNLİKLER
-- ============================================================

CREATE TABLE social_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  life_id UUID NOT NULL REFERENCES lives(id) ON DELETE CASCADE,
  ad TEXT NOT NULL,
  kategori TEXT NOT NULL,
  yil INTEGER NOT NULL,
  maliyet NUMERIC(12, 2) NOT NULL DEFAULT 0,
  mutluluk_etkisi INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_social_activities_life_id ON social_activities(life_id);

-- ============================================================
-- BAŞARIMLAR
-- ============================================================

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kod TEXT NOT NULL UNIQUE,
  ad TEXT NOT NULL,
  aciklama TEXT NOT NULL,
  ikon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  life_id UUID NOT NULL REFERENCES lives(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  kazanildi_yil INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id, life_id)
);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);

-- ============================================================
-- NPC HAFIZA (Yapay Zeka)
-- ============================================================

CREATE TABLE npc_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  life_id UUID NOT NULL REFERENCES lives(id) ON DELETE CASCADE,
  npc_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  olay TEXT NOT NULL,
  duygu TEXT NOT NULL DEFAULT 'notr',
  puan_etkisi INTEGER NOT NULL DEFAULT 0,
  yil INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_npc_memories_npc_id ON npc_memories(npc_id);
CREATE INDEX idx_npc_memories_life_id ON npc_memories(life_id);

-- ============================================================
-- TRIGGER: updated_at otomatik güncelleme
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_lives_updated_at
  BEFORE UPDATE ON lives FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_characters_updated_at
  BEFORE UPDATE ON characters FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_relationships_updated_at
  BEFORE UPDATE ON relationships FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_properties_updated_at
  BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_companies_updated_at
  BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_investments_updated_at
  BEFORE UPDATE ON investments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_loans_updated_at
  BEFORE UPDATE ON loans FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: Yeni kullanıcı profil oluşturma
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- VIEW: Oyuncu özeti
-- ============================================================

CREATE VIEW player_summary WITH (security_invoker = true) AS
SELECT
  c.id AS character_id,
  c.life_id,
  c.isim,
  c.soyisim,
  c.yas,
  c.cinsiyet,
  c.meslek,
  c.gelir,
  c.mutluluk,
  c.saglik,
  c.stres,
  c.egitim,
  c.durum,
  c.sehir,
  l.mevcut_yil,
  l.para,
  l.banka_bakiyesi,
  l.kredi_borcu
FROM characters c
JOIN lives l ON l.id = c.life_id
WHERE c.is_player = TRUE AND l.aktif = TRUE;

-- ============================================================
-- VIEW: Aile özeti
-- ============================================================

CREATE VIEW family_summary WITH (security_invoker = true) AS
SELECT
  c.id AS character_id,
  c.life_id,
  c.isim,
  c.soyisim,
  c.yas,
  c.cinsiyet,
  c.meslek,
  c.gelir,
  c.durum,
  r.tip AS iliski_tipi,
  r.puan AS iliski_puan
FROM characters c
JOIN relationships r ON r.target_id = c.id
WHERE c.is_player = FALSE;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lives ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE npc_memories ENABLE ROW LEVEL SECURITY;

-- Profiller
CREATE POLICY profiles_select ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);

-- Hayatlar
CREATE POLICY lives_select ON lives FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY lives_insert ON lives FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY lives_update ON lives FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY lives_delete ON lives FOR DELETE USING (auth.uid() = user_id);

-- Karakterler
CREATE POLICY characters_select ON characters FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY characters_insert ON characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY characters_update ON characters FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY characters_delete ON characters FOR DELETE
  USING (auth.uid() = user_id);

-- İlişkiler
CREATE POLICY relationships_select ON relationships FOR SELECT
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = relationships.life_id AND lives.user_id = auth.uid()));
CREATE POLICY relationships_insert ON relationships FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM lives WHERE lives.id = relationships.life_id AND lives.user_id = auth.uid()));
CREATE POLICY relationships_update ON relationships FOR UPDATE
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = relationships.life_id AND lives.user_id = auth.uid()));
CREATE POLICY relationships_delete ON relationships FOR DELETE
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = relationships.life_id AND lives.user_id = auth.uid()));

-- Olay kayıtları
CREATE POLICY event_logs_select ON event_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = event_logs.life_id AND lives.user_id = auth.uid()));
CREATE POLICY event_logs_insert ON event_logs FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM lives WHERE lives.id = event_logs.life_id AND lives.user_id = auth.uid()));

-- Mülkler
CREATE POLICY properties_select ON properties FOR SELECT
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = properties.life_id AND lives.user_id = auth.uid()));
CREATE POLICY properties_insert ON properties FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM lives WHERE lives.id = properties.life_id AND lives.user_id = auth.uid()));
CREATE POLICY properties_update ON properties FOR UPDATE
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = properties.life_id AND lives.user_id = auth.uid()));
CREATE POLICY properties_delete ON properties FOR DELETE
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = properties.life_id AND lives.user_id = auth.uid()));

-- Şirketler
CREATE POLICY companies_select ON companies FOR SELECT
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = companies.life_id AND lives.user_id = auth.uid()));
CREATE POLICY companies_insert ON companies FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM lives WHERE lives.id = companies.life_id AND lives.user_id = auth.uid()));
CREATE POLICY companies_update ON companies FOR UPDATE
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = companies.life_id AND lives.user_id = auth.uid()));
CREATE POLICY companies_delete ON companies FOR DELETE
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = companies.life_id AND lives.user_id = auth.uid()));

-- Yatırımlar
CREATE POLICY investments_select ON investments FOR SELECT
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = investments.life_id AND lives.user_id = auth.uid()));
CREATE POLICY investments_insert ON investments FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM lives WHERE lives.id = investments.life_id AND lives.user_id = auth.uid()));
CREATE POLICY investments_update ON investments FOR UPDATE
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = investments.life_id AND lives.user_id = auth.uid()));
CREATE POLICY investments_delete ON investments FOR DELETE
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = investments.life_id AND lives.user_id = auth.uid()));

-- Krediler
CREATE POLICY loans_select ON loans FOR SELECT
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = loans.life_id AND lives.user_id = auth.uid()));
CREATE POLICY loans_insert ON loans FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM lives WHERE lives.id = loans.life_id AND lives.user_id = auth.uid()));
CREATE POLICY loans_update ON loans FOR UPDATE
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = loans.life_id AND lives.user_id = auth.uid()));

-- Eğitim kayıtları
CREATE POLICY education_records_select ON education_records FOR SELECT
  USING (EXISTS (SELECT 1 FROM characters WHERE characters.id = education_records.character_id AND characters.user_id = auth.uid()));
CREATE POLICY education_records_insert ON education_records FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM characters WHERE characters.id = education_records.character_id AND characters.user_id = auth.uid()));

-- Kariyer kayıtları
CREATE POLICY career_records_select ON career_records FOR SELECT
  USING (EXISTS (SELECT 1 FROM characters WHERE characters.id = career_records.character_id AND characters.user_id = auth.uid()));
CREATE POLICY career_records_insert ON career_records FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM characters WHERE characters.id = career_records.character_id AND characters.user_id = auth.uid()));
CREATE POLICY career_records_update ON career_records FOR UPDATE
  USING (EXISTS (SELECT 1 FROM characters WHERE characters.id = career_records.character_id AND characters.user_id = auth.uid()));

-- Sosyal etkinlikler
CREATE POLICY social_activities_select ON social_activities FOR SELECT
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = social_activities.life_id AND lives.user_id = auth.uid()));
CREATE POLICY social_activities_insert ON social_activities FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM lives WHERE lives.id = social_activities.life_id AND lives.user_id = auth.uid()));

-- Başarımlar (herkes okuyabilir)
CREATE POLICY achievements_select ON achievements FOR SELECT USING (TRUE);

-- Kullanıcı başarımları
CREATE POLICY user_achievements_select ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY user_achievements_insert ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- NPC hafıza
CREATE POLICY npc_memories_select ON npc_memories FOR SELECT
  USING (EXISTS (SELECT 1 FROM lives WHERE lives.id = npc_memories.life_id AND lives.user_id = auth.uid()));
CREATE POLICY npc_memories_insert ON npc_memories FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM lives WHERE lives.id = npc_memories.life_id AND lives.user_id = auth.uid()));

-- Şirket çalışanları
CREATE POLICY company_employees_select ON company_employees FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM companies c JOIN lives l ON l.id = c.life_id
    WHERE c.id = company_employees.company_id AND l.user_id = auth.uid()
  ));
CREATE POLICY company_employees_insert ON company_employees FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM companies c JOIN lives l ON l.id = c.life_id
    WHERE c.id = company_employees.company_id AND l.user_id = auth.uid()
  ));
CREATE POLICY company_employees_delete ON company_employees FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM companies c JOIN lives l ON l.id = c.life_id
    WHERE c.id = company_employees.company_id AND l.user_id = auth.uid()
  ));

-- ============================================================
-- BAŞLANGIÇ VERİLERİ: Başarımlar
-- ============================================================

INSERT INTO achievements (kod, ad, aciklama, ikon) VALUES
  ('ilk_adim', 'İlk Adım', 'İlk yılını tamamladın.', 'baby'),
  ('okuryazar', 'Okuryazar', 'İlkokulu bitirdin.', 'book'),
  ('mezun', 'Mezun', 'Üniversiteyi bitirdin.', 'graduation'),
  ('ilk_is', 'İlk İş', 'İlk işini buldun.', 'briefcase'),
  ('zengin', 'Zengin', '1 milyon TL biriktirdin.', 'money'),
  ('ev_sahibi', 'Ev Sahibi', 'Kendi evini satın aldın.', 'home'),
  ('evli', 'Evli', 'Evlendin.', 'heart'),
  ('ebeveyn', 'Ebeveyn', 'İlk çocuğun doğdu.', 'family'),
  ('ceo', 'CEO', 'Kendi şirketinin CEO''su oldun.', 'building'),
  ('yatirimci', 'Yatırımcı', 'İlk yatırımını yaptın.', 'chart'),
  ('saglikli', 'Sağlıklı Yaşam', 'Sağlık puanın 90''a ulaştı.', 'health'),
  ('mutlu', 'Mutlu Hayat', 'Mutluluk puanın 90''a ulaştı.', 'smile'),
  ('uzun_yasam', 'Uzun Yaşam', '80 yaşına ulaştın.', 'clock'),
  ('bilge', 'Bilge', 'Zeka puanın 90''a ulaştı.', 'brain'),
  ('sosyal', 'Sosyal Kelebek', 'Sosyallik puanın 90''a ulaştı.', 'users');

-- ============================================================
-- FONKSİYON: Yaş grubu hesaplama
-- ============================================================

CREATE OR REPLACE FUNCTION get_age_group(yas INTEGER)
RETURNS age_group AS $$
BEGIN
  IF yas <= 2 THEN RETURN 'bebek';
  ELSIF yas <= 5 THEN RETURN 'cocuk';
  ELSIF yas <= 12 THEN RETURN 'ilkokul';
  ELSIF yas <= 17 THEN RETURN 'ergen';
  ELSIF yas <= 25 THEN RETURN 'genc';
  ELSIF yas <= 40 THEN RETURN 'yetiskin';
  ELSIF yas <= 60 THEN RETURN 'orta_yas';
  ELSIF yas <= 80 THEN RETURN 'yasli';
  ELSE RETURN 'ileri_yas';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- FONKSİYON: Yıl ilerletme
-- ============================================================

CREATE OR REPLACE FUNCTION advance_year(p_life_id UUID)
RETURNS VOID AS $$
DECLARE
  v_mevcut_yil INTEGER;
BEGIN
  SELECT mevcut_yil INTO v_mevcut_yil FROM lives WHERE id = p_life_id;

  UPDATE lives SET mevcut_yil = mevcut_yil + 1, updated_at = NOW()
  WHERE id = p_life_id;

  UPDATE characters SET
    yas = yas + 1,
    stres = GREATEST(0, LEAST(100, stres + (random() * 6 - 3)::INTEGER)),
    uyku = GREATEST(0, LEAST(100, uyku + (random() * 6 - 3)::INTEGER)),
    beslenme = GREATEST(0, LEAST(100, beslenme + (random() * 6 - 3)::INTEGER)),
    updated_at = NOW()
  WHERE life_id = p_life_id AND durum = 'yasiyor';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
