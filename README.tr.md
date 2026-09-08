# Video Annotation Tool (Video Açıklama Aracı)

<div align="center">

![Sürüm](https://img.shields.io/badge/sürüm-1.5.0-blue.svg)
![Lisans](https://img.shields.io/badge/lisans-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)
![Durum](https://img.shields.io/badge/durum-production--ready-success.svg)

**AI algılama, çoklu katman desteği ve profesyonel analiz özelliklerine sahip güçlü, platformlar arası video açıklama aracı.**

[🌐 English](README.md) | [🇹🇷 Türkçe](README.tr.md)

</div>

---

## 📖 Genel Bakış

**Video Annotation Tool**, hassas video analizi ve işaretleme işlemleri için tasarlanmış profesyonel bir masaüstü uygulamasıdır. **React** ve **Electron** ile geliştirilen bu araç, modern "Liquid Glass" arayüzünü; Yapay Zeka nesne tanıma, sesli notlar ve kare-kare gezinme gibi güçlü özelliklerle birleştirir.

**Spor analizi**, **eğitim içerikleri**, **tıbbi araştırmalar** veya **video düzenleme iş akışları** için ideal olan bu araç, video verilerini yerel makinenizde güvenli bir şekilde işaretlemenizi, analiz etmenizi ve dışa aktarmanızı sağlar.

## ✨ Temel Özellikler

### 🧠 **Akıllı Analiz & AI**

- ✅ **AI Nesne Algılama** ("Sihirli Değnek") - Cihaz içi makine öğrenimi (TensorFlow.js) kullanarak video karelerindeki kişi ve nesneleri otomatik olarak bulun.
- ✅ **Sesli Notlar** - Hızlı geri bildirim için doğrudan zaman çizelgesine sesli notlar kaydedin.
- ✅ **Sonsuz Tuval** - %500'e kadar Yakınlaştırın ve piksel hassasiyetinde detaylar için serbestçe Kaydırın (Pan).

### 🎥 **Video Kontrolü**

- ✅ **Evrensel Format Desteği** - MP4, WebM, OGG, MOV, AVI, MKV dosyalarını oynatır.
- ✅ **YouTube Desteği** - Standart YouTube videolarını yükleyin ve üzerine çizim yapın.
- ✅ **Kare Hassasiyetinde Gezinme** - Kare kare ileri/geri gidin.
- ✅ **Görsel Zaman Çizelgesi** - Yer imlerini ve çizimleri zaman çubuğu üzerinde işaretleyici olarak görün.

### ✏️ **Profesyonel Çizim Seti**

- ✅ **Vektör Araçlar** - Kalem, Çizgi, Dikdörtgen, Daire, Ok.
- ✅ **Metin & Damgalar** - Zengin metin etiketleri veya hızlı durum emojileri (✅ ❌ ❓ ❗) ekleyin.
- ✅ **Stil Özelleştirme** - Tam renk paleti, ayarlanabilir çizgi kalınlığı ve opaklık kontrolü.
- ✅ **Silgi & Düzenleme** - Herhangi bir çizimi sonradan düzenleyin, taşıyın veya silin.

### 📐 **Katman Yönetimi**

- ✅ **Çoklu Katman Sistemi** - Çizimleri sınırsız katmanda organize edin (örn: "Hücum", "Savunma", "Notlar").
- ✅ **Katman Kontrolleri** - Her katmanı kilitleyin, gizleyin, yeniden adlandırın veya şeffaflığını ayarlayın.

### 💾 **Kaydetme, Yükleme & Dışa Aktarma**

- ✅ **Proje Sürekliliği** - Projeleri yerel olarak otomatik kaydedin (IndexedDB).
- ✅ **Dışa Aktarma Seçenekleri** - İşaretlenmiş kareleri **PNG**, çizim verilerini **SVG** veya proje yapısını **JSON** olarak kaydedin.
- ✅ **Veri Çıktısı** - Yer imlerini ve zaman kodlarını **CSV** formatında dökün.

## 🚀 Başlangıç

### Gereksinimler

- **Node.js** (v20 veya üzeri)
- **npm** (v10 veya üzeri)

### Kurulum

```bash
git clone https://github.com/Sopwit/video-annotation-tool.git
cd video-annotation-tool
npm install
```

### Çalıştırma (Geliştirici Modu)

```bash
npm run electron:dev
```

### Kalite Kontrolleri

```bash
npm run clean
npm run lint
npm run test
npm run build
```

### Uygulama Olarak Derleme (Build)

```bash
# Mevcut işletim sisteminiz için derleyin
npm run electron:build

# Tüm platformlar için derleyin (Mac, Win, Linux)
npm run electron:build:all
```

Derlenen uygulama, bağımsız bir masaüstü programı olarak çalışacaktır.

## 📂 Proje Yapısı

```
video-annotation-tool/
├── backend/             # Electron ana süreci & IPC işleyicileri
│   ├── main.cjs
│   └── preload.cjs
├── src/                 # React uygulaması
│   ├── components/      # Yeniden kullanılabilir UI bileşenleri
│   ├── services/        # İş mantığı (AI, Veritabanı, Dışa Aktarma)
│   ├── store/           # Zustand durum yönetimi
│   ├── themes/          # Tema stilleri (Liquid Glass, Light, Dark)
│   ├── utils/           # Yardımcı fonksiyonlar
│   └── App.jsx
├── config/              # Yapılandırma dosyaları
├── scripts/             # Derleme ve bakım betikleri
├── tests/               # Birim testleri
├── docs/                # Dokümantasyon
└── release/             # Üretim Çıktıları
```

## ⌨️ Klavye Kısayolları

| Kategori | Kısayol | Açıklama |
| :--- | :--- | :--- |
| **Araçlar** | `P` / `E` / `C` / `T` / `S` | Kalem, Silgi, İmleç, Metin, Damga |
| **Şekiller** | `R` / `O` / `A` / `L` | Dikdörtgen, Daire, Ok, Çizgi |
| **Oynatma** | `Space` | Oynat / Duraklat |
| **Kare Gezinme** | `Sol Ok` / `Sağ Ok` | Kare Kare Geri / İleri (1/30sn) |
| **Saniye Atlama** | `Shift + Sol` / `Shift + Sağ` | -1sn / +1sn Atlama |
| **Zaman Çizelgesi** | `Home` / `End` | Başlangıca / Sona Git |
| **Yakınlaştırma & Kaydırma** | `Ctrl + Tekerlek` / `Shift + Sürükle` | Tuval Yakınlaştırma (%500) / Pan |
| **Düzenleme** | `Ctrl/Cmd + Z` / `Ctrl/Cmd + Shift + Z` | Geri Al / İleri Al |
| **Proje & Dışa Aktar** | `Ctrl/Cmd + S` / `Ctrl/Cmd + E` | Projeyi Kaydet / PNG Dışa Aktar |
| **Paneller** | `Ctrl/Cmd + B` / `Ctrl/Cmd + L` / `Ctrl/Cmd + T` | Notlar / Katmanlar / Zaman Çizelgesi |
| **Ayarlar & Yardım** | `Ctrl/Cmd + ,` / `?` / `Esc` | Ayarlar / Kısayol Yardımı / Görünümü Sıfırla |

## 📚 Dokümantasyon

Daha ayrıntılı bilgi için `docs/` klasörüne bakabilirsiniz:

- [Geliştirici Uygulama Rehberi](docs/IMPLEMENTATION_GUIDE.md) - Mimari ve kod açıklamaları.
- [Yol Haritası](docs/ROADMAP.md) - Gelecek planları.
- [Değişiklik Günlüğü](CHANGELOG.md) - Sürüm geçmişi.

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen Pull Request göndermek veya sorun bildirmek için [CONTRIBUTING.md](CONTRIBUTING.md) dosyasına bakın.

## 📝 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Detaylar için [LICENSE.md](LICENSE.md) dosyasına bakınız.

---

<div align="center">

**[Sopwit](https://github.com/Sopwit) tarafından ❤️ ile yapıldı**

</div>
