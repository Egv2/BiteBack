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

// Tip tanımları
export type Locale = "en" | "tr";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRtl: boolean; // Sağdan sola diller için
  locales: Locale[]; // Desteklenen tüm diller
}

const messages: Record<Locale, any> = {
  en: enMessages,
  tr: trMessages,
};

// Tarayıcı tercihine göre veya localStorage'den dil tercihi al
const getPreferredLocale = (): Locale => {
  if (typeof window === "undefined") return "en";

  const savedLocale = localStorage.getItem("locale") as Locale;
  if (savedLocale && Object.keys(messages).includes(savedLocale)) {
    return savedLocale;
  }

  // Tarayıcı dil tercihini kontrol et
  const browserLocale = navigator.language.split("-")[0];
  if (browserLocale === "tr") return "tr";

  return "en";
};

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

    if (process.env.NODE_ENV === "development") {
      console.log(`Dil değiştirildi: ${newLocale}`);
    }
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

  // Desteklenen tüm diller
  const locales: Locale[] = ["en", "tr"];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isRtl, locales }}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
