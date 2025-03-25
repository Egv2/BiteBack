"use client";

import React, { useState, useEffect } from "react";
import { useGameState } from "@/app/context/GameStateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVial,
  faSkullCrossbones,
  faWind,
  faGasPump,
  faShieldVirus,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "@/app/i18n";
import { ChemicalLevel, ChemicalType } from "@/app/types";

const ChemicalPanel: React.FC = () => {
  const { t } = useI18n();
  const { gameState, addChemicalZone, clearChemicalZone } = useGameState();
  const [activeTab, setActiveTab] = useState<"meter" | "create">("meter");

  // Kimyasal türleri
  const chemicalTypes = [
    {
      id: "tearGas",
      icon: faWind,
      color: "text-green-500",
      name: t("chemicals.tearGas"),
    },
    {
      id: "toxin",
      icon: faSkullCrossbones,
      color: "text-red-500",
      name: t("chemicals.toxin"),
    },
    {
      id: "smokeScreen",
      icon: faGasPump,
      color: "text-gray-400",
      name: t("chemicals.smokeScreen"),
    },
    {
      id: "radiation",
      icon: faShieldVirus,
      color: "text-purple-500",
      name: t("chemicals.radiation"),
    },
  ];

  // Yeni kimyasal bölge oluşturmak için form verileri
  const [newZone, setNewZone] = useState<{
    type: ChemicalType;
    radius: number;
    intensity: number;
    duration: number;
  }>({
    type: "tearGas",
    radius: 2,
    intensity: 50,
    duration: 30, // dakika
  });

  // Şehir merkezindeki kimyasal seviyeleri hesapla
  const calculateCityLevels = () => {
    if (!gameState.chemicalZones || !gameState.currentCity) return null;

    const nowTime = Date.now();
    // Aktif kimyasal bölgeleri filtrele
    const activeZones = gameState.chemicalZones.filter(
      (zone) => zone.expiresAt > nowTime
    );

    if (activeZones.length === 0) return null;

    // Her kimyasal türü için şehir merkezindeki yoğunluğu hesapla
    const cityPos = gameState.currentCity.position;
    const levels = {
      tearGas: 0,
      toxin: 0,
      smokeScreen: 0,
      radiation: 0,
    };

    activeZones.forEach((zone) => {
      // Mesafeyi hesapla
      const dx = zone.position[1] - cityPos[1];
      const dy = zone.position[0] - cityPos[0];
      const distance = Math.sqrt(dx * dx + dy * dy) * 111; // km cinsinden

      if (distance <= zone.radius) {
        // Yoğunluğu hesapla
        const distanceFactor = 1 - distance / zone.radius;
        const timeRemaining =
          (zone.expiresAt - nowTime) / (zone.expiresAt - zone.createdAt);
        const finalIntensity = zone.intensity * distanceFactor * timeRemaining;

        // Kimyasal türüne ekle
        levels[zone.type] += finalIntensity;
      }
    });

    // Değerleri 0-100 arasında sınırla
    Object.keys(levels).forEach((key) => {
      levels[key as keyof typeof levels] = Math.min(
        100,
        Math.max(0, levels[key as keyof typeof levels])
      );
    });

    return levels;
  };

  const [cityLevels, setCityLevels] = useState<ChemicalLevel | null>(null);

  // Periyodik olarak seviyeleri güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      setCityLevels(calculateCityLevels());
    }, 5000);

    // İlk hesaplama
    setCityLevels(calculateCityLevels());

    return () => clearInterval(interval);
  }, [gameState.chemicalZones, gameState.currentCity, calculateCityLevels]);

  // Yeni kimyasal bölge oluştur
  const createChemicalZone = () => {
    // Şehir merkezine yakın rastgele bir konum belirle
    const centerLat = gameState.currentCity.position[0];
    const centerLng = gameState.currentCity.position[1];
    const latVariance = (Math.random() - 0.5) * 0.05; // ~2-3km
    const lngVariance = (Math.random() - 0.5) * 0.05;

    const expiresAt = Date.now() + newZone.duration * 60 * 1000; // dakika -> milisaniye

    addChemicalZone({
      type: newZone.type,
      position: [centerLat + latVariance, centerLng + lngVariance],
      radius: newZone.radius,
      intensity: newZone.intensity,
      expiresAt,
    });

    // Dev ortamında konsola bilgi ver
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Yeni ${newZone.type} kimyasal bölgesi oluşturuldu: R=${newZone.radius}km, I=${newZone.intensity}`
      );
    }

    // Tab'ı ölçüm paneline geri çevir
    setActiveTab("meter");
  };

  return (
    <div className="absolute bottom-14 right-0 w-80 bg-gray-900/90 backdrop-blur-md p-4 rounded-lg border border-gray-800 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <FontAwesomeIcon icon={faVial} className="mr-2 text-green-500" />
          {t("chemicals.title")}
        </h3>

        <div className="flex">
          <button
            className={`px-3 py-1 rounded-l ${
              activeTab === "meter" ? "bg-gray-700" : "bg-gray-800"
            }`}
            onClick={() => setActiveTab("meter")}
          >
            {t("chemicals.measure")}
          </button>
          <button
            className={`px-3 py-1 rounded-r ${
              activeTab === "create" ? "bg-gray-700" : "bg-gray-800"
            }`}
            onClick={() => setActiveTab("create")}
          >
            {t("chemicals.create")}
          </button>
        </div>
      </div>

      {activeTab === "meter" ? (
        /* Kimyasal Ölçüm Panel İçeriği */
        <div>
          {cityLevels ? (
            <div className="space-y-4">
              {chemicalTypes.map((type) => (
                <div key={type.id} className="space-y-1">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon={type.icon}
                        className={`${type.color} mr-2`}
                      />
                      <span className="text-sm text-gray-300">{type.name}</span>
                    </div>
                    <span
                      className={`text-sm font-mono ${
                        cityLevels[type.id as keyof ChemicalLevel] > 60
                          ? "text-red-400"
                          : cityLevels[type.id as keyof ChemicalLevel] > 30
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {Math.round(cityLevels[type.id as keyof ChemicalLevel])}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        cityLevels[type.id as keyof ChemicalLevel] > 60
                          ? "bg-red-500"
                          : cityLevels[type.id as keyof ChemicalLevel] > 30
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${cityLevels[type.id as keyof ChemicalLevel]}%`,
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Koruyucu Öneri */}
              <div className="mt-4 p-3 bg-gray-800/50 rounded border border-gray-700">
                <h4 className="text-sm font-bold text-gray-300 mb-2">
                  {t("chemicals.protection")}
                </h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  {cityLevels.tearGas > 40 && (
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      {t("chemicals.protectionMask")}
                    </li>
                  )}
                  {cityLevels.toxin > 30 && (
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                      {t("chemicals.protectionSuit")}
                    </li>
                  )}
                  {cityLevels.smokeScreen > 50 && (
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
                      {t("chemicals.protectionGoggles")}
                    </li>
                  )}
                  {cityLevels.radiation > 20 && (
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                      {t("chemicals.protectionRadiation")}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              {t("chemicals.noActive")}
            </div>
          )}
        </div>
      ) : (
        /* Kimyasal Oluşturma Panel İçeriği */
        <div>{/* Form içeriği burada görüntülenecek */}</div>
      )}
    </div>
  );
};

export default ChemicalPanel;
