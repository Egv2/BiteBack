"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import enMessages from "./locales/en";
import trMessages from "./locales/tr";

// Tüm desteklenen dilleri tanımlıyoruz
export const locales = ["en", "tr"] as const;
export type Locale = (typeof locales)[number];

// Dil mesajlarını bir objede topluyoruz
const messages = {
  en: enMessages,
  tr: trMessages,
};

// Tarayıcıdan dil tercihini almak için yardımcı fonksiyon
export const getPreferredLocale = (): Locale => {
  if (typeof window === "undefined") return "en"; // SSR sırasında varsayılan olarak İngilizce

  // Yerel depolamadan önceki tercih edilen dili kontrol et
  const savedLocale = localStorage.getItem("locale") as Locale;
  if (savedLocale && locales.includes(savedLocale)) return savedLocale;

  // Tarayıcı dilini kontrol et
  const browserLang = navigator.language.split("-")[0] as Locale;
  return locales.includes(browserLang) ? browserLang : "en";
};

// Context tipi
interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRtl: boolean;
}

// Context oluştur
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider bileşeni
export const I18nProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // İstemci tarafında dil tercihini al
    setLocaleState(getPreferredLocale());
  }, []);

  // Dil değiştirme fonksiyonu
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.lang = newLocale;
  };

  // Çeviri fonksiyonu
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let value: any = messages[locale];

    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }

    if (typeof value !== "string") return key;

    // Parametreleri değiştir
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(
          new RegExp(`{${paramKey}}`, "g"),
          String(paramValue)
        );
      }, value);
    }

    return value;
  };

  // Sağdan sola diller için (şimdilik kullanılmıyor)
  const isRtl = false;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isRtl }}>
      {children}
    </I18nContext.Provider>
  );
};

// Custom hook
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
