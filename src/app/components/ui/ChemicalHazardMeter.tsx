"use client";

import React, { useState, useEffect } from "react";
import { useGameState } from "@/app/context/GameStateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSkullCrossbones,
  faGasPump,
  faWind,
  faMask,
  faShieldVirus,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

type ChemicalType = "tearGas" | "toxin" | "smokeScreen" | "radiation";

interface ChemicalZone {
  id: string;
  type: ChemicalType;
  position: [number, number];
  radius: number;
  intensity: number; // 0-100
  createdAt: number;
  expiresAt: number;
}

const ChemicalHazardMeter: React.FC = () => {
  const { gameState, markers } = useGameState();
  const [isOpen, setIsOpen] = useState(false);
  const [chemicalLevels, setChemicalLevels] = useState({
    tearGas: 0,
    toxin: 0,
    smokeScreen: 0,
    radiation: 0,
  });

  // Şehir merkezine kimyasal etki oranı hesaplama
  useEffect(() => {
    if (!gameState.chemicalZones || gameState.chemicalZones.length === 0)
      return;

    const nowTime = Date.now();
    // Geçerli kimyasal bölgeleri filtrele
    const activeZones = gameState.chemicalZones.filter(
      (zone) => zone.expiresAt > nowTime
    );

    if (activeZones.length === 0) {
      // Aktif kimyasal bölge yoksa tüm değerleri sıfırla
      setChemicalLevels({
        tearGas: 0,
        toxin: 0,
        smokeScreen: 0,
        radiation: 0,
      });
      return;
    }

    // Her kimyasal türü için toplam yoğunluğu hesapla
    const cityPos = gameState.currentCity.position;
    const levels = {
      tearGas: 0,
      toxin: 0,
      smokeScreen: 0,
      radiation: 0,
    };

    activeZones.forEach((zone) => {
      // Şehir merkezi ve kimyasal bölge arasındaki mesafeyi hesapla
      const dx = zone.position[1] - cityPos[1];
      const dy = zone.position[0] - cityPos[0];
      const distance = Math.sqrt(dx * dx + dy * dy) * 111; // km cinsinden

      if (distance <= zone.radius) {
        // Mesafe etki yarıçapı içinde ise, mesafeye bağlı yoğunluğu hesapla
        const distanceFactor = 1 - distance / zone.radius;
        const calculatedIntensity = zone.intensity * distanceFactor;

        // Zamanla azalan yoğunluk
        const timeRemaining =
          (zone.expiresAt - nowTime) / (zone.expiresAt - zone.createdAt);
        const finalIntensity = calculatedIntensity * timeRemaining;

        // İlgili kimyasal türüne ekle
        levels[zone.type] += finalIntensity;
      }
    });

    // Her kimyasal seviyesini 0-100 aralığında sınırla
    Object.keys(levels).forEach((key) => {
      levels[key as ChemicalType] = Math.min(
        100,
        Math.max(0, levels[key as ChemicalType])
      );
    });

    setChemicalLevels(levels);
  }, [gameState.chemicalZones, gameState.currentCity]);

  // Kimyasal türüne göre icon ve renk belirle
  const getChemicalIcon = (type: ChemicalType) => {
    switch (type) {
      case "tearGas":
        return faWind;
      case "toxin":
        return faSkullCrossbones;
      case "smokeScreen":
        return faGasPump;
      case "radiation":
        return faShieldVirus;
    }
  };

  const getChemicalColor = (type: ChemicalType, level: number) => {
    if (level < 30) return "text-green-400";
    if (level < 60) return "text-yellow-400";
    return "text-red-500";
  };

  const getChemicalName = (type: ChemicalType) => {
    switch (type) {
      case "tearGas":
        return "Biber Gazı";
      case "toxin":
        return "Toksin";
      case "smokeScreen":
        return "Duman Perdesi";
      case "radiation":
        return "Radyasyon";
    }
  };

  const getTotalHazardLevel = () => {
    const total =
      Object.values(chemicalLevels).reduce((sum, level) => sum + level, 0) / 4;
    return Math.round(total);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center bg-gray-900/60 hover:bg-gray-800/70 border border-gray-700/50 px-3 py-1.5 rounded-md transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon
          icon={faMask}
          className={`mr-2 ${
            getTotalHazardLevel() < 30
              ? "text-green-500"
              : getTotalHazardLevel() < 60
              ? "text-yellow-500"
              : "text-red-500 animate-pulse"
          }`}
        />
        <span className="text-sm">Kimyasal: {getTotalHazardLevel()}%</span>
        <div className="ml-2 w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              getTotalHazardLevel() < 30
                ? "bg-green-500"
                : getTotalHazardLevel() < 60
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${getTotalHazardLevel()}%` }}
          ></div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 p-4 glass-panel rounded-lg shadow-lg border border-gray-700/50 z-50 w-80 animate-fadeIn">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold">Kimyasal Tehlike Seviyeleri</h3>
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                getTotalHazardLevel() < 30
                  ? "bg-green-900/40 text-green-400"
                  : getTotalHazardLevel() < 60
                  ? "bg-yellow-900/40 text-yellow-400"
                  : "bg-red-900/40 text-red-400"
              }`}
            >
              {getTotalHazardLevel() < 30
                ? "Güvenli"
                : getTotalHazardLevel() < 60
                ? "Dikkat"
                : "Tehlikeli"}
            </span>
          </div>

          {/* Kimyasal Türleri */}
          <div className="space-y-3">
            {Object.entries(chemicalLevels).map(([type, level]) => (
              <div key={type} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={getChemicalIcon(type as ChemicalType)}
                      className={`${getChemicalColor(
                        type as ChemicalType,
                        level
                      )} mr-2`}
                    />
                    <span className="text-sm">
                      {getChemicalName(type as ChemicalType)}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-mono ${getChemicalColor(
                      type as ChemicalType,
                      level
                    )}`}
                  >
                    {Math.round(level)}%
                  </span>
                </div>

                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ease-out ${
                      level < 30
                        ? "bg-green-500"
                        : level < 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Koruma Önerileri */}
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-sm">
            <h4 className="font-semibold text-gray-300 mb-2">
              Koruma Önlemleri
            </h4>
            {getTotalHazardLevel() > 60 ? (
              <div className="text-red-400 flex items-center">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="mr-2"
                />
                <span>Gaz maskesi ve koruyucu ekipman zorunlu!</span>
              </div>
            ) : getTotalHazardLevel() > 30 ? (
              <div className="text-yellow-400 flex items-center">
                <FontAwesomeIcon icon={faMask} className="mr-2" />
                <span>Gaz maskesi taşınması önerilir.</span>
              </div>
            ) : (
              <div className="text-green-400 flex items-center">
                <FontAwesomeIcon icon={faShieldVirus} className="mr-2" />
                <span>Şu an için ekstra koruma gerekmez.</span>
              </div>
            )}
          </div>

          {/* Aktif Kimyasal Bölgeler */}
          {gameState.chemicalZones && gameState.chemicalZones.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                Aktif Kimyasal Bölgeler
              </h4>
              <div className="max-h-32 overflow-y-auto pr-1 zone-scrollbar">
                {gameState.chemicalZones
                  .filter((zone) => zone.expiresAt > Date.now())
                  .map((zone) => (
                    <div
                      key={zone.id}
                      className="text-xs p-2 mb-2 rounded bg-gray-800/40 border border-gray-700/50"
                    >
                      <div className="flex justify-between">
                        <span
                          className={getChemicalColor(
                            zone.type,
                            zone.intensity
                          )}
                        >
                          {getChemicalName(zone.type)}
                        </span>
                        <span className="text-gray-400">
                          {Math.round((zone.expiresAt - Date.now()) / 60000)} dk
                          kaldı
                        </span>
                      </div>
                      <div className="text-gray-500 mt-1">
                        Merkez: {zone.position[0].toFixed(4)},{" "}
                        {zone.position[1].toFixed(4)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChemicalHazardMeter;
