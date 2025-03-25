"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faTimes,
  faGlobe,
  faPalette,
  faServer,
  faVolumeUp,
  faUserCircle,
  faArrowLeft,
  faSun,
  faMoon,
  faCheckSquare,
  faSquare,
  faRotate,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n, Locale } from "@/app/i18n";
import { useGameState } from "@/app/context/GameStateContext";
import { useTheme } from "@/app/context/ThemeContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t, locale, setLocale, locales } = useI18n();
  const { gameState } = useGameState();
  const { theme, toggleTheme, setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(true);
  const [serverRegion, setServerRegion] = useState<string>("eu");

  // Screen size check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close with ESC key (desktop only)
  useEffect(() => {
    if (!isMobile) {
      const handleEscKey = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
        }
      };

      window.addEventListener("keydown", handleEscKey);
      return () => window.removeEventListener("keydown", handleEscKey);
    }
  }, [isOpen, onClose, isMobile]);

  // Load settings from localStorage (first render)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSound = localStorage.getItem("soundEnabled");
      const savedNotifications = localStorage.getItem("notificationsEnabled");
      const savedRegion = localStorage.getItem("serverRegion");

      if (savedSound !== null) setSoundEnabled(savedSound === "true");
      if (savedNotifications !== null)
        setNotificationsEnabled(savedNotifications === "true");
      if (savedRegion) setServerRegion(savedRegion);
    }
  }, []);

  // Sound setting
  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem("soundEnabled", String(newValue));
    if (process.env.NODE_ENV === "development") {
      console.log(`Sound toggled: ${newValue}`);
    }
  };

  // Notification setting
  const toggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem("notificationsEnabled", String(newValue));
    if (process.env.NODE_ENV === "development") {
      console.log(`Notifications toggled: ${newValue}`);
    }
  };

  // Change language
  const changeLanguage = (lang: Locale) => {
    setLocale(lang);
    if (process.env.NODE_ENV === "development") {
      console.log(`Language changed to: ${lang}`);
    }
  };

  // Change server region
  const changeRegion = (region: string) => {
    setServerRegion(region);
    localStorage.setItem("serverRegion", region);
    if (process.env.NODE_ENV === "development") {
      console.log(`Server region changed to: ${region}`);
    }
  };

  // Reset settings
  const resetSettings = () => {
    // Default values
    setSoundEnabled(true);
    setNotificationsEnabled(true);
    setServerRegion("eu");
    setTheme("dark");
    setLocale("en");

    // Save to localStorage
    localStorage.setItem("soundEnabled", "true");
    localStorage.setItem("notificationsEnabled", "true");
    localStorage.setItem("serverRegion", "eu");
    localStorage.setItem("theme", "dark");

    if (process.env.NODE_ENV === "development") {
      console.log("All settings reset to defaults");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="bg-gray-800 p-8 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t("settings.title")}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex mb-6 border-b border-gray-700">
                <button
                  onClick={() => setActiveTab("general")}
                  className={`px-4 py-2 mr-2 ${
                    activeTab === "general"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400"
                  }`}
                >
                  {t("settings.general")}
                </button>
                <button
                  onClick={() => setActiveTab("appearance")}
                  className={`px-4 py-2 mr-2 ${
                    activeTab === "appearance"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400"
                  }`}
                >
                  {t("settings.appearance")}
                </button>
                <button
                  onClick={() => setActiveTab("language")}
                  className={`px-4 py-2 ${
                    activeTab === "language"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400"
                  }`}
                >
                  {t("settings.language")}
                </button>
              </div>

              <div className="space-y-6">
                {activeTab === "general" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-blue-900/30 p-2 rounded-md mr-3">
                          <FontAwesomeIcon
                            icon={faUserCircle}
                            className="text-blue-400"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{t("settings.account")}</p>
                          <p className="text-sm text-gray-400 truncate max-w-[200px]">
                            {gameState.playerId}
                          </p>
                        </div>
                      </div>
                      <button className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {t("settings.rename")}
                      </button>
                    </div>

                    {/* Sound Toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-blue-900/30 p-2 rounded-md mr-3">
                          <FontAwesomeIcon
                            icon={faVolumeUp}
                            className="text-blue-400"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{t("settings.sound")}</p>
                          <p className="text-sm text-gray-400">
                            {t("settings.soundDesc")}
                          </p>
                        </div>
                      </div>
                      <button onClick={toggleSound} className="text-blue-400">
                        <FontAwesomeIcon
                          icon={soundEnabled ? faCheckSquare : faSquare}
                          size="lg"
                        />
                      </button>
                    </div>

                    {/* Notifications Toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-blue-900/30 p-2 rounded-md mr-3">
                          <FontAwesomeIcon
                            icon={faBell}
                            className="text-blue-400"
                          />
                        </div>
                        <div>
                          <p className="font-medium">
                            {t("settings.notifications")}
                          </p>
                          <p className="text-sm text-gray-400">
                            {t("settings.notificationsDesc")}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={toggleNotifications}
                        className="text-blue-400"
                      >
                        <FontAwesomeIcon
                          icon={notificationsEnabled ? faCheckSquare : faSquare}
                          size="lg"
                        />
                      </button>
                    </div>

                    {/* Server Region */}
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-blue-900/30 p-2 rounded-md mr-3">
                          <FontAwesomeIcon
                            icon={faServer}
                            className="text-blue-400"
                          />
                        </div>
                        <div>
                          <p className="font-medium">
                            {t("settings.serverRegion")}
                          </p>
                        </div>
                      </div>
                      <select
                        value={serverRegion}
                        onChange={(e) => changeRegion(e.target.value)}
                        className="bg-gray-700 text-white rounded p-1"
                      >
                        <option value="eu">Europe</option>
                        <option value="na">North America</option>
                        <option value="as">Asia</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "appearance" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-blue-900/30 p-2 rounded-md mr-3">
                          <FontAwesomeIcon
                            icon={theme === "dark" ? faMoon : faSun}
                            className="text-blue-400"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{t("settings.theme")}</p>
                          <p className="text-sm text-gray-400">
                            {theme === "dark"
                              ? t("settings.darkMode")
                              : t("settings.lightMode")}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="px-3 py-1 bg-gray-700 rounded-md text-sm"
                      >
                        {theme === "dark"
                          ? t("settings.lightMode")
                          : t("settings.darkMode")}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "language" && (
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-900/30 p-2 rounded-md mr-3">
                          <FontAwesomeIcon
                            icon={faGlobe}
                            className="text-blue-400"
                          />
                        </div>
                        <p className="font-medium">{t("settings.language")}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          className={`p-2 rounded-md flex items-center justify-center ${
                            locale === "en"
                              ? "bg-blue-900/50 border border-blue-700/50"
                              : "bg-gray-700"
                          }`}
                          onClick={() => changeLanguage("en")}
                        >
                          <span className="mr-2">🇬🇧</span>
                          English
                        </button>
                        <button
                          className={`p-2 rounded-md flex items-center justify-center ${
                            locale === "tr"
                              ? "bg-blue-900/50 border border-blue-700/50"
                              : "bg-gray-700"
                          }`}
                          onClick={() => changeLanguage("tr")}
                        >
                          <span className="mr-2">🇹🇷</span>
                          Türkçe
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Buttons */}
              <div className="flex justify-between mt-6 pt-4 border-t border-gray-700">
                <button
                  onClick={resetSettings}
                  className="flex items-center text-gray-400 hover:text-white p-2"
                >
                  <FontAwesomeIcon icon={faRotate} className="mr-2" />
                  {t("settings.resetToDefaults")}
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white font-medium"
                >
                  {t("settings.save")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
