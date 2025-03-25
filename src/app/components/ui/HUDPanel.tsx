"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVirus,
  faRadiation,
  faFlask,
  faCompass,
  faWind,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/app/context/GameStateContext";
import { useI18n } from "@/app/i18n";

const HUDPanel: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isToolMenuOpen, setIsToolMenuOpen] = useState(false);
  const { gameState } = useGameState();
  const { t } = useI18n();

  // Ekran boyutunu izle
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const tools = [
    {
      id: "infection",
      icon: faVirus,
      pulse: (gameState.infectionRate ?? 0) > 60,
    },
    {
      id: "zombies",
      icon: faRadiation,
      pulse: gameState.zombieAlertActive ?? false,
    },
    {
      id: "chemicals",
      icon: faFlask,
      pulse:
        gameState.chemicalZones?.some(
          (z) => z.type === "toxin" && z.intensity > 70
        ) ?? false,
    },
    { id: "radar", icon: faCompass, pulse: false },
    {
      id: "environment",
      icon: faWind,
      pulse: (gameState.chemicalZones?.length ?? 0) > 0,
    },
  ];

  const toggleTool = (toolId: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`HUD tool toggled: ${toolId}`);
    }

    if (activeTool === toolId) {
      setActiveTool(null);
    } else {
      setActiveTool(toolId);
    }
  };

  const toggleToolMenu = () => {
    setIsToolMenuOpen(!isToolMenuOpen);
  };

  return (
    <>
      {/* HUD Araçları Butonu */}
      <div
        className={`fixed ${
          isMobile ? "bottom-16 left-4" : "bottom-4 left-4"
        } z-30`}
      >
        <button
          className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-700"
          onClick={toggleToolMenu}
          aria-label={t("hudPanel.toggleButton")}
        >
          <FontAwesomeIcon icon={faEllipsisH} />
        </button>

        <AnimatePresence>
          {isToolMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute ${
                isMobile ? "bottom-12 left-0" : "left-12 bottom-0"
              } bg-gray-800/90 backdrop-blur-sm p-2 rounded-lg border border-gray-700 shadow-lg`}
            >
              <div
                className={`flex ${isMobile ? "flex-row" : "flex-col"} gap-2`}
              >
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    className={`w-10 h-10 rounded-md flex items-center justify-center transition-all duration-200 ${
                      activeTool === tool.id
                        ? "bg-blue-900/50 border border-blue-700/50 text-blue-400"
                        : "glass-button text-gray-400 hover:text-gray-200"
                    } ${tool.pulse ? "animate-pulse" : ""}`}
                    onClick={() => toggleTool(tool.id)}
                    aria-label={t(`hudPanel.${tool.id}`)}
                  >
                    <FontAwesomeIcon icon={tool.icon} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Panel içeriği - geçici boş div */}
      {activeTool && (
        <div
          className={`absolute ${
            isMobile ? "bottom-20 left-4" : "bottom-4 left-20"
          } w-80 bg-gray-900/90 backdrop-blur-md p-4 rounded-lg border border-gray-800 shadow-lg`}
        >
          <h3 className="text-lg font-bold mb-3">
            {t(`hudPanel.${activeTool}`)}
          </h3>
          <p className="text-gray-400">
            {activeTool} paneli henüz uygulanmadı.
          </p>
        </div>
      )}
    </>
  );
};

export default HUDPanel;
