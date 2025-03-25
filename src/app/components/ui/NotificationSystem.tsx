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
  const { gameState } = useGameState();
  const { t } = useI18n();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {/* Notifications will be rendered here */}
    </div>
  );
};

export default NotificationSystem;
