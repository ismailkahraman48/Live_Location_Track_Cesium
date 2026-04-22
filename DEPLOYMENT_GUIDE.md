# 🚀 Proje Yayınlama Rehberi

Bu proje iki parçadan oluşmaktadır: **API (Backend)** ve **UI (Frontend)**. İkisini de ücretsiz yayınlamak için önerilen yöntem şudur:

## 1. API (Backend) - Render.com (Ücretsiz)
GitHub Pages sadece statik dosyaları (HTML/JS) barındırabilir. Python API'niz için bir sunucuya ihtiyacınız var. **Render.com** ücretsizdir ve GitHub ile tam uyumlu çalışır.

1.  Bu projeyi GitHub'a yükleyin.
2.  [Render.com](https://render.com) hesabı açın.
3.  **"New +"** butonuna basın ve **"Web Service"** seçin.
4.  GitHub deponuzu seçin.
5.  Aşağıdaki ayarları girin:
    *   **Root Directory:** `api`
    *   **Environment:** `Python 3`
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6.  Deploy ettikten sonra size verilen URL'yi kopyalayın (Örn: `https://my-api.onrender.com`).

## 2. Frontend (UI) - GitHub Pages (Ücretsiz)
Sizin için `.github/workflows/deploy-ui.yml` dosyasını hazırladım. Bu dosya, GitHub'a her kod gönderdiğinizde Frontend'i otomatik olarak yayınlayacak.

### Yapmanız Gerekenler:

#### A. API Adresini Tanımlama
`ui` klasörü içinde `.env.production` adında bir dosya oluşturun ve Render'dan aldığınız linki yapıştırın:
```env
VITE_API_URL=wss://my-api.onrender.com
# Not: Eğer Render size https:// veriyorsa, WebSocket için wss:// kullanmanız gerekebilir veya kodunuz http -> ws dönüşümü yapıyorsa https kalabilir.
```

#### B. Vite Base Path Ayarı (Önemli!)
GitHub Pages, sitenizi `kullaniciadi.github.io/repo-adi` adresinde yayınlar. Bu yüzden `ui/vite.config.ts` dosyasına repo adınızı eklemelisiniz.

`ui/vite.config.ts` dosyasını açın ve `base` ayarını ekleyin:
```typescript
export default defineConfig({
  plugins: [react(), ...],
  base: "/repo-adiniz/",  // <-- BURAYI GITHUB REPO ADINIZLA DEĞİŞTİRİN
  // ...
})
```

#### C. GitHub Ayarları
1.  Kodunuzu GitHub'a pushlayın.
2.  Reponuzda **Settings > Pages** sekmesine gidin.
3.  **Build and deployment > Source** kısmında **"GitHub Actions"** seçeneğini seçin.

Birkaç dakika içinde siteniz `https://kullaniciadi.github.io/repo-adi` adresinde yayında olacaktır!
