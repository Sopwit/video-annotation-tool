# Video Annotation Tool (Video Açıklama Aracı)

<div align="center">

![Version](https://img.shields.io/badge/versiyon-1.2.0-blue.svg)
![License](https://img.shields.io/badge/lisans-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)
![Status](https://img.shields.io/badge/durum-production--ready-success.svg)

**Çoklu katman desteği, kare-mükemmel zaman çizelgesi ve profesyonel özellikler ile güçlü, çapraz platform video açıklama aracı**

[🌐 English](README.md) | [🇹🇷 Türkçe](README.tr.md)

</div>

---

## 📖 Genel Bakış

Video Annotation Tool, videolara hassas açıklamalar eklemenize olanak tanıyan profesyonel, çapraz platform bir masaüstü uygulamasıdır. React ve Electron ile geliştirilmiş olup, çoklu katman açıklama desteği, kare-kare navigasyon ve eğitim, spor analizi, içerik oluşturma ve araştırma için mükemmel olan kapsamlı bir çizim araçları seti sunar.

## ✨ Özellikler

### 🎥 **Video Oynatma ve Kontrol**

- ✅ Yerel video dosya desteği (MP4, WebM, OGG, MOV, AVI, MKV)
- ✅ YouTube video URL desteği
- ✅ Oynat/duraklat/durdur kontrolleri
- ✅ İlerleme takibi ve atlama
- ✅ Kare-kare navigasyon (+/- 1 kare, 30fps'de)
- ✅ Yer imi işaretleri ile zaman çizelgesi görselleştirmesi
- ✅ Hassas zaman gösterimi (SS:DD:SS)

### ✏️ **Gelişmiş Çizim Araçları**

- ✅ **Kalem** - Serbest çizim
- ✅ **Silgi** - Açıklamaları kaldır
- ✅ **Çizgi** - Düz çizgi aracı
- ✅ **Dikdörtgen** - Dikdörtgen çiz
- ✅ **Daire** - Daire çiz
- ✅ **Ok** - Yönlü oklar
- ✅ **Metin** - Metin açıklamaları ekle
- ✅ **Damga** - Emoji damgaları (✅ ❌ ❓ ❗ ⭐ 🎯)
- ✅ Palet ile renk seçici
- ✅ Ayarlanabilir fırça boyutu (1-20px)

### 📐 **Çoklu Katman Sistemi**

- ✅ Sınırsız açıklama katmanı oluşturma
- ✅ Bireysel katman görünürlük değiştirme
- ✅ Katman opaklık kontrolü (0-100%)
- ✅ Katmanları kilitleme/kilidi açma
- ✅ Katmanları yeniden adlandırma
- ✅ Katman sıralama
- ✅ Katman başına izole düzenleme

### 💾 **Kaydetme ve Dışa Aktarma**

- ✅ Projeleri IndexedDB'ye kaydet
- ✅ Kaydedilen projeleri yükle
- ✅ Otomatik kayıt (yapılandırılabilir aralık)
- ✅ PNG olarak dışa aktar (video arka planıyla)
- ✅ SVG olarak dışa aktar (vektör formatı)
- ✅ JSON olarak dışa aktar (proje verisi)
- ✅ Yer imlerini CSV olarak dışa aktar
- ✅ Açıklamaları panoya kopyala
- ✅ Toplu ekran görüntüsü dışa aktarma

### 📌 **Yer İmleri ve Zaman Çizelgesi**

- ✅ Notlarla zaman damgası yer imleri ekle
- ✅ Otomatik küçük resim yakalama
- ✅ Belirli zaman damgalarına atla
- ✅ Yer imi notlarını düzenle
- ✅ Yer imlerini sil
- ✅ İşaretlerle görsel zaman çizelgesi
- ✅ Sıralanmış yer imi listesi

### ⚙️ **Profesyonel Özellikler**

- ✅ Tam geçmişle Geri Al/Yinele
- ✅ Klavye kısayolları (tamamen özelleştirilebilir)
- ✅ Ekran kaydetme yeteneği
- ✅ Sekmeli ayarlar paneli
- ✅ Otomatik kayıt yapılandırması
- ✅ Karanlık tema (Açık tema yakında)
- ✅ Izgara kaplama seçenekleri
- ✅ Son dosyalar takibi
- ✅ Duyarlı kullanıcı arayüzü

### 🖥️ **Çapraz Platform Masaüstü**

- ✅ Yerel macOS uygulaması (DMG, ZIP)
- ✅ Yerel Windows uygulaması (NSIS yükleyici, Taşınabilir)
- ✅ Yerel Linux uygulaması (AppImage, DEB, RPM)
- ✅ Platforma özel pencere kontrolleri
- ✅ Yerel dosya diyalogları
- ✅ Güvenli IPC iletişimi

## 🚀 Başlangıç

### Gereksinimler

**Node.js** (v16 veya üstü) ve **npm**'in yüklü olduğundan emin olun:

- **Node.js**: [Node.js İndir & Kur](https://nodejs.org/)
- **npm**: Node.js ile birlikte gelir

### Kurulum

1. **Depoyu klonlayın**

```bash
git clone https://github.com/Sopwit/video-annotation-tool.git
cd video-annotation-tool
```

2. **Bağımlılıkları yükleyin**

```bash
npm install
```

### Geliştirme

Uygulamayı geliştirme modunda çalıştırmak için:

```bash
npm run electron:dev
```

Bu şunları yapacaktır:

- Vite geliştirme sunucusunu başlat
- Electron uygulamasını başlat
- Daha hızlı geliştirme için hot-reload'u etkinleştir
- Hata ayıklama için DevTools'u aç

### Production için Derleme

#### Mevcut platformunuz için derle

```bash
npm run electron:build
```

#### Belirli platformlar için derle

```bash
# macOS (DMG ve ZIP)
npm run electron:build:mac

# Windows (NSIS yükleyici ve taşınabilir)
npm run electron:build:win

# Linux (AppImage, DEB ve RPM)
npm run electron:build:linux

# Tüm platformlar için derle
npm run electron:build:all
```

Derlenmiş uygulamalar `release` klasöründe mevcut olacaktır.

**Not**: Derlemeden önce, `build/` dizinine simge dosyaları ekleyin:

- `icon.icns` (macOS)
- `icon.ico` (Windows)
- `icon.png` (Linux - 512x512px)

Ayrıntılar için `build/README.md`'ye bakın.

## 📂 Proje Yapısı

```
video-annotation-tool/
├── electron/              # Electron ana süreç
│   ├── main.cjs          # Ana süreç girişi
│   └── preload.cjs       # Ön yükleme betiği
├── src/                  # React uygulaması
│   ├── store/           # Durum yönetimi
│   │   └── useStore.js  # Zustand deposu
│   ├── services/        # İş mantığı
│   │   ├── database.js      # IndexedDB servisi
│   │   └── exportService.js # Dışa aktarma araçları
│   ├── components/      # React bileşenleri
│   │   ├── VideoPlayer.jsx
│   │   ├── CanvasOverlay.jsx
│   │   ├── Toolbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Timeline.jsx
│   │   ├── LayerManager.jsx
│   │   └── SettingsPanel.jsx
│   ├── hooks/           # Özel hook'lar
│   │   └── useRecorder.js
│   ├── App.jsx          # Ana bileşen
│   └── main.jsx         # Giriş noktası
├── public/              # Statik varlıklar
├── build/               # Derleme kaynakları (simgeler)
└── release/             # Derlenmiş uygulamalar
```

## 🛠️ Teknolojiler

### Temel Teknolojiler

- [**React 19**](https://react.dev/) - Geliştirilmiş performansa sahip en yeni React
- [**Electron 34**](https://www.electronjs.org/) - Çapraz platform masaüstü çerçevesi
- [**Vite 7**](https://vitejs.dev/) - Yeni nesil frontend araçları
- [**Tailwind CSS 3**](https://tailwindcss.com/) - Utility-first CSS çerçevesi

### Kütüphaneler

- [**Zustand**](https://github.com/pmndrs/zustand) - Durum yönetimi
- [**Dexie**](https://dexie.org/) - IndexedDB sarmalayıcı
- [**React Player**](https://www.npmjs.com/package/react-player) - Video oynatma
- [**Lucide React**](https://lucide.dev/) - Güzel simgeler
- [**html2canvas**](https://html2canvas.hertzen.com/) - Ekran görüntüsü oluşturma
- [**file-saver**](https://github.com/eligrey/FileSaver.js/) - Dosya indirme

## ⌨️ Klavye Kısayolları

### Araçlar

- `P` - Kalem aracı
- `E` - Silgi
- `C` - İmleç/Seç modu
- `T` - Metin aracı
- `R` - Dikdörtgen
- `O` - Daire
- `A` - Ok
- `S` - Damga

### Eylemler

- `Cmd/Ctrl + Z` - Geri Al
- `Cmd/Ctrl + Shift + Z` - Yinele
- `Cmd/Ctrl + Y` - Yinele (alternatif)

**Tüm kısayollar Ayarlar'da özelleştirilebilir!**

## 🎯 Kullanım

1. **Uygulamayı başlatın**
2. **Video yükleyin**:
   - Video URL'si eklemek için bağlantı simgesine tıklayın
   - Veya yerel bir video dosyasını sürükleyip bırakın
3. **Araç çubuğundan aracınızı seçin**
4. **Düzenli açıklamalar için katmanlar oluşturun**
5. **Doğrudan video üzerine açıklamalar çizin**
6. **Önemli zaman damgalarında yer imleri ekleyin**
7. **Kare-mükemmel navigasyon için zaman çizelgesini kullanın**
8. **Projenizi daha sonra kullanmak üzere kaydedin**
9. **Tercih ettiğiniz formatta dışa aktarın**

## 💡 Kullanım Alanları

### 🎓 Eğitim

- Açıklamalı ders videoları oluştur
- Önemli kavramları vurgula
- Açıklayıcı notlar ekle
- Kare-kare gösterimler

### 🏀 Spor Analizi

- Katmanlarla taktik analiz
- Oyuncu takibi
- Hareket kalıpları
- Performans değerlendirmesi

### 🎬 İçerik Oluşturma

- Düzenleme için video işaretleme
- Post-prodüksiyon için notlar
- İşbirliği açıklamaları
- Hızlı ekran yakalamalar

### 🔬 Araştırma

- Bilimsel video analizi
- Davranış çalışmaları
- Veri toplama
- Hassas ölçümler

## 🔄 v1.2'deki Yenilikler

### Önemli Özellikler

- ✨ **Çoklu katman açıklama sistemi**
- ✨ **Kare navigasyonlu gelişmiş zaman çizelgesi**
- ✨ **Profesyonel katman yönetimi**
- ✨ **Proje kaydetme/yükleme (IndexedDB)**
- ✨ **Otomatik kayıt işlevi**
- ✨ **Çoklu dışa aktarma formatları** (PNG, SVG, JSON, CSV)
- ✨ **Özelleştirme ile ayarlar paneli**
- ✨ **Klavye kısayolu özelleştirmesi**
- ✨ **Çizgi çizim aracı**
- ✨ **Geliştirilmiş performans**

Tam ayrıntılar için [CHANGELOG.md](CHANGELOG.md)'ye bakın.

## 🤝 Katkıda Bulunma

Katkılar memnuniyetle karşılanır! Lütfen bir Pull Request göndermekten çekinmeyin.

1. Depoyu fork edin
2. Özellik dalınızı oluşturun (`git checkout -b feature/HarikaBirOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Harika bir özellik ekle'`)
4. Dalı push edin (`git push origin feature/HarikaBirOzellik`)
5. Bir Pull Request açın

## 📝 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır - detaylar için [LICENSE.md](LICENSE.md) dosyasına bakın.

## 🗺️ Yol Haritası

Planlanan özellikler ve gelecek geliştirme için [ROADMAP.md](ROADMAP.md)'ye bakın.

## 📚 Dokümantasyon

- [CHANGELOG.md](CHANGELOG.md) - Sürüm geçmişi
- [ROADMAP.md](ROADMAP.md) - Gelecek planları
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Geliştirici kılavuzu
- [build/README.md](build/README.md) - Simge oluşturma kılavuzu

## 🐛 Bilinen Sorunlar

- Açık tema değiştirme mevcut ancak CSS henüz uygulanmadı
- Katman yeniden sıralama UI'sı mevcut, mantık geliştiriliyor
- Ayarlarda depolama istatistikleri yer tutucu

Bunlar küçük sorunlardır ve temel işlevselliği etkilemez.

## 💬 Destek

Herhangi bir sorunla karşılaşırsanız veya sorularınız varsa:

1. [Dokümantasyonu](IMPLEMENTATION_GUIDE.md) kontrol edin
2. [CHANGELOG.md](CHANGELOG.md)'yi inceleyin
3. GitHub'da bir issue açın

## 🙏 Teşekkürler

- Tüm katkıda bulunanlara teşekkürler
- Erişilebilir video açıklama araçlarına duyulan ihtiyaçtan ilham alınmıştır
- Açık kaynak teknolojiler kullanılarak sevgiyle geliştirilmiştir

## 📧 İletişim

**Sopwit** - [@Sopwit](https://github.com/Sopwit)

**Proje Bağlantısı**: [https://github.com/Sopwit/video-annotation-tool](https://github.com/Sopwit/video-annotation-tool)

---

<div align="center">

**[Sopwit](https://github.com/Sopwit) tarafından ❤️ ile yapıldı**

⭐ Bu depoyu faydalı buluyorsanız yıldızlayın!

</div>
