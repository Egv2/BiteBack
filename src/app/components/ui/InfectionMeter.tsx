import React, { useState } from "react";
import { useGameState } from "@/app/context/GameStateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRadiation,
  faCircle,
  faSkull,
  faCrosshairs,
  faShieldVirus,
  faExclamationTriangle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "@/app/i18n";

const InfectionMeter: React.FC = () => {
  const { gameState, markers, safeCampsOnly } = useGameState();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Varsayılan enfeksiyon oranı
  const infectionRate = 50; // %50 varsayılan değer

  // Koruma Seviyesi Hesaplayıcı
  const calculateProtectionLevel = () => {
    const approvedCamps = markers.filter(
      (m) => m.type === "camp" && m.approved
    ).length;
    const protectionLevel = Math.min(approvedCamps * 10, 100);

    return {
      level: protectionLevel,
      color:
        protectionLevel < 30
          ? "red"
          : protectionLevel < 60
          ? "yellow"
          : "green",
      text:
        protectionLevel < 30
          ? t("infectionMeter.protection.critical")
          : protectionLevel < 60
          ? t("infectionMeter.protection.moderate")
          : t("infectionMeter.protection.good"),
    };
  };

  // Bölge Güvenlik Durumu
  const calculateZoneSafety = () => {
    const protection = calculateProtectionLevel();
    const dangerLevel = Math.min(infectionRate - protection.level, 100);

    return {
      level: dangerLevel,
      status:
        dangerLevel < 30
          ? t("infectionMeter.safety.safe")
          : dangerLevel < 60
          ? t("infectionMeter.safety.risky")
          : t("infectionMeter.safety.dangerous"),
      color:
        dangerLevel < 30
          ? "text-green-400"
          : dangerLevel < 60
          ? "text-yellow-400"
          : "text-red-400",
    };
  };

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {showTooltip && (
          <div className="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs rounded p-2 w-max">
            {t("infectionMeter.tooltip")}
          </div>
        )}
        <button
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all glass-button hover:scale-105 group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FontAwesomeIcon
            icon={faRadiation}
            className="text-xl transform transition-transform group-hover:rotate-45"
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute bottom-14 right-0 w-80">
          {/* Koruma Seviyesi */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">
                {t("infectionMeter.protectionLevel")}
              </span>
              <span
                className={`font-mono ${
                  calculateProtectionLevel().color === "green"
                    ? "text-green-400"
                    : calculateProtectionLevel().color === "yellow"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {calculateProtectionLevel().level}%
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-out ${
                  calculateProtectionLevel().color === "green"
                    ? "bg-green-500"
                    : calculateProtectionLevel().color === "yellow"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${calculateProtectionLevel().level}%` }}
              />
            </div>
          </div>

          {/* Bölge Güvenlik Durumu */}
          <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700/30">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">
                {t("infectionMeter.zoneSafety")}
              </span>
              <span
                className={`text-sm font-semibold ${
                  calculateZoneSafety().color
                }`}
              >
                {calculateZoneSafety().status}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <FontAwesomeIcon
                icon={faShieldVirus}
                className={calculateZoneSafety().color}
              />
              <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    calculateZoneSafety().level < 30
                      ? "bg-green-500"
                      : calculateZoneSafety().level < 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${100 - calculateZoneSafety().level}%` }}
                />
              </div>
            </div>
          </div>

          {/* Günlük İstatistikler */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">
              {t("infectionMeter.dailyStats")}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-gray-800/30 border border-gray-700/30">
                <div className="text-xs text-gray-400">
                  {t("infectionMeter.newZombies")}
                </div>
                <div className="text-lg font-mono text-red-400">
                  +
                  {
                    markers.filter(
                      (m) =>
                        m.type === "zombie" &&
                        m.createdAt > Date.now() - 86400000 // Son 24 saat
                    ).length
                  }
                </div>
              </div>
              <div className="p-2 rounded bg-gray-800/30 border border-gray-700/30">
                <div className="text-xs text-gray-400">
                  {t("infectionMeter.newSafeCamps")}
                </div>
                <div className="text-lg font-mono text-green-400">
                  +
                  {
                    markers.filter(
                      (m) =>
                        m.type === "camp" &&
                        m.approved &&
                        m.createdAt > Date.now() - 86400000
                    ).length
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Tavsiyeler */}
          <div className="mt-4 text-sm">
            <h4 className="font-semibold text-gray-300 mb-2">
              {t("infectionMeter.recommendations")}
            </h4>
            {calculateZoneSafety().level > 60 ? (
              <div className="text-red-400 flex items-center">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="mr-2"
                />
                <span>{t("infectionMeter.recommendationDangerous")}</span>
              </div>
            ) : calculateZoneSafety().level > 30 ? (
              <div className="text-yellow-400 flex items-center">
                <FontAwesomeIcon icon={faShieldVirus} className="mr-2" />
                <span>{t("infectionMeter.recommendationRisky")}</span>
              </div>
            ) : (
              <div className="text-green-400 flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                <span>{t("infectionMeter.recommendationSafe")}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfectionMeter;
