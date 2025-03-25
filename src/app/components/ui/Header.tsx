"use client";

import React from "react";
import { useGameState } from "@/app/context/GameStateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMapMarkerAlt,
  faBoxOpen,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import Inventory from "./Inventory";
import { useI18n } from "@/app/i18n";

interface HeaderProps {
  toggleInventory: () => void;
  isInventoryOpen: boolean;
  toggleHelp?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  toggleInventory,
  isInventoryOpen,
  toggleHelp,
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
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-gray-900 border-b border-gray-800 py-2 px-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-lg font-bold text-[#00b4d8] drop-shadow-glow md:text-xl">
          {t("app.title")}
        </h1>

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

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* EXP counter */}
        <div className="bg-gray-800/80 px-2 py-1 rounded-md text-xs md:text-sm flex items-center border border-gray-700/50">
          <span className="text-white font-medium mr-1">
            {t("header.exp")}:
          </span>
          <span className="text-[#00b4d8]">{gameState.exp || 0}</span>
        </div>

        {/* Player ID */}
        <div className="bg-gray-800/80 px-2 py-1 rounded-md text-xs md:text-sm flex items-center border border-gray-700/50">
          <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-1" />
          <span className="text-gray-300">
            {gameState.playerId?.substring(0, 8) || "Survivor"}
          </span>
        </div>

        {/* Desktop'ta envanter butonu */}
        {windowWidth >= 768 && (
          <div className="hidden md:block">
            <Inventory isOpen={isInventoryOpen} onClose={toggleInventory} />
          </div>
        )}

        {/* Desktop'ta yardım butonu */}
        {windowWidth >= 768 && toggleHelp && (
          <button
            onClick={toggleHelp}
            className="glass-button p-2 rounded-md"
            aria-label="Yardım"
          >
            <FontAwesomeIcon
              icon={faQuestionCircle}
              className="text-[#00b4d8]"
            />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
