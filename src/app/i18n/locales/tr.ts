const trTranslations = {
  app: {
    title: "BiteBack",
    description:
      "Zombi salgınında hayatta kalma koordinasyonu için simülasyon oyunu",
  },
  common: {
    cancel: "İptal",
    submit: "Gönder",
    loading: "Yükleniyor...",
    error: "Hata oluştu",
    save: "Kaydet",
    delete: "Sil",
    edit: "Düzenle",
    close: "Kapat",
    use: "Kullan",
    search: "Ara",
  },
  header: {
    exp: "EXP",
    id: "ID",
  },
  inventory: {
    title: "Envanter",
    medkit: "İlk Yardım Kiti",
    serum: "Serum",
    painkiller: "Ağrı Kesici",
    food: "Yiyecek",
    show: "Envanteri Göster",
    hide: "Envanteri Kapat",
    empty: "Envanteriniz boş",
    capacity: "Kapasite",
    more: "Detaylar",
    sortByName: "İsme göre sırala",
    sortByCount: "Miktara göre sırala",
    lowSupplies: "Düşük stok uyarısı",
    lowSuppliesDesc: "Bazı malzemeleriniz tükenmek üzere",
    noSearchResults: "Arama sonucu bulunamadı",
  },
  map: {
    addMarker: "Konuma işaretleyici ekle:",
    zombie: "Zombi",
    camp: "Kamp",
    traffic: "Hareket",
    zombieSighting: "Zombi Görüldü",
    survivorCamp: "Hayatta Kalan Kampı",
    survivorMovement: "Hayatta Kalan Hareketi",
    votes: "Oylar",
    approved: "(Onaylandı)",
    addedAt: "Eklenme",
    safeCampsOnly: "Sadece Güvenli Kamplar",
    allCamps: "Tüm Kamplar",
  },
  chat: {
    title: "Hayatta Kalan Ağı",
    room: "Oda",
    sendMessage: "Mesajınızı yazın...",
    noMessages: "Bu odada henüz mesaj yok.",
    vote: "Oyla",
    requestItem: "Malzeme İste",
    cities: {
      istanbul: "İstanbul",
      ankara: "Ankara",
      izmir: "İzmir",
      antalya: "Antalya",
      bursa: "Bursa",
    },
    show: "Sohbeti Göster",
    hide: "Sohbeti Kapat",
    startConversation:
      "Diğer hayatta kalanlarla iletişim kurmak için bir mesaj yazın.",
  },
  sos: {
    button: "SOS",
    prompt: "Acil durum mesajınızı girin:",
    title: "ACİL DURUM BİLDİRİMİ",
    description:
      "Acil durum mesajınızı girin. Bu mesaj tüm hayatta kalanlara iletilecektir.",
    send: "Gönder",
    messagePlaceholder: "Acil durumunuzu ayrıntılı şekilde açıklayın...",
    broadcastWarning:
      "Bu mesaj tüm hayatta kalanlara iletilecek ve bölgedeki zombileri çekebilir!",
  },
  items: {
    request: "Malzeme iste:",
    medkit: "İlk Yardım Kiti",
    serum: "Serum",
    painkiller: "Ağrı Kesici",
    food: "Yiyecek",
  },
  infectionMeter: {
    title: "Zombi Salgını",
    protectionLevel: "Koruma Seviyesi",
    zoneSafety: "Bölge Güvenliği",
    dailyStats: "Günlük İstatistikler",
    newZombies: "Yeni Zombi Görüldü",
    newSafeCamps: "Yeni Güvenli Kamp",
    recommendations: "Öneriler",
    protection: {
      critical: "Kritik",
      moderate: "Orta",
      good: "İyi",
    },
    safety: {
      safe: "Güvenli",
      risky: "Riskli",
      dangerous: "Tehlikeli",
    },
    recommendationDangerous: "Acil olarak yeni güvenli kamplar kurulmalı!",
    recommendationRisky:
      "Bölge güvenliğini artırmak için daha fazla kamp öner.",
    recommendationSafe: "Bölge şu an güvenli durumda.",
    tooltip: "Çevresel Tehditler",
  },
  events: {
    newEvent: "Yeni Olay!",
    timeLeft: "Kalan",
    emergencyNotification: "Acil Durum Bildirimi",
    location: "Konum",
    risk: "Risk",
    messageExpire: "Bu mesaj {minutes}:{seconds} içinde kaybolacak",
    zombieHorde: {
      title: "Zombi Sürüsü",
      description: "Yakınlarda büyük bir zombi sürüsü tespit edildi.",
      details: "Büyük zombi sürüsü",
      detailsExamined: "Büyük zombi sürüsü (İncelendi)",
      options: {
        mark: "Sürüyü işaretle (Güvenli)",
        approach: "Sürüye yaklaş (Riskli)",
      },
      success: "Sürü İşaretlendi",
      successDesc:
        "Zombi sürüsünü başarıyla işaretledin ve {exp} EXP kazandın.",
      exploreSuccess: "Keşif Başarılı",
      exploreSuccessDesc:
        "Zombi sürüsünü yakından inceleyerek değerli bilgiler topladın ve {exp} EXP kazandın!",
      exploreFail: "Keşif Başarısız",
      exploreFailDesc:
        "Zombiler seni fark etti! Kaçmayı başardın ama yaralandın.",
    },
    survivorFound: {
      title: "Hayatta Kalan Bulundu",
      description: "Yakınlarda bir grup hayatta kalan tespit edildi.",
      campDetails: "Kurtarma kampı",
      options: {
        help: "Yardım Et",
        rescue: "Kurtarma ekibi gönder (Riskli)",
      },
      helpSuccess: "Yardım Edildi",
      helpSuccessDesc: "Hayatta kalana yardım ettin ve {exp} EXP kazandın.",
      rescueSuccess: "Kurtarma Başarılı",
      rescueSuccessDesc:
        "Hayatta kalanları güvenli bir şekilde kurtardın ve {exp} EXP kazandın!",
      rescueFail: "Kurtarma Başarısız",
      rescueFailDesc:
        "Kurtarma sırasında zombi saldırısı oldu! Ekip geri çekildi.",
    },
    unknown: {
      title: "Bilinmeyen Olay",
      description: "Acil dikkat gerektiren bir durum var.",
      options: {
        investigate: "Araştır",
      },
      investigateSuccess: "Olay İncelendi",
      investigateSuccessDesc: "Olayı inceleyerek {exp} EXP kazandın.",
    },
    contaminatedArea: {
      title: "Kontamine Bölge",
      description: "Bölgede yüksek seviyede radyasyon tespit edildi.",
    },
    suppliesDrop: {
      title: "Malzeme Teslimatı",
      description: "Yakında bir yerlere acil malzeme paketi düşürüldü.",
    },
    radioMessage: {
      title: "Radyo Mesajı",
      description: "Acil durum frekansında bir mesaj tespit edildi.",
    },
    options: {
      investigate: "Araştır",
      avoid: "Uzak Dur",
      help: "Yardım Et",
      collect: "Topla",
      listen: "Dinle",
    },
  },
  help: {
    title: "BiteBack Yardım",
    mapUsage: {
      title: "Harita Kullanımı",
      description:
        "Harita üzerinde işaretleyiciler eklemek için haritaya tıklayın.",
    },
    markers: {
      zombie: "Zombi - Zombi görüldüğünü işaretler (20 EXP)",
      camp: "Kamp - Güvenli kamp önerir (30 EXP)",
      traffic: "Hareket - Hayatta kalan hareketini belirtir",
    },
    chat: {
      title: "Sohbet Sistemi",
      description:
        "Şehir bazlı sohbet odalarında diğer hayatta kalanlarla iletişim kurabilirsiniz.",
      sos: "SOS: Acil durumlarda yardım istemek için kullanın (50 EXP)",
      requestItem:
        "Malzeme İste: İhtiyacınız olan malzemeleri belirtin (10 EXP)",
      vote: "Kamp Oyla: Önerilen kampları oylayarak onaylayın (10 EXP)",
    },
    exp: {
      title: "EXP Kazanma",
      description: "Aşağıdaki eylemlerle deneyim puanı kazanabilirsiniz:",
      zombie: "Zombi işaretleme: 20 EXP",
      camp: "Kamp önerme: 30 EXP",
      vote: "Kamp oylama: 10 EXP",
      sos: "SOS gönderme: 50 EXP",
      requestItem: "Malzeme isteme: 10 EXP",
    },
    tips: {
      title: "İpuçları",
      emergencyMessages:
        "Kırmızı vurgulu mesajlar acil durum içerir, dikkatle okuyun!",
      campApproval:
        'Kamplar %70 onay alırsa (10 oyun 7\'si) "güvenli" olarak işaretlenir',
      citySelection:
        "Şehir seçimini haritanın sol üst köşesinden değiştirebilirsiniz",
      safeCamps:
        '"Sadece Güvenli Kamplar" düğmesi ile yalnızca onaylanmış kampları görebilirsiniz',
    },
    disclaimer:
      "Bu bir simülasyon oyunudur. Gerçek bir zombi salgını durumunda, lütfen resmi makamlarca verilen talimatlara uyun.",
    understood: "Anladım",
  },
  footer: {
    description:
      "BiteBack: Eğlence ve iyilik için açık kaynaklı hayatta kalma oyunu demosu",
    disclaimer:
      "Bu bir simülasyon oyunudur. Bu demo yapılırken hiçbir zombi zarar görmemiştir.",
    copyright: "© {year} BiteBack Projesi",
  },
  environment: {
    title: "Bölge Analizi",
    radiation: "Hava Kirliliği",
    zombieDensity: "Zombi Yoğunluğu",
    activeCombat: "Aktif Çatışma",
    recommendedGear: "Önerilen Teçhizat",
    mask: "Gaz Maskesi",
    serum: "Antidot Serum",
    armor: "Koruyucu Zırh",
  },
  chemicals: {
    title: "Kimyasal Tehditler",
    measure: "Ölçüm",
    create: "Oluştur",
    type: "Kimyasal Türü",
    radius: "Yarıçap",
    intensity: "Yoğunluk",
    duration: "Süre",
    tearGas: "Biber Gazı",
    toxin: "Toksin",
    smokeScreen: "Duman Perdesi",
    radiation: "Radyasyon",
    noActive: "Aktif kimyasal tehdit bulunamadı.",
    protection: "Koruyucu Önlemler",
    protectionMask: "Gaz maskesi kullanın",
    protectionSuit: "Koruyucu kıyafet giyin",
    protectionGoggles: "Koruyucu gözlük takın",
    protectionRadiation: "Radyasyon koruyucu ekipman kullanın",
    warning: "DİKKAT: Kimyasal tehditler bölgede tespit edildi!",
  },
  hudPanel: {
    infection: "Enfeksiyon Durumu",
    zombies: "Zombi Radarı",
    chemicals: "Kimyasal Analiz",
    radar: "Navigasyon",
    environment: "Çevre Analizi",
    toggleButton: "Araçlar",
  },
  notifications: {
    success: "Başarılı",
    error: "Hata",
    warning: "Uyarı",
    info: "Bilgi",
    chemicalDetected: "Kimyasal tehdit tespit edildi!",
    zombieHorde: "Dikkat! Zombi sürüsü yaklaşıyor!",
    campApproved: "Yeni güvenli kamp onaylandı!",
    levelUp: "Seviye atladın!",
  },
  mobileMenu: {
    map: "Harita",
    chat: "Sohbet",
    inventory: "Envanter",
    help: "Yardım",
    settings: "Ayarlar",
  },
};

export default trTranslations;
