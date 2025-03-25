"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { GameStateProvider } from "./context/GameStateContext";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import ChatComponent from "./components/chat/ChatComponent";
import HelpModal from "./components/ui/HelpModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faComments,
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import InfectionMeter from "./components/ui/InfectionMeter";
import ZombieRadar from "./components/ui/ZombieRadar";
import ChemicalHazardMeter from "./components/ui/ChemicalHazardMeter";
import { useI18n } from "./i18n";
import HUDPanel from "./components/ui/HUDPanel";
import MobileMenu from "@/app/components/ui/MobileMenu";

export default function Home() {
  // Client-side rendering için
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useI18n();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("map");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Harita bileşenini istemci tarafında dinamik olarak yüklüyoruz
  // Böylece SSR sırasında Leaflet hatalarını önlüyoruz
  const MapComponentWithNoSSR = dynamic(
    () => import("./components/map/MapComponent"),
    {
      ssr: false,
      loading: () => (
        <div className="flex items-center justify-center h-full bg-black/30 backdrop-blur-sm">
          <div className="text-center">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-4xl text-[#00b4d8] mb-3 animate-pulse-glow"
            />
            <p className="text-gray-300">{t("common.loading")}</p>
          </div>
        </div>
      ),
    }
  );

  useEffect(() => {
    setIsMounted(true);
    console.log("Component mounted on client-side");
  }, []);

  // Ekran genişliğini izle
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobil ekranda varsayılan kapalı chat
  useEffect(() => {
    if (windowWidth < 768) {
      setIsChatOpen(false);
    } else {
      // Masaüstü varsayılanı
      setIsChatOpen(true);
    }
  }, [windowWidth]);

  // Yardım modalını aç/kapat
  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen);
    if (process.env.NODE_ENV === "development") {
      console.log(`Help modal ${!isHelpOpen ? "opened" : "closed"}`);
    }
  };

  // Envanteri aç/kapat
  const toggleInventory = () => {
    setIsInventoryOpen(!isInventoryOpen);
    if (process.env.NODE_ENV === "development") {
      console.log(`Inventory ${!isInventoryOpen ? "opened" : "closed"}`);
    }
  };

  // Chat durumunu aç/kapat
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (process.env.NODE_ENV === "development") {
      console.log(`Chat ${!isChatOpen ? "opened" : "closed"}`);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-6xl text-[#00b4d8] mb-4 animate-pulse-glow"
            />
            <h2 className="text-2xl font-bold text-[#00b4d8]">
              {t("app.title")}
            </h2>
            <p className="text-gray-400 mt-2">{t("common.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GameStateProvider>
      <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
        <Header
          toggleInventory={toggleInventory}
          isInventoryOpen={isInventoryOpen}
        />

        <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* Harita alanı - dinamik genişlik ve koşullu görünürlük */}
          <div
            className={`relative ${
              windowWidth < 768 ? "h-[calc(100vh-8rem)]" : "h-auto flex-1"
            } 
            ${isChatOpen && windowWidth < 768 ? "hidden" : "block"}`}
          >
            {isMounted ? <MapComponentWithNoSSR /> : null}
          </div>

          {/* Chat Aç/Kapat Butonu - Sadece Desktop */}
          {windowWidth >= 768 && (
            <button
              onClick={toggleChat}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30 bg-gray-800 text-white p-2 rounded-l-md border-l border-t border-b border-gray-700 shadow-md transition-all duration-200 hover:bg-gray-700 flex items-center justify-center"
              style={{ right: isChatOpen ? "30%" : "0" }}
              aria-label={isChatOpen ? t("chat.hide") : t("chat.show")}
            >
              <FontAwesomeIcon icon={isChatOpen ? faAngleRight : faAngleLeft} />
            </button>
          )}

          {/* Chat Paneli */}
          {isChatOpen && (
            <div
              className={`${
                windowWidth < 768 ? "absolute inset-0 z-30" : "w-[30%]"
              } 
              h-[calc(100vh-8rem)] md:h-auto overflow-hidden border-l border-gray-800 bg-gray-900`}
            >
              <ChatComponent />
            </div>
          )}
        </main>

        <Footer />

        {/* Mobil Menü */}
        <MobileMenu
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          toggleChat={toggleChat}
          isChatOpen={isChatOpen}
          toggleInventory={toggleInventory}
          toggleHelp={toggleHelp}
        />

        {/* HUD Panelleri */}
        <HUDPanel />

        {/* Mobil uyumlu Yardım Modalı */}
        <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </div>
    </GameStateProvider>
  );
}
