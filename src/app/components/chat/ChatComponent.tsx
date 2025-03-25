"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGameState } from "@/app/context/GameStateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faThumbsUp,
  faMedkit,
  faVial,
  faPills,
  faAppleAlt,
  faPaperPlane,
  faNetworkWired,
  faTimes,
  faExclamation,
  faRadio,
} from "@fortawesome/free-solid-svg-icons";
import { ItemType, ChatMessage } from "@/app/types";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/app/i18n";

const ChatComponent: React.FC = () => {
  const {
    chatMessages,
    gameState,
    addChatMessage,
    changeRoom,
    voteForCamp,
    sendSOS,
    requestItem,
  } = useGameState();

  const [message, setMessage] = useState("");
  const [isRequestingItem, setIsRequestingItem] = useState(false);
  const [isSosDialogOpen, setIsSosDialogOpen] = useState(false);
  const [sosMessage, setSosMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sosInputRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useI18n();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("Chat scrolled to bottom");
  }, [chatMessages]);

  // When SOS dialog opens, focus on the textarea
  useEffect(() => {
    if (isSosDialogOpen && sosInputRef.current) {
      sosInputRef.current.focus();
    }
  }, [isSosDialogOpen]);

  // Filter messages for current room
  const roomMessages = chatMessages.filter(
    (msg) => msg.room === gameState.currentRoom
  );

  // Sort messages: emergency first, then by timestamp
  const sortedMessages = [...roomMessages].sort((a, b) => {
    if (a.type === "emergency" && b.type !== "emergency") return -1;
    if (a.type !== "emergency" && b.type === "emergency") return 1;
    return a.timestamp - b.timestamp;
  });

  // İtem istek dropdown kapanması için dışarı tıklamayı izle
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isRequestingItem && e.target instanceof HTMLElement) {
        const itemRequestContainer = document.getElementById(
          "item-request-container"
        );
        if (itemRequestContainer && !itemRequestContainer.contains(e.target)) {
          setIsRequestingItem(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isRequestingItem]);

  // Handle message submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addChatMessage({
      room: gameState.currentRoom,
      content: message,
      type: "normal",
    });

    setMessage("");
    console.log("Normal chat message sent:", message);
  };

  // SOS dialog yerine prompt kullanımını kaldırıp, dialog açma işlemi
  const handleSOS = () => {
    setIsSosDialogOpen(true);
    setSosMessage("");
    console.log("SOS dialog opened");
  };

  // SOS mesajını gönderme
  const handleSosSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (sosMessage.trim()) {
      sendSOS(sosMessage.trim());
      setIsSosDialogOpen(false);
      setSosMessage("");
      console.log("SOS message sent:", sosMessage);
    }
  };

  // Handle item request
  const handleItemRequest = (itemType: ItemType) => {
    requestItem(itemType);
    setIsRequestingItem(false);
    console.log("Item requested:", itemType);
  };

  // Esc tuşuyla diyaloğu kapatma
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSosDialogOpen) {
        setIsSosDialogOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isSosDialogOpen]);

  // Render message with highlight for emergency messages
  const renderMessage = (msg: ChatMessage) => {
    const isEmergency = msg.type === "emergency";
    const isItemRequest = msg.type === "itemRequest";
    const isCampProposal = msg.type === "campProposal";

    return (
      <div
        key={msg.id}
        className={`p-3 rounded-lg mb-2 ${
          isEmergency
            ? "bg-red-900/30 border border-red-700/30"
            : isItemRequest
            ? "bg-yellow-900/20 border border-yellow-700/30"
            : isCampProposal
            ? "bg-green-900/20 border border-green-700/30"
            : "bg-gray-800/50 border border-gray-700/30"
        }`}
      >
        <div className="flex justify-between items-start">
          <span className="text-xs text-gray-400">
            {msg.sender || "Survivor"}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </span>
        </div>

        <div
          className={`mt-1 ${isEmergency ? "text-red-200" : "text-gray-200"}`}
        >
          {isEmergency && (
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-red-500 mr-2"
            />
          )}
          {isItemRequest && (
            <FontAwesomeIcon icon={faMedkit} className="text-yellow-500 mr-2" />
          )}
          {isCampProposal && (
            <FontAwesomeIcon
              icon={faThumbsUp}
              className="text-green-500 mr-2"
            />
          )}
          {msg.content}
        </div>

        {isCampProposal && (
          <div className="mt-2 flex justify-end">
            <button
              className="bg-green-800/30 text-green-400 text-xs px-2 py-1 rounded flex items-center hover:bg-green-700/30 border border-green-700/30"
              onClick={() => voteForCamp(msg.id)}
            >
              <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
              {t("chat.vote")} ({msg.votes || 0})
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="bg-gray-800/80 backdrop-blur-sm p-3 border-b border-gray-700/50 flex justify-between items-center">
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={faNetworkWired}
            className="text-blue-400 mr-2 animate-pulse-slow"
          />
          <div>
            <h3 className="font-bold text-white">{t("chat.title")}</h3>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
              <span className="text-xs text-gray-400">
                {gameState.currentRoom}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Room selector */}
          <select
            className="bg-gray-700/80 text-sm text-white px-2 py-1.5 rounded border border-gray-600/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            value={gameState.currentRoom}
            onChange={(e) => {
              changeRoom(e.target.value);
            }}
          >
            <option value="Istanbul">{t("chat.cities.istanbul")}</option>
            <option value="Ankara">{t("chat.cities.ankara")}</option>
            <option value="Izmir">{t("chat.cities.izmir")}</option>
            <option value="Antalya">{t("chat.cities.antalya")}</option>
            <option value="Bursa">{t("chat.cities.bursa")}</option>
          </select>

          {/* SOS Button */}
          <button
            className="bg-red-700/80 hover:bg-red-600 text-white text-sm px-2 py-1.5 rounded flex items-center border border-red-600/50"
            onClick={handleSOS}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
            SOS
          </button>
        </div>
      </div>

      {/* SOS Dialog - Sayfa ortasında daha iyi hizalanmış */}
      <AnimatePresence>
        {isSosDialogOpen && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setIsSosDialogOpen(false)}
            />

            {/* SOS Dialog - Ortada ve responsive */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="fixed left-0 right-0 top-1/2 transform -translate-y-1/2 mx-auto w-[min(90%,450px)] max-w-full z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gray-900/90 backdrop-blur-xl p-4 md:p-5 rounded-lg border border-red-700/30 shadow-xl shadow-red-900/20">
                <div className="absolute -top-5 md:-top-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faExclamation} size="lg" />
                </div>

                <button
                  onClick={() => setIsSosDialogOpen(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>

                <form onSubmit={handleSosSubmit} className="mt-2">
                  <h3 className="text-lg font-bold text-center text-red-500 mb-1 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="mr-2"
                    />
                    {t("sos.title")}
                  </h3>
                  <div className="text-xs text-gray-400 text-center mb-3">
                    {t("sos.description")}
                  </div>

                  <div className="flex items-center mb-3 bg-red-900/10 p-2 rounded-lg border border-red-700/20">
                    <FontAwesomeIcon
                      icon={faRadio}
                      className="text-red-400 mr-2"
                    />
                    <div className="text-xs text-red-300">
                      {t("sos.broadcastWarning")}
                    </div>
                  </div>

                  <textarea
                    ref={sosInputRef}
                    value={sosMessage}
                    onChange={(e) => setSosMessage(e.target.value)}
                    className="w-full bg-gray-800/70 border border-red-700/30 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm mb-4 min-h-[80px]"
                    placeholder={t("sos.messagePlaceholder")}
                  ></textarea>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setIsSosDialogOpen(false)}
                      className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 text-sm"
                    >
                      {t("common.cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={!sosMessage.trim()}
                      className={`px-3 py-1.5 ${
                        sosMessage.trim()
                          ? "bg-red-700 hover:bg-red-600"
                          : "bg-red-900/50 cursor-not-allowed"
                      } text-white rounded-md text-sm flex items-center`}
                    >
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="mr-2"
                      />
                      {t("sos.send")}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Messages container */}
      <div className="flex-grow overflow-y-auto p-3 chat-scrollbar bg-gray-900/50">
        {sortedMessages.length > 0 ? (
          <div className="space-y-3">
            {sortedMessages.map(renderMessage)}
            <div ref={messagesEndRef} /> {/* Auto-scroll referansı */}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 my-8 p-6 glass-panel max-w-sm">
              <FontAwesomeIcon
                icon={faNetworkWired}
                className="text-3xl mb-3 text-gray-600"
              />
              <p>{t("chat.noMessages")}</p>
              <p className="text-xs mt-2">{t("chat.startConversation")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="border-t border-gray-800/50 p-3 bg-gray-800/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-grow bg-gray-700/50 text-white px-4 py-2 rounded-md border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder={t("chat.sendMessage")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="relative">
            {/* Item request dropdown toggle */}
            <button
              type="button"
              className={`p-2 rounded-md ${
                isRequestingItem
                  ? "bg-yellow-600/50 border border-yellow-500/50"
                  : "bg-gray-700/50 border border-gray-600/50 hover:bg-gray-600/50"
              }`}
              onClick={() => setIsRequestingItem(!isRequestingItem)}
              title={t("chat.requestItem")}
            >
              <FontAwesomeIcon icon={faMedkit} />
            </button>

            {/* Item request dropdown */}
            <AnimatePresence>
              {isRequestingItem && (
                <motion.div
                  id="item-request-container"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full right-0 mb-2 w-64 glass-panel p-3 rounded-md border border-gray-700/50 z-10"
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-300">
                      {t("items.request")}
                    </p>
                    <button
                      type="button"
                      className="text-gray-500 hover:text-white text-xs"
                      onClick={() => setIsRequestingItem(false)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {["medkit", "serum", "painkiller", "food"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="p-2 text-sm rounded-md hover:bg-gray-700/50 border border-gray-700/30 flex items-center justify-between transition-colors"
                        onClick={() => handleItemRequest(item as ItemType)}
                      >
                        <span className="flex items-center">
                          <FontAwesomeIcon
                            icon={
                              item === "medkit"
                                ? faMedkit
                                : item === "serum"
                                ? faVial
                                : item === "painkiller"
                                ? faPills
                                : faAppleAlt
                            }
                            className={
                              item === "medkit"
                                ? "text-red-400"
                                : item === "serum"
                                ? "text-blue-400"
                                : item === "painkiller"
                                ? "text-purple-400"
                                : "text-green-400"
                            }
                          />
                          {t(`items.${item}`)}
                        </span>
                        <span className="text-xs bg-gray-800/80 px-1.5 py-0.5 rounded-full">
                          {gameState.inventory[item] || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Send button */}
          <button
            type="submit"
            className={`p-2 rounded-md ${
              message.trim()
                ? "bg-blue-600/80 border border-blue-500/50 hover:bg-blue-500"
                : "bg-gray-700/50 border border-gray-600/50 opacity-50 cursor-not-allowed"
            }`}
            disabled={!message.trim()}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
