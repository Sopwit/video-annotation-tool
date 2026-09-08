# 🎬 Video Annotation Tool (Video Açıklama Aracı)

<div align="center">

![Sürüm](https://img.shields.io/badge/sürüm-1.5.0-blue.svg?style=for-the-badge)
![Lisans](https://img.shields.io/badge/lisans-MIT-green.svg?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg?style=for-the-badge)
![Derleme](https://img.shields.io/badge/derleme-başarılı-brightgreen.svg?style=for-the-badge)

**Cihaz içi Yapay Zeka destekli, modern ve platformlar arası video analiz ve işaretleme paketi.**

[🌐 English](README.md) | [🇹🇷 Türkçe](README.tr.md) | [📖 Detaylı Dokümantasyon](docs/)

</div>

---

## 🌟 Öne Çıkan Özellikler

- **🧠 Cihaz İçi Yapay Zeka**: TensorFlow.js ile video karelerindeki kişi ve nesneleri yerel olarak otomatik tanıma.
- **✏️ Vektörel Çizim Paketi**: Kalem, Dikdörtgen, Daire, Ok, Çizgi, Metin ve Akıllı Emoji Damgaları.
- **🔍 Sonsuz Tuval**: %500'e kadar yakınlaştırma, akıcı kaydırma (pan) ve piksel hassasiyetinde koordinat eşleme.
- **🎙️ Zaman Çizelgesi Sesli Notları**: Kare ve zaman damgasıyla senkronize sesli yorum kaydetme.
- **🎥 Evrensel Medya Oynatıcı**: MP4, WebM, OGG, MOV, AVI, MKV ve YouTube desteği.
- **📐 Çoklu Katman Sistemi**: Katman sıralama, görünürlük kontrolü ve bağımsız opaklık ayarı.
- **💾 %100 Yerel ve Güvenli**: IndexedDB ile otomatik kaydetme; PNG, SVG, CSV ve JSON formatlarında dışa aktarma.

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- **Node.js**: `v20+`
- **npm**: `v10+`

### Kurulum ve Çalıştırma

```bash
# Depoyu klonlayın ve bağımlılıkları yükleyin
git clone https://github.com/Sopwit/video-annotation-tool.git
cd video-annotation-tool
npm install

# Geliştirici modunda çalıştırın
npm run electron:dev
```

### Kalite Kontrolleri ve Derleme

```bash
# Testler, lint ve üretim paketini çalıştırın
npm test
npm run lint
npm run build

# Bağımsız masaüstü uygulamasını paketleyin
npm run electron:build        # Mevcut işletim sistemi
npm run electron:build:all    # macOS, Windows ve Linux
```

---

## ⌨️ Temel Kısayollar

| Eylem | Kısayol | Eylem | Kısayol |
| :--- | :--- | :--- | :--- |
| **Oynat / Duraklat** | `Space` | **Geri Al / İleri Al** | `Ctrl+Z` / `Ctrl+Shift+Z` |
| **Kare Atlama** | `Sol` / `Sağ` Ok | **Projeyi Kaydet** | `Ctrl+S` |
| **1sn Atlama** | `Shift + Sol/Sağ` | **PNG Dışa Aktar** | `Ctrl+E` |
| **Yakınlaştırma / Pan** | `Ctrl+Tekerlek` / `Shift+Sürükle` | **Notlar / Katmanlar** | `Ctrl+B` / `Ctrl+L` |
| **Çizim Araçları** | `P` / `E` / `C` / `T` / `S` | **Görünümü Sıfırla** | `Esc` |

👉 **[Tüm Klavye Kısayolları Kılavuzu](docs/SHORTCUTS.md)**

---

## 📚 Dokümantasyon Dizini

| Kılavuz | Açıklama |
| :--- | :--- |
| [🏛️ Mimari Kılavuzu](docs/ARCHITECTURE.md) | Teknik yığın, bileşenler ve alt sistem tasarımı |
| [⌨️ Kısayol Referansı](docs/SHORTCUTS.md) | Tüm tuş kombinasyonları ve kontroller |
| [🚀 Uygulama Rehberi](docs/IMPLEMENTATION_GUIDE.md) | Özellikler, API'ler ve durum akışları |
| [🗺️ Yol Haritası](docs/ROADMAP.md) | Aşama planları ve gelecek özellikler |
| [📜 Değişiklik Günlüğü](CHANGELOG.md) | Sürüm geçmişi ve son düzeltmeler |

---

## 📝 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır. Detaylar için [LICENSE.md](LICENSE.md) dosyasına bakabilirsiniz.

<div align="center">

**[Sopwit](https://github.com/Sopwit) tarafından titizlikle geliştirildi**

</div>
