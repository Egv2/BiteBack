"use client";

import React from "react";
import { Circle, Tooltip } from "react-leaflet";
import { useGameState } from "@/app/context/GameStateContext";

const ChemicalOverlay: React.FC = () => {
  const { chemicalZones } = useGameState();
  const currentTime = Date.now();

  // Aktif kimyasal bölgeleri filtrele
  const activeZones = chemicalZones.filter(
    (zone) => zone.expiresAt > currentTime
  );

  const getChemicalColor = (type: string, intensity: number): string => {
    // Kimyasal türüne göre renk belirle
    const baseColor =
      type === "tearGas"
        ? "#4ade80"
        : type === "toxin"
        ? "#ef4444"
        : type === "smokeScreen"
        ? "#94a3b8"
        : type === "radiation"
        ? "#a855f7"
        : "#64748b";

    // İntensiteye göre opaklık ayarla
    const opacity = Math.min(0.7, Math.max(0.2, intensity / 150));

    return (
      baseColor +
      Math.floor(opacity * 255)
        .toString(16)
        .padStart(2, "0")
    );
  };

  // Kalan süreyi yüzde olarak hesapla
  const getTimeRemainingPercent = (
    createdAt: number,
    expiresAt: number
  ): number => {
    const totalDuration = expiresAt - createdAt;
    const elapsed = currentTime - createdAt;
    const remaining = Math.max(0, 1 - elapsed / totalDuration);
    return remaining * 100;
  };

  const getChemicalName = (type: string): string => {
    switch (type) {
      case "tearGas":
        return "Biber Gazı";
      case "toxin":
        return "Toksin";
      case "smokeScreen":
        return "Duman Perdesi";
      case "radiation":
        return "Radyasyon";
      default:
        return "Kimyasal";
    }
  };

  return (
    <>
      {activeZones.map((zone) => {
        const timeRemaining = getTimeRemainingPercent(
          zone.createdAt,
          zone.expiresAt
        );
        const adjustedIntensity = zone.intensity * (timeRemaining / 100);

        return (
          <Circle
            key={zone.id}
            center={[zone.position[0], zone.position[1]]}
            radius={zone.radius * 1000} // metre cinsinden
            pathOptions={{
              color: getChemicalColor(zone.type, adjustedIntensity),
              fillColor: getChemicalColor(zone.type, adjustedIntensity),
              fillOpacity: Math.min(0.65, adjustedIntensity / 150),
              weight: 1,
            }}
            className="animate-pulse-slow"
          >
            <Tooltip direction="center" permanent={false}>
              <div className="text-center">
                <div className="font-bold">{getChemicalName(zone.type)}</div>
                <div className="text-sm">
                  Yoğunluk: {Math.round(adjustedIntensity)}%
                </div>
                <div className="text-xs">
                  {Math.ceil((zone.expiresAt - currentTime) / 60000)} dakika
                  kaldı
                </div>
              </div>
            </Tooltip>
          </Circle>
        );
      })}
    </>
  );
};

export default ChemicalOverlay;
