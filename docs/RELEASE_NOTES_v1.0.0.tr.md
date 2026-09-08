# Video Annotation Tool — Sürüm Notları v1.0.0

> **Sürüm:** `v1.0.0`  
> **Tarih:** 8 Eylül 2026  
> **Hedef Platformlar:** Windows (x64), macOS (Apple Silicon arm64), Linux (x86_64, amd64)  
> **Depo:** [Sopwit/video-annotation-tool](https://github.com/Sopwit/video-annotation-tool)

---

## 🚀 Genel Bakış

Spor antrenörleri, video analistleri, bilgisayarlı görü araştırmacıları ve içerik üreticileri için geliştirilen **Video Annotation Tool v1.0.0** resmi olarak yayınlandı.

v1.0.0; cihaz içi yerel yapay zeka ile yüksek performanslı vektörel tuvali birleştirerek kare hassasiyetinde video inceleme, çok katmanlı çizim ve senkronize sesli not alma imkanını tamamen çevrimdışı ve gizlilik odaklı olarak sunar.

---

## 🌟 Öne Çıkan Özellikler

### 🧠 Cihaz İçi Yapay Zeka ile Nesne Tespiti (Sihirli Değnek)
- **Sıfır Bulut Gecikmesi & Tam Gizlilik:** **TensorFlow.js (WebGL motoru)** ve **COCO-SSD** modelleriyle video karelerindeki insan, araç, spor ekipmanı ve nesneleri doğrudan bilgisayarınızda tanır ve çerçeveler.
- **Talebe Bağlı Yükleme (Lazy Loading):** Model ağırlıkları yalnızca ihtiyaç duyulduğunda yüklenerek başlangıç hızını korur.

### 🎨 Yüksek Hassasiyetli Vektör Tuvali
- **%500 Pürüzsüz Yakınlaştırma & Kaydırma:** Fare tekeri ile derin yakınlaştırma ve tuval kaydırma.
- **Ref-Senkron 60 FPS Çizim Motoru:** Hızlı fare hareketlerinde gecikmeyi önlemek için bellek referanslarıyla senkronize çalışan çizim altyapısı.
- **En-Boy Oranına Duyarlı Koordinat İzdüşümü:** Her yakınlaştırma seviyesinde ve video oranında piksel hassasiyetinde çizim doğruluğu.
- **Geniş Çizim Araçları:** Serbest çizim kalemi, düz çizgi, dikdörtgen, çember, yön okları ve özelleştirilebilir renk/kalınlık paleti.

### ⏱️ Kare Hassasiyetinde Gezinme & Zaman Çizelgesi
- **Kare İlerleme (Frame Stepping):** `Sol` / `Sağ` yön tuşları ile `1/30sn` kare hassasiyetinde ileri/geri gezinme.
- **Zaman Atlama:** `Shift + Sol` / `Shift + Sağ` ile 1 saniyelik sıçramalar.
- **Önemli An İmleri (Bookmarks):** Kritik aksiyon anlarını (`Ctrl + B`) zaman damgalı küçük resimlerle kaydetme.
- **Sesli Notlar:** Web Audio API ile zaman çizelgesine doğrudan senkronize sesli yorumlar kaydetme.

### ⚡ Klavye Kısayolları
- `Boşluk (Space)`: Oynat / Duraklat.
- `[` / `]`: Oynatma hızını ayarlama (0.25x - 2x).
- `Ctrl + B`: İmler / Keyframe ekle.
- `Ctrl + L`: Katman Yöneticisini aç/kapat.
- `Ctrl + T`: Yapay Zeka Nesne Algılama panelini aç.
- `Ctrl + S`: Projeyi yerel veritabanına kaydet.
- `Ctrl + E`: Dışa Aktarma menüsünü aç.
- `Ctrl + ,`: Ayarlar penceresini aç.

### 💾 Güvenli Veri Saklama & RFC 4180 Dışa Aktarım
- **Yerel Veritabanı (IndexedDB):** Anlık otomatik kaydetme ve oturum kurtarma için **Dexie 4.x** entegrasyonu.
- **Standartlara Uygun Çıktılar:** RFC 4180 tırnak kaçışlı CSV dışa aktarımı, JSON proje yedeği ve yüksek çözünürlüklü PNG tuval çıktıları.

---

## 📦 Dağıtım Paketleri

| Platform | Hedef | Dosya Adı | Açıklama |
| :--- | :--- | :--- | :--- |
| **Windows** | Setup Kurulum | `Video.Annotation.Tool-Setup-1.0.0.exe` | Masaüstü ve başlat menüsü kısayollu standart kurulum |
| **Windows** | Taşınabilir (Portable) | `Video.Annotation.Tool-Portable-1.0.0.exe` | Kurulum gerektirmeyen taşınabilir tek dosya |
| **macOS** | Apple Silicon DMG | `Video.Annotation.Tool-1.0.0-mac-arm64.dmg` | Apple Silicon (M1/M2/M3/M4) için sürükle-bırak DMG imajı |
| **macOS** | ZIP Arşivi | `Video.Annotation.Tool-1.0.0-mac-arm64.zip` | Bağımsız uygulama paketi |
| **Linux** | AppImage | `Video.Annotation.Tool-1.0.0-linux-x86_64.AppImage` | Kurulum gerektirmeyen bağımsız Linux ikilisi |
| **Linux** | Debian / Ubuntu | `Video.Annotation.Tool-1.0.0-linux-amd64.deb` | Ubuntu, Debian ve Linux Mint için deb paketi |
| **Linux** | RPM Paketi | `Video.Annotation.Tool-1.0.0-linux-x86_64.rpm` | Fedora, RHEL ve openSUSE için rpm paketi |

---

## ⚠️ Bilinen Paketleme Bildirimi (İnceleniyor)

- **Linux Discover / Paket Yöneticisi Çökmesi:** İlk testlerde Linux `.deb` ve `.AppImage` paketlerinin KDE Discover veya sistem yazılım mağazası açılmadan çökme yaşattığı tespit edilmiştir. Electron çalışma zamanı giriş noktası ve sandbox yapılandırmasındaki kök neden incelenmekte olup, bir sonraki `v1.0.1` yamasıyla doğrudan düzeltilecektir.
- **macOS ve Windows Doğrulaması:** Kullanıcıların ilgili paketleri deneyerek başlangıç durumlarını GitHub Issues üzerinden bildirmeleri önerilir.

---

## 🛠️ Doğrulama & Kaynak Kod

- **GitHub Release:** [https://github.com/Sopwit/video-annotation-tool/releases/tag/v1.0.0](https://github.com/Sopwit/video-annotation-tool/releases/tag/v1.0.0)
- **Dokümantasyon:**
  - Mimari Kılavuzu: [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md)
  - Klavye Kısayolları: [`docs/SHORTCUTS.md`](../docs/SHORTCUTS.md)
  - Geliştirici Kılavuzu: [`docs/IMPLEMENTATION_GUIDE.md`](../docs/IMPLEMENTATION_GUIDE.md)
