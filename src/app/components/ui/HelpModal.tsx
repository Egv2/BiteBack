"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faTimes,
  faChevronUp,
  faChevronDown,
  faInfoCircle,
  faMapMarkerAlt,
  faCampground,
  faWalking,
  faComment,
  faMedkit,
  faThumbsUp,
  faArrowLeft,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/app/i18n";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const [isMobile, setIsMobile] = useState(false);

  // Ekran boyutunu kontrol et
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ESC ile kapatma (sadece desktop için)
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

  if (!isOpen) return null;

  // Mobil için tam sayfa görünümü, desktop için modal dialog
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-3 flex items-center z-10">
          <button
            onClick={onClose}
            className="p-2 mr-2 -ml-1 rounded-md text-gray-400 hover:text-white"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h2 className="text-lg font-bold flex items-center">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-blue-400 mr-2"
            />
            {t("help.title")}
          </h2>
        </div>

        <div className="p-4 pb-20">
          {/* Mobil için sekme tabanlı içerik (accordion şeklinde) */}
          <div className="space-y-3">
            {/* Harita Kullanımı Accordion */}
            <Accordion title={t("help.mapUsage.title")} icon={faMapMarkerAlt}>
              <p className="mb-3">{t("help.mapUsage.description")}</p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="bg-red-900/30 p-2 rounded-md mr-3">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-red-500"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{t("help.markers.zombie")}</p>
                  </div>
                </div>
                {/* Diğer marker bilgileri */}
                <div className="flex items-start">
                  <div className="bg-green-900/30 p-2 rounded-md mr-3">
                    <FontAwesomeIcon
                      icon={faCampground}
                      className="text-green-500"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{t("help.markers.camp")}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-900/30 p-2 rounded-md mr-3">
                    <FontAwesomeIcon
                      icon={faWalking}
                      className="text-purple-500"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{t("help.markers.traffic")}</p>
                  </div>
                </div>
              </div>
            </Accordion>

            {/* Diğer accordionlar aynı şekilde devam eder */}
            <Accordion title={t("help.chat.title")} icon={faComment}>
              <p className="mb-3">{t("help.chat.description")}</p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="bg-red-900/30 p-2 rounded-md mr-3">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{t("help.chat.sos")}</p>
                  </div>
                </div>
              </div>
            </Accordion>

            <Accordion title={t("help.exp.title")} icon={faCampground}>
              <p className="mb-3">{t("help.exp.description")}</p>
              <ul className="space-y-1 list-disc list-inside pl-2">
                <li>{t("help.exp.zombie")}</li>
                <li>{t("help.exp.camp")}</li>
                <li>{t("help.exp.vote")}</li>
              </ul>
            </Accordion>

            <Accordion title={t("help.tips.title")} icon={faInfoCircle}>
              <ul className="space-y-2 list-disc list-inside pl-2">
                <li>{t("help.tips.emergencyMessages")}</li>
                <li>{t("help.tips.campApproval")}</li>
                <li>{t("help.tips.safeCamps")}</li>
              </ul>
            </Accordion>
          </div>

          <div className="mt-8 mb-4 p-3 bg-gray-800/30 rounded-lg text-xs text-gray-400">
            <p>{t("help.disclaimer")}</p>
          </div>
        </div>
      </div>
    );
  }

  // Desktop için ModalDialog bileşeni
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="glass-panel max-w-4xl w-full mx-auto max-h-[85vh] overflow-y-auto custom-scrollbar my-4"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal içeriği */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    {t("help.title")}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white"
                  >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                  </button>
                </div>
                <DesktopTabs />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Mobil için Accordion bileşeni
const Accordion: React.FC<{
  title: string;
  icon: any;
  children: React.ReactNode;
}> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700/50">
      <button
        className="flex items-center justify-between w-full p-3 text-left font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <FontAwesomeIcon icon={icon} className="text-blue-400 mr-2" />
          <span>{title}</span>
        </div>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="text-gray-400"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 border-t border-gray-700/30">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Desktop için Tab component
