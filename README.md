# PASSIO

> **"Az ekran. Az renk. Az hareket. Çok düşünce."**

Passio; insanın okuma, düşünme, not alma ve yazma süreçlerini tek bir sessiz masaüstü çalışma ortamında birleştiren, **offline-first**, **minimal** ve **odak merkezli** bir bilgi yönetim platformudur.

---

## 🎯 Amaç

Passio'nun temel amacı bilgi depolamak değil, bilgiyi sindirmek ve üretim sürecine aktarmaktır. Kullanıcının dikkatinin dağılmasını önleyen, Apple standartlarında sade ve sessiz bir kullanıcı deneyimi sunar.

---

## 📐 Kapsam

- **Material Library & Reader:** PDF belgelerinin yönetimi, sürekli kaydırma (continuous scroll) ve tek sayfa okuma modları.
- **Highlight Engine & Reading Notes:** Metin vurgulama, kategorik renk kodlaması ve özel sayfa notları.
- **Knowledge Bridge:** Okuma sırasında alınan not ve vurguları doğrudan yazıhane ortamına alıntılama ve kaynak PDF sayfasına tek tıkla yönlendirme.
- **Focus Writing Workspace (Yazıhane):** Daktilo modu, odak modu, Markdown desteği ve çoklu defter yönetimi.
- **Local-First Architecture:** Tüm verilerin kullanıcı cihazında yüksek güvenlik ve hızla saklanması.

---

## 📋 Kurallar

1. **Sessiz Arayüz:** Kullanıcı arayüzü içeriğin önüne geçemez.
2. **Kişisel Veri Gizliliği:** Kullanıcı verileri asla harici sunuculara otomatik aktarılmaz.
3. **Temiz Mimarı:** Business Logic UI katmanından tamamen soyutlanmıştır.

---

## 💡 Örnekler

- PDF Okuma ve Vurgu Alma: PDF üzerinde metin seçilip "Sarı" renk etiketiyle kaydedilir.
- Bilgi Köprüsü Entegrasyonu: Yazıhanede makale yazarken sağ panelden ilgili PDF vurgusu bulunur ve "Yazıya Ekle" butonu ile Markdown formatında atıf eklenir.

---

## ✅ Yapılacaklar

- Sade ve yüksek kontrastlı tipografi tercih etmek.
- Offline-first veri depolama standartlarını korumak.
- Modüler katmanlı mimariye sadık kalmak.

---

## ❌ Yapılmayacaklar

- Kalabalık dashboardlar ve reklam/tanıtım bannerları eklemek.
- UI bileşenleri içerisine veritabanı sorguları yerleştirmek.
- Kullanıcı izni olmadan ağ istekleri göndermek.

---

## 🌟 Best Practices

- `docs/` altındaki teknik dokümantasyon standartlarına tam uyum sağlamak.
- Tip güvenliği için TypeScript `strict` modunu korumak.
