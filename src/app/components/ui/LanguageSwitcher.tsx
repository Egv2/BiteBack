"use client";

import React, { useState } from "react";
import { useI18n, Locale, locales } from "@/app/i18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

// Dil isimlerini tanımla (gerekirse daha fazla dil eklenebilir)
const localeNames: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
};

// Dil bayraklarını veya kısa kodlarını tanımla
const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  tr: "🇹🇷",
};

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faGlobe} className="mr-2" />
        <span className="hidden md:inline">{localeNames[locale]}</span>
        <span className="md:hidden">{localeFlags[locale]}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-gray-800 rounded-md shadow-lg overflow-hidden z-50">
          {locales.map((localeOption) => (
            <button
              key={localeOption}
              className={`w-full text-left px-4 py-2 flex items-center ${
                locale === localeOption ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => {
                setLocale(localeOption);
                setIsOpen(false);
              }}
            >
              <span className="mr-2">{localeFlags[localeOption]}</span>
              {localeNames[localeOption]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
