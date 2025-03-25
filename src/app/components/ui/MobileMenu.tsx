"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faMapMarkedAlt,
  faBoxOpen,
  faInfoCircle,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "@/app/i18n";

interface MobileMenuProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  toggleChat: () => void;
  isChatOpen: boolean;
  toggleInventory: () => void;
  toggleHelp: () => void;
  toggleSettings: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  activeSection,
  setActiveSection,
  toggleChat,
  isChatOpen,
  toggleInventory,
  toggleHelp,
  toggleSettings,
}) => {
  const { t } = useI18n();

  // Dev ortamında console.log ekleme
  const handleButtonClick = (section: string, action: () => void) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`Mobile menu button clicked: ${section}`);
    }
    setActiveSection(section);
    action();
  };

  return (
    <div className="mobile-menu md:hidden">
      <button
        className={`mobile-menu-button ${
          activeSection === "map" ? "active" : ""
        }`}
        onClick={() => handleButtonClick("map", () => {})}
      >
        <FontAwesomeIcon icon={faMapMarkedAlt} className="text-blue-400" />
        <span>{t("mobileMenu.map")}</span>
      </button>

      <button
        className={`mobile-menu-button ${isChatOpen ? "active" : ""}`}
        onClick={() => handleButtonClick(isChatOpen ? "" : "chat", toggleChat)}
      >
        <FontAwesomeIcon
          icon={faComments}
          className={isChatOpen ? "text-blue-400" : "text-gray-400"}
        />
        <span>{t("mobileMenu.chat")}</span>
      </button>

      <button
        className={`mobile-menu-button ${
          activeSection === "inventory" ? "active" : ""
        }`}
        onClick={() => handleButtonClick("inventory", toggleInventory)}
      >
        <FontAwesomeIcon icon={faBoxOpen} className="text-yellow-400" />
        <span>{t("mobileMenu.inventory")}</span>
      </button>

      <button
        className={`mobile-menu-button ${
          activeSection === "help" ? "active" : ""
        }`}
        onClick={() => handleButtonClick("help", toggleHelp)}
      >
        <FontAwesomeIcon icon={faInfoCircle} className="text-green-400" />
        <span>{t("mobileMenu.help")}</span>
      </button>

      <button
        className={`mobile-menu-button ${
          activeSection === "settings" ? "active" : ""
        }`}
        onClick={() => handleButtonClick("settings", toggleSettings)}
      >
        <FontAwesomeIcon
          icon={faCog}
          className={
            activeSection === "settings" ? "text-blue-400" : "text-gray-400"
          }
        />
        <span>{t("mobileMenu.settings")}</span>
      </button>
    </div>
  );
};

export default MobileMenu;
