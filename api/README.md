# IETT Live Bus Simulator - FAKE GPS API

## 📌 Proje Hakkında
Bu proje, İstanbul'daki çeşitli İETT otobüs hatlarının (500T, 34G vb.) canlı konumlarını **simüle etmek** için geliştirilmiş bir Backend servisidir. Gerçek bir GPS veri kaynağından beslenmek yerine, önceden tanımlanmış güzergah verileri üzerinde matematiksel algoritmalarla araçları hareket ettirir.

Cesium tabanlı 3D harita uygulamalarında "canlı takip" senaryolarını test etmek ve görselleştirmek amacıyla kullanılır.

---

## 🚀 Başlatma Adımları

### 1. Gereksinimler
- Python 3.9 veya üzeri
- `pip` paket yöneticisi

### 2. Kurulum
Terminali `api` klasöründe açın ve gerekli kütüphaneleri yükleyin:

```bash
cd api
pip install -r requirements.txt
```

*(Not: Eğer hata alırsanız, `python -m venv venv` ile sanal ortam oluşturup aktif etmeniz önerilir.)*

### 3. Çalıştırma
Simülasyon sunucusunu başlatmak için:

```bash
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

Sunucu şu adreste aktif olacaktır:
- **API Dokümantasyonu (Swagger):** [http://localhost:8080/docs](http://localhost:8080/docs)
- **WebSocket Endpoint:** `ws://localhost:8080/ws/buses`

---

## 🧠 Nasıl Çalışır? (Simülasyon Mantığı)

Bu sistem, gerçek bir veri tabanı veya dış servis kullanmaz. Tamamen **bellek içi (in-memory)** çalışan, matematiksel bir modeldir.

### 1. Veri Kaynağı (`routes_data/`)
Sistemde kullanılan rota verileri (koordinatlar ve duraklar) statik Python dosyalarında tutulur.
- **Kaynak:** Bu veriler gerçek İETT API'lerinden alınmış **"polyline" (güzergah çizgisi)** verileridir.
- **Yapı:** Her rota dosyası (örn: `route_500t.py`), binlerce koordinat noktasından oluşan bir liste (`coordinates`) ve durak listesini (`stops`) içerir.

### 2. Hareket Simülasyonu (`bus_simulator.py`)
`BusSimulator` sınıfı, arka planda çalışan matematiksel motordur.

*   **Başlatma:** Uygulama açıldığında, `routes_data` içindeki her hat için belirli sayıda (örn: 500T için 3 adet) sanal otobüs oluşturulur.
*   **Hız ve Trafik:** Her otobüse rastgele bir "baz hız" (örn: 40 km/s) atanır. Ayrıca zamanın akışına göre `sinüs` dalgası kullanılarak yapay bir "trafik yoğunluğu" faktörü eklenir. Böylece otobüsler bazen yavaşlar, bazen hızlanır.
*   **İnterpolasyon (Ara Değer Bulma):** Otobüsün o anki konumu, güzergah çizgisi üzerindeki iki nokta arasında lineer interpolasyon ile hesaplanır. Bu sayede otobüs, virajları ve yolu tam olarak takip eder.
*   **Döngü:** Otobüs hattın sonuna geldiğinde yönünü (`direction`) tersine çevirir ve geri döner.

### 3. Gerçek Zamanlı İletişim (`routers/websocket.py`)
Frontend (Cesium), sunucuya WebSocket üzerinden bağlanır.
*   Sunucu **her 2 saniyede bir** (veya ayarlanan sürede) simülatördeki tüm otobüslerin güncel konumlarını, hızlarını ve yönlerini (Heading) hesaplar.
*   Bu paketi JSON formatında bağlı olan tüm istemcilere (client) gönderir.
*   Frontend, bu gelen veriyi alıp 3D dünyada otobüsleri hareket ettirir.

### Özetle
Veriler gerçeğe çok yakın olsa da, tamamen önceden kaydedilmiş güzergahlar üzerinde koşan matematiksel bir simülasyondur.
