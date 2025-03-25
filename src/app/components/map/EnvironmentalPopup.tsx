"use client";
import React from "react";
import { useGameState } from "@/app/context/GameStateContext";
import { useI18n } from "@/app/i18n";

interface EnvironmentalPopupProps {
  position: [number, number];
  onClose: () => void;
}

const EnvironmentalPopup: React.FC<EnvironmentalPopupProps> = ({
  position,
  onClose,
}) => {
  const { t } = useI18n();
  const { gameState } = useGameState();

  // Çevre analizi
  const analyzeArea = () => {
    return {
      threats: {
        airPollution: Math.random() * 100,
        zombieDensity: Math.random() * 100,
        activeCombat: Math.random() > 0.7,
      },
      recommendations: [],
    };
  };

  const { threats } = analyzeArea();

  return (
    <div className="glass-panel p-4 rounded-lg space-y-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">{t("environment.title")}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="environment-indicator bg-red-900/20">
          <span>☢️ {t("environment.radiation")}</span>
          <div className="h-1 bg-gray-700">
            <div
              className="h-full bg-red-500"
              style={{ width: `${threats.airPollution}%` }}
            />
          </div>
        </div>

        <div className="environment-indicator bg-yellow-900/20">
          <span>🧟 {t("environment.zombieDensity")}</span>
          <div className="h-1 bg-gray-700">
            <div
              className="h-full bg-yellow-500"
              style={{ width: `${threats.zombieDensity}%` }}
            />
          </div>
        </div>

        {threats.activeCombat && (
          <div className="environment-indicator bg-orange-900/20">
            <span>🔥 {t("environment.activeCombat")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnvironmentalPopup;
