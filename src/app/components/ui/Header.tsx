"use client";

import React from "react";
import { useGameState } from "@/app/context/GameStateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMapMarkerAlt,
  faBoxOpen,
  faQuestionCircle,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import Inventory from "./Inventory";
import { useI18n } from "@/app/i18n";
import Logo from "./Logo";

interface HeaderProps {
  toggleInventory: () => void;
  isInventoryOpen: boolean;
  toggleHelp: () => void;
  toggleSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({
  toggleInventory,
  isInventoryOpen,
  toggleHelp,
  toggleSettings,
}) => {
  const { gameState } = useGameState();
  const { t } = useI18n();
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Ekran genişliğini izle
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      console.log("Window resized to:", window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-gray-900 border-b border-gray-800 py-2 px-4 flex justify-between items-center">
      <div className="flex items-center">
        <Logo size={windowWidth < 768 ? "sm" : "md"} />

        {/* Mobilde yer kazanmak için konum bilgisini sadece desktop'ta göster */}
        {windowWidth >= 768 && (
          <div className="ml-4 flex items-center text-sm">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="text-red-500 mr-1"
            />
            <span className="text-gray-400">
              {gameState.currentCity?.name || "Istanbul"}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center">
        {/* XP Göstergesi */}
        <div className="flex items-center mr-3 bg-gray-800/70 px-2 py-1 rounded-md">
          <div className="mr-1 text-xs font-mono text-yellow-400">XP</div>
          <span className="text-white">{gameState.exp}</span>
          {gameState.rank && (
            <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300">
              {t(`ranks.${gameState.rank}`)}
            </span>
          )}
        </div>

        {/* Sadece desktop'ta görünecek butonlar */}
        {windowWidth >= 768 && (
          <>
            <button
              onClick={toggleHelp}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 mr-2"
              aria-label={t("help.title")}
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
            </button>

            <button
              onClick={toggleSettings}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 mr-2"
              aria-label={t("settings.title")}
            >
              <FontAwesomeIcon icon={faCog} />
            </button>
          </>
        )}

        {/* Envanter */}
        <Inventory isOpen={isInventoryOpen} onClose={toggleInventory} />
      </div>
    </header>
  );
};

export default Header;
