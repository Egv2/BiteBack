"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTimesCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useGameState } from "@/app/context/GameStateContext";
import { useI18n } from "@/app/i18n";
import { GameNotification } from "@/app/types";
import { AnimatePresence, motion } from "framer-motion";

const NotificationSystem: React.FC = () => {
  const { gameState, notifications, clearNotification } = useGameState();
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

  // Bildirim simgesi
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return (
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
        );
      case "error":
        return (
          <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
        );
      case "warning":
        return (
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-yellow-500"
          />
        );
      default:
        return (
          <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400" />
        );
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, x: 20 }}
            transition={{ duration: 0.2 }}
            className={`flex items-start p-3 mb-2 rounded-lg shadow-lg border text-white ${
              notification.type === "success"
                ? "bg-green-900/80 border-green-700"
                : notification.type === "error"
                ? "bg-red-900/80 border-red-700"
                : notification.type === "warning"
                ? "bg-yellow-900/80 border-yellow-700"
                : "bg-blue-900/80 border-blue-700"
            } backdrop-blur-md`}
            style={{ width: isMobile ? "calc(100vw - 32px)" : "320px" }}
          >
            <div className="flex-shrink-0 mt-0.5 mr-3">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="font-medium">{notification.title}</p>
              {notification.message && (
                <p className="text-sm text-gray-300 mt-1">
                  {notification.message}
                </p>
              )}
            </div>
            <button
              onClick={() => clearNotification(notification.id)}
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-white p-1"
              aria-label="Close notification"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;
