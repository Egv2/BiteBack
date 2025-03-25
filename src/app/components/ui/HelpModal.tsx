"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faTimes,
  faSkull,
  faTent,
  faCar,
  faExclamationTriangle,
  faInfoCircle,
  faMapMarkerAlt,
  faCampground,
  faWalking,
  faComment,
  faMedkit,
  faThumbsUp,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/app/i18n";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();

  // ESC ile kapatma
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  // Modalı kilitleme
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Kapatma fonksiyonu
  const handleClose = () => {
    onClose();
    if (process.env.NODE_ENV === "development") {
      console.log("Help modal closed by user");
    }
  };

  return (
    <>
      <button
        className="fixed bottom-4 right-4 z-50 rounded-full glass-button w-12 h-12 flex items-center justify-center text-[#00b4d8] shadow-lg hover:scale-105 transition-transform"
        onClick={() => onClose()}
        aria-label="Yardım"
      >
        <FontAwesomeIcon icon={faQuestionCircle} className="text-xl" />
      </button>

      {isOpen && (
        <AnimatePresence>
          {/* Modal Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Help Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto help-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative glass-panel p-5 rounded-lg shadow-xl">
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              <div className="text-center mb-6">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="text-blue-400 text-3xl mb-2"
                />
                <h2 className="text-2xl font-bold text-white">
                  {t("help.title")}
                </h2>
              </div>

              {/* Mobil için sekme tabanlı içerik (accordion şeklinde) */}
              <div className="md:hidden space-y-2">
                {/* Harita Kullanımı Accordion */}
                <Accordion
                  title={t("help.mapUsage.title")}
                  icon={faMapMarkerAlt}
                >
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
                        <p className="font-medium">
                          {t("help.markers.zombie")}
                        </p>
                      </div>
                    </div>
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
                        <p className="font-medium">
                          {t("help.markers.traffic")}
                        </p>
                      </div>
                    </div>
                  </div>
                </Accordion>

                {/* Sohbet Sistemi Accordion */}
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
                    <div className="flex items-start">
                      <div className="bg-yellow-900/30 p-2 rounded-md mr-3">
                        <FontAwesomeIcon
                          icon={faMedkit}
                          className="text-yellow-500"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {t("help.chat.requestItem")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-900/30 p-2 rounded-md mr-3">
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          className="text-green-500"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{t("help.chat.vote")}</p>
                      </div>
                    </div>
                  </div>
                </Accordion>

                {/* EXP Kazanma Accordion */}
                <Accordion title={t("help.exp.title")} icon={faCampground}>
                  <p className="mb-3">{t("help.exp.description")}</p>
                  <ul className="space-y-1 list-disc list-inside pl-2">
                    <li>{t("help.exp.zombie")}</li>
                    <li>{t("help.exp.camp")}</li>
                    <li>{t("help.exp.vote")}</li>
                    <li>{t("help.exp.sos")}</li>
                    <li>{t("help.exp.requestItem")}</li>
                  </ul>
                </Accordion>

                {/* İpuçları Accordion */}
                <Accordion title={t("help.tips.title")} icon={faInfoCircle}>
                  <ul className="space-y-2 list-disc list-inside pl-2">
                    <li>{t("help.tips.emergencyMessages")}</li>
                    <li>{t("help.tips.campApproval")}</li>
                    <li>{t("help.tips.citySelection")}</li>
                    <li>{t("help.tips.safeCamps")}</li>
                  </ul>
                </Accordion>
              </div>

              {/* Desktop için tam içerik */}
              <div className="hidden md:block space-y-6">
                {/* Desktop içeriği aynı şekilde kalabilir */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Harita Kullanımı */}
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                    <h3 className="text-lg font-bold mb-3 flex items-center">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="text-blue-400 mr-2"
                      />
                      {t("help.mapUsage.title")}
                    </h3>
                    <p className="mb-3">{t("help.mapUsage.description")}</p>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 bg-gray-700/30 rounded-md">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="text-red-500 mr-2"
                        />
                        <p>{t("help.markers.zombie")}</p>
                      </div>
                      <div className="flex items-center p-2 bg-gray-700/30 rounded-md">
                        <FontAwesomeIcon
                          icon={faCampground}
                          className="text-green-500 mr-2"
                        />
                        <p>{t("help.markers.camp")}</p>
                      </div>
                      <div className="flex items-center p-2 bg-gray-700/30 rounded-md">
                        <FontAwesomeIcon
                          icon={faWalking}
                          className="text-purple-500 mr-2"
                        />
                        <p>{t("help.markers.traffic")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sohbet Sistemi */}
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                    <h3 className="text-lg font-bold mb-3 flex items-center">
                      <FontAwesomeIcon
                        icon={faComment}
                        className="text-blue-400 mr-2"
                      />
                      {t("help.chat.title")}
                    </h3>
                    <p className="mb-3">{t("help.chat.description")}</p>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 bg-gray-700/30 rounded-md">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="text-red-500 mr-2"
                        />
                        <p>{t("help.chat.sos")}</p>
                      </div>
                      <div className="flex items-center p-2 bg-gray-700/30 rounded-md">
                        <FontAwesomeIcon
                          icon={faMedkit}
                          className="text-yellow-500 mr-2"
                        />
                        <p>{t("help.chat.requestItem")}</p>
                      </div>
                      <div className="flex items-center p-2 bg-gray-700/30 rounded-md">
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          className="text-green-500 mr-2"
                        />
                        <p>{t("help.chat.vote")}</p>
                      </div>
                    </div>
                  </div>

                  {/* EXP Kazanma */}
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                    <h3 className="text-lg font-bold mb-3 flex items-center">
                      <FontAwesomeIcon
                        icon={faCampground}
                        className="text-blue-400 mr-2"
                      />
                      {t("help.exp.title")}
                    </h3>
                    <p className="mb-3">{t("help.exp.description")}</p>
                    <ul className="space-y-1 list-disc list-inside pl-2">
                      <li>{t("help.exp.zombie")}</li>
                      <li>{t("help.exp.camp")}</li>
                      <li>{t("help.exp.vote")}</li>
                      <li>{t("help.exp.sos")}</li>
                      <li>{t("help.exp.requestItem")}</li>
                    </ul>
                  </div>

                  {/* İpuçları */}
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                    <h3 className="text-lg font-bold mb-3 flex items-center">
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="text-blue-400 mr-2"
                      />
                      {t("help.tips.title")}
                    </h3>
                    <ul className="space-y-2 list-disc list-inside pl-2">
                      <li>{t("help.tips.emergencyMessages")}</li>
                      <li>{t("help.tips.campApproval")}</li>
                      <li>{t("help.tips.citySelection")}</li>
                      <li>{t("help.tips.safeCamps")}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-400 mt-6 p-3 bg-gray-800/30 rounded-lg">
                <p>{t("help.disclaimer")}</p>
              </div>

              <div className="flex justify-center mt-5">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
                >
                  {t("help.understood")}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
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

export default HelpModal;
