"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import ChatComponent from "./components/chat/ChatComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Inventory from "./components/ui/Inventory";
import HelpModal from "./components/ui/HelpModal";
import SettingsModal from "./components/ui/SettingsModal";
import MobileMenu from "./components/ui/MobileMenu";
import HUDPanel from "./components/ui/HUDPanel";
import { useI18n } from "./i18n";

export default function Home() {
  // Client-side rendering için
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useI18n();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("map");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Harita bileşenini istemci tarafında dinamik olarak yüklüyoruz
  const MapComponentWithNoSSR = dynamic(
    () => import("./components/map/MapComponent"),
    {
      ssr: false,
    }
  );

  useEffect(() => {
    setIsMounted(true);
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
    if (process.env.NODE_ENV === "development") {
      console.log("Help toggle");
    }
    setIsHelpOpen(!isHelpOpen);
  };

  // Envanteri aç/kapat
  const toggleInventory = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("Inventory toggle");
    }
    setIsInventoryOpen(!isInventoryOpen);
  };

  // Chat durumunu aç/kapat
  const toggleChat = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("Chat toggle");
    }
    setIsChatOpen(!isChatOpen);
  };

  // Settings toggle fonksiyonu
  const toggleSettings = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("Settings toggle");
    }
    setIsSettingsOpen(!isSettingsOpen);
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-blue-400 text-4xl mb-4"
            />
            <p className="animate-pulse">{t("app.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden theme-container">
      <Header
        toggleInventory={toggleInventory}
        isInventoryOpen={isInventoryOpen}
        toggleHelp={toggleHelp}
        toggleSettings={toggleSettings}
      />

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Harita alanı */}
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
        toggleSettings={toggleSettings}
      />

      {/* HUD Panelleri */}
      <HUDPanel />

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
