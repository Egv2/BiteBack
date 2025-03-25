"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faSkull,
  faTent,
  faMedkit,
  faChartLine,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useGameState } from "@/app/context/GameStateContext";
import { useI18n } from "@/app/i18n";

const GameStats: React.FC = () => {
  const { markers, gameState } = useGameState();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  // İstatistik hesaplamaları
  const stats = {
    zombieCount: markers.filter((m) => m.type === "zombie").length,
    safeZones: markers.filter((m) => m.type === "camp" && m.approved).length,
    pendingCamps: markers.filter((m) => m.type === "camp" && !m.approved)
      .length,
    trafficPoints: markers.filter((m) => m.type === "traffic").length,
    survivalRate: calculateSurvivalRate(),
    gameDays: Math.floor((Date.now() - 1645000000000) / (1000 * 60 * 60 * 24)), // Simüle edilmiş gün sayısı
  };

  // Hayatta kalma oranı hesaplama
  function calculateSurvivalRate(): number {
    const safeZoneCount = stats.safeZones;
    const zombieCount = stats.zombieCount;

    if (zombieCount === 0) return 100;
    if (safeZoneCount === 0) return 10;

    // Basit bir hayatta kalma oranı algoritması
    const baseRate = 50;
    const zoneBonus = safeZoneCount * 5;
    const zombiePenalty = zombieCount * 2;

    return Math.min(100, Math.max(5, baseRate + zoneBonus - zombiePenalty));
  }

  return (
    <div className="fixed top-16 right-4 z-30">
      <button
        className="glass-button p-2 rounded-full w-10 h-10 flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faChartLine} className="text-blue-400" />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-64 bg-gray-900/90 backdrop-blur-md rounded-lg p-4 border border-gray-800 shadow-lg">
          <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">
            {t("stats.title")}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-300">
                <FontAwesomeIcon icon={faSkull} className="text-red-500 mr-2" />
                <span>{t("stats.zombies")}</span>
              </div>
              <span className="text-white font-mono">{stats.zombieCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-300">
                <FontAwesomeIcon
                  icon={faTent}
                  className="text-green-500 mr-2"
                />
                <span>{t("stats.safeZones")}</span>
              </div>
              <span className="text-white font-mono">{stats.safeZones}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-300">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-blue-400 mr-2"
                />
                <span>{t("stats.survivalRate")}</span>
              </div>
              <span className="text-white font-mono">
                {stats.survivalRate}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-300">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-purple-400 mr-2"
                />
                <span>{t("stats.day")}</span>
              </div>
              <span className="text-white font-mono">{stats.gameDays}</span>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-700">
              <div className="text-xs text-gray-400">
                {t("stats.inventoryStatus")}:
              </div>
              <div className="flex justify-between mt-1">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faMedkit}
                    className="text-red-400 mr-1"
                  />
                  <span className="text-sm">{t("items.medkit")}</span>
                </div>
                <span className="text-sm font-mono">
                  {gameState.inventory?.medkit || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            {t("stats.sessionInfo")}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStats;