const DesktopTabs: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<string>("map");

  // Tab içerikleri
  const tabs = [
    { id: "map", title: t("help.mapUsage.title"), icon: faMapMarkerAlt },
    { id: "chat", title: t("help.chat.title"), icon: faComment },
    { id: "exp", title: t("help.exp.title"), icon: faCampground },
    { id: "tips", title: t("help.tips.title"), icon: faInfoCircle },
  ];

  return (
    <div className="mb-4">
      {/* Tab Menüsü */}
      <div className="flex border-b border-gray-700 mb-4 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "text-blue-400 border-b-2 border-blue-400 -mb-px"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <FontAwesomeIcon icon={tab.icon} className="mr-2" />
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab İçeriği */}
      <div className="min-h-[300px]">
        {activeTab === "map" && (
          <div className="space-y-4">
            <p>{t("help.mapUsage.description")}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50 flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-red-900/30 rounded-md mr-3">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-red-500"
                  />
                </div>
                <div>
                  <p className="font-medium">{t("help.markers.zombie")}</p>
                  <p className="text-sm text-gray-400">
                    {t("help.markers.zombieDesc")}
                  </p>
                </div>
              </div>
              <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50 flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-green-900/30 rounded-md mr-3">
                  <FontAwesomeIcon
                    icon={faCampground}
                    className="text-green-500"
                  />
                </div>
                <div>
                  <p className="font-medium">{t("help.markers.camp")}</p>
                  <p className="text-sm text-gray-400">
                    {t("help.markers.campDesc")}
                  </p>
                </div>
              </div>
              <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50 flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-purple-900/30 rounded-md mr-3">
                  <FontAwesomeIcon
                    icon={faWalking}
                    className="text-purple-500"
                  />
                </div>
                <div>
                  <p className="font-medium">{t("help.markers.traffic")}</p>
                  <p className="text-sm text-gray-400">
                    {t("help.markers.trafficDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="space-y-4">
            <p>{t("help.chat.description")}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50 flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-red-900/30 rounded-md mr-3">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="text-red-500"
                  />
                </div>
                <div>
                  <p className="font-medium">{t("help.chat.sos")}</p>
                  <p className="text-sm text-gray-400">
                    {t("help.chat.sosDesc")}
                  </p>
                </div>
              </div>
              <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50 flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-yellow-900/30 rounded-md mr-3">
                  <FontAwesomeIcon
                    icon={faMedkit}
                    className="text-yellow-500"
                  />
                </div>
                <div>
                  <p className="font-medium">{t("help.chat.requestItem")}</p>
                  <p className="text-sm text-gray-400">
                    {t("help.chat.requestItemDesc")}
                  </p>
                </div>
              </div>
              <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50 flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-green-900/30 rounded-md mr-3">
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    className="text-green-500"
                  />
                </div>
                <div>
                  <p className="font-medium">{t("help.chat.vote")}</p>
                  <p className="text-sm text-gray-400">
                    {t("help.chat.voteDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "exp" && (
          <div className="space-y-4">
            <p>{t("help.exp.description")}</p>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50">
                <h4 className="font-medium text-blue-400 mb-2">
                  {t("help.exp.actions")}
                </h4>
                <ul className="space-y-1 pl-5 list-disc">
                  <li>
                    {t("help.exp.zombie")}{" "}
                    <span className="text-green-500">+20 XP</span>
                  </li>
                  <li>
                    {t("help.exp.camp")}{" "}
                    <span className="text-green-500">+30 XP</span>
                  </li>
                  <li>
                    {t("help.exp.vote")}{" "}
                    <span className="text-green-500">+10 XP</span>
                  </li>
                  <li>
                    {t("help.exp.sos")}{" "}
                    <span className="text-green-500">+50 XP</span>
                  </li>
                  <li>
                    {t("help.exp.requestItem")}{" "}
                    <span className="text-green-500">+10 XP</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50">
                <h4 className="font-medium text-blue-400 mb-2">
                  {t("help.ranks.title")}
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="inline-block w-8 h-8 rounded-full bg-gray-700 mr-2 flex items-center justify-center text-xs">
                      1
                    </span>
                    <span className="font-medium">0-100 XP:</span>
                    <span className="ml-2 text-gray-400">
                      {t("help.ranks.novice")}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-8 h-8 rounded-full bg-blue-900/50 mr-2 flex items-center justify-center text-xs">
                      2
                    </span>
                    <span className="font-medium">101-300 XP:</span>
                    <span className="ml-2 text-gray-400">
                      {t("help.ranks.survivor")}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-8 h-8 rounded-full bg-green-900/50 mr-2 flex items-center justify-center text-xs">
                      3
                    </span>
                    <span className="font-medium">301-600 XP:</span>
                    <span className="ml-2 text-gray-400">
                      {t("help.ranks.ranger")}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-8 h-8 rounded-full bg-purple-900/50 mr-2 flex items-center justify-center text-xs">
                      4
                    </span>
                    <span className="font-medium">601-1000 XP:</span>
                    <span className="ml-2 text-gray-400">
                      {t("help.ranks.defender")}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-8 h-8 rounded-full bg-red-900/50 mr-2 flex items-center justify-center text-xs">
                      5
                    </span>
                    <span className="font-medium">1001+ XP:</span>
                    <span className="ml-2 text-gray-400">
                      {t("help.ranks.elite")}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tips" && (
          <div className="space-y-4">
            <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50">
              <h4 className="font-medium text-blue-400 mb-2">
                {t("help.tips.title")}
              </h4>
              <ul className="space-y-3 pl-5 list-disc">
                <li>
                  <span className="font-medium">
                    {t("help.tips.emergencyMessages")}
                  </span>
                  <p className="text-sm text-gray-400">
                    {t("help.tips.emergencyMessagesDesc")}
                  </p>
                </li>
                <li>
                  <span className="font-medium">
                    {t("help.tips.campApproval")}
                  </span>
                  <p className="text-sm text-gray-400">
                    {t("help.tips.campApprovalDesc")}
                  </p>
                </li>
                <li>
                  <span className="font-medium">
                    {t("help.tips.citySelection")}
                  </span>
                  <p className="text-sm text-gray-400">
                    {t("help.tips.citySelectionDesc")}
                  </p>
                </li>
                <li>
                  <span className="font-medium">
                    {t("help.tips.safeCamps")}
                  </span>
                  <p className="text-sm text-gray-400">
                    {t("help.tips.safeCampsDesc")}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpModal;
