"use client";

import React, { useState, useEffect } from "react";
import { useGameState } from "@/app/context/GameStateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRadiation,
  faCircle,
  faSkull,
  faCrosshairs,
} from "@fortawesome/free-solid-svg-icons";

const ZombieRadar: React.FC = () => {
  const { gameState, markers } = useGameState();
  const [isActive, setIsActive] = useState(false);
  const [scanAngle, setScanAngle] = useState(0);
  const [detectedZombies, setDetectedZombies] = useState<
    Array<{
      distance: number;
      angle: number;
      threat: "low" | "medium" | "high";
    }>
  >([]);

  // Radar tarama animasyonu
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setScanAngle((prev) => (prev + 5) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [isActive]);

  // Zombi tespiti
  useEffect(() => {
    if (!isActive) return;

    // Mevcut şehir konumunu merkez al
    const cityPos = gameState.currentCity.position;

    // Son 24 saat içinde eklenen zombileri filtrele
    const recentZombies = markers.filter(
      (m) => m.type === "zombie" && m.createdAt > Date.now() - 86400000
    );

    // Her zombi için mesafe ve açı hesapla
    const zombieData = recentZombies.map((zombie) => {
      const dx = zombie.position[1] - cityPos[1];
      const dy = zombie.position[0] - cityPos[0];
      const distance = Math.sqrt(dx * dx + dy * dy) * 111; // km cinsinden mesafe
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      // Tehdit seviyesini mesafeye göre belirle
      let threat: "low" | "medium" | "high" = "low";
      if (distance < 2) threat = "high";
      else if (distance < 5) threat = "medium";

      return { distance, angle: (angle + 360) % 360, threat };
    });

    setDetectedZombies(zombieData);
  }, [markers, gameState.currentCity, isActive]);

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <div className="relative">
        <button
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isActive
              ? "bg-red-900/60 border-red-500/50 text-red-400"
              : "glass-button"
          }`}
          onClick={() => setIsActive(!isActive)}
          title="Zombi Radarı"
        >
          <FontAwesomeIcon icon={faRadiation} className="text-xl" />
        </button>

        {isActive && (
          <div className="absolute bottom-full right-0 mb-4 w-64 h-64 rounded-full bg-gray-900/90 border border-gray-700/50 overflow-hidden animate-fadeIn">
            {/* Radar Arka Planı */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-gray-700/30" />
                <div className="absolute w-0.5 h-full bg-gray-700/30" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 rounded-full border border-gray-700/20" />
                <div className="absolute w-1/2 h-1/2 rounded-full border border-gray-700/20" />
                <div className="absolute w-1/4 h-1/4 rounded-full border border-gray-700/20" />
              </div>
            </div>

            {/* Tarama Işını */}
            <div
              className="absolute inset-0 origin-bottom-right bg-gradient-to-t from-red-500/20 to-transparent"
              style={{
                transform: `rotate(${scanAngle}deg)`,
                width: "50%",
              }}
            />

            {/* Merkez İşareti */}
            <div className="absolute inset-0 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faCrosshairs}
                className="text-red-500/70"
              />
            </div>

            {/* Tespit Edilen Zombiler */}
            {detectedZombies.map((zombie, idx) => (
              <div
                key={idx}
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `rotate(${zombie.angle}deg) translateY(-${
                    zombie.distance * 10
                  }px)`,
                }}
              >
                <FontAwesomeIcon
                  icon={faSkull}
                  className={`text-xs ${
                    zombie.threat === "high"
                      ? "text-red-500 animate-pulse"
                      : zombie.threat === "medium"
                      ? "text-yellow-500"
                      : "text-gray-500"
                  }`}
                />
              </div>
            ))}

            {/* Bilgi Paneli */}
            <div className="absolute bottom-2 left-2 right-2 bg-gray-900/80 rounded px-2 py-1 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Tespit: {detectedZombies.length}</span>
                <span>Menzil: 10km</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZombieRadar;
