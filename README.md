# BiteBack - Hayatta Kalma Koordinasyon Oyunu

BiteBack, kriz durumlarında koordinasyon mekanizmalarını simüle eden, hafif, mobil uyumlu bir web tabanlı hayatta kalma oyunudur. Kullanıcıların zombi salgını senaryosunda hayatta kalmak için birlikte çalışmasını sağlar.

## Özellikler

- **Harita Etkileşimi**: OpenStreetMap tabanlı harita üzerinde zombi görüşleri, hayatta kalan kampları ve hareketleri işaretleme
- **Şehir Bazlı İletişim**: Şehir odalarında hayatta kalanlarla iletişim kurma
- **Acil Durum Sistemi**: SOS mesajları ve malzeme istekleri gönderme
- **Oylama Mekanizması**: Güvenli kampları oylayarak onaylama
- **Deneyim Sistemi**: İşaretleme, oylama ve yardım eylemleri için EXP kazanma
- **Envanter Sistemi**: Malzemeleri takip etme (ilk yardım kiti, serum, ağrı kesici, yiyecek)
- **Mobil Uyumluluk**: Responsive tasarım sayesinde tüm cihazlarda sorunsuz çalışma

## Teknoloji Yığını

- **Frontend**: Next.js, React, TypeScript
- **Harita**: Leaflet.js, OpenStreetMap
- **Stil**: Tailwind CSS
- **İkonlar**: Font Awesome

## Başlangıç

Bu projeyi yerel ortamınızda çalıştırmak için:

```bash
# Gerekli paketleri yükleme
npm install

# Geliştirme sunucusunu başlatma
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görebilirsiniz.

## Kullanım

1. Haritaya tıklayarak zombi görüşleri, kamplar ve hayatta kalan hareketleri ekleyin
2. Şehir bazlı sohbet odalarıyla iletişim kurun
3. Acil durumlarda SOS gönderin
4. Malzeme isteyin ve envanterdeki malzemelerinizi takip edin
5. Kampları oylayarak onaylayın ve "Sadece Güvenli Kamplar" görünümünü kullanın

## Katkıda Bulunma

Bu proje açık kaynaklıdır ve katkılarınıza açıktır. Lütfen bir PR göndermeden önce bir issue açarak değişikliklerinizi tartışın.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## Çok Dillilik Desteği

BiteBack birden fazla dili desteklemektedir. Şu anda aşağıdaki diller mevcuttur:

- İngilizce (English)
- Türkçe

### Yeni Dil Eklemek

Yeni bir dil eklemek için:

1. `src/app/i18n/locales/` klasörüne yeni bir dil dosyası ekleyin
2. `src/app/i18n/index.ts` dosyasını güncelleyin
3. `src/app/components/ui/LanguageSwitcher.tsx` dosyasını güncelleyin

Lütfen çevirileri sağlamak için PR gönderin, yeni dil eklemeleri memnuniyetle karşılanmaktadır.
# BiteBack
