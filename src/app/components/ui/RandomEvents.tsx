"use client";

import React, { useState, useEffect } from "react";
import { useGameState } from "@/app/context/GameStateContext";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSkull,
  faUserInjured,
  faRadiation,
  faBiohazard,
  faBullhorn,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/app/i18n";

type EventType =
  | "zombieHorde"
  | "survivorFound"
  | "contaminatedArea"
  | "suppliesDrop"
  | "radioMessage";

interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  icon: any;
  options: {
    text: string;
    action: () => void;
    expReward?: number;
    risk?: number;
  }[];
  position?: [number, number];
  timeLeft: number;
}

const RandomEvents: React.FC = () => {
  const { gameState, addMarker, updateExp } = useGameState();
  const { t } = useI18n();
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [showEvent, setShowEvent] = useState(false);

  const generateEvent = () => {
    const eventTypes: EventType[] = [
      "zombieHorde",
      "survivorFound",
      "contaminatedArea",
      "suppliesDrop",
      "radioMessage",
    ];

    const randomType =
      eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const id = Math.random().toString(36).substring(2, 9);

    // İstanbul koordinatları etrafında rastgele bir konum üret
    const centerLat = 41.0082;
    const centerLng = 28.9784;
    const latVariance = (Math.random() - 0.5) * 0.1; // ~5km yarıçap
    const lngVariance = (Math.random() - 0.5) * 0.1;
    const position: [number, number] = [
      centerLat + latVariance,
      centerLng + lngVariance,
    ];

    // Olayı belirle
    let newEvent: GameEvent = {
      id,
      type: randomType,
      title: "",
      description: "",
      icon: faSkull,
      options: [],
      position,
      timeLeft: 120, // 2 dakika
    };

    switch (randomType) {
      case "zombieHorde":
        newEvent.title = t("events.zombieHorde.title");
        newEvent.description = t("events.zombieHorde.description");
        newEvent.icon = faSkull;
        newEvent.options = [
          {
            text: t("events.zombieHorde.options.mark"),
            action: () => {
              addMarker({
                type: "zombie",
                position: newEvent.position!,
                details: t("events.zombieHorde.details"),
              });
              updateExp(30);
              toast.success(t("events.zombieHorde.success"), {
                description: t("events.zombieHorde.successDesc", { exp: 30 }),
              });
            },
            expReward: 30,
          },
          {
            text: t("events.zombieHorde.options.approach"),
            action: () => {
              const randomSuccess = Math.random() > 0.4; // %60 başarı şansı

              if (randomSuccess) {
                addMarker({
                  type: "zombie",
                  position: newEvent.position!,
                  details: t("events.zombieHorde.detailsExamined"),
                });
                updateExp(70);
                toast.success(t("events.zombieHorde.exploreSuccess"), {
                  description: t("events.zombieHorde.exploreSuccessDesc", {
                    exp: 70,
                  }),
                });
              } else {
                updateExp(10);
                toast.error(t("events.zombieHorde.exploreFail"), {
                  description: t("events.zombieHorde.exploreFailDesc"),
                });
              }
            },
            expReward: 70,
            risk: 40,
          },
        ];
        break;

      case "survivorFound":
        newEvent.title = t("events.survivorFound.title");
        newEvent.description = t("events.survivorFound.description");
        newEvent.icon = faUserInjured;
        newEvent.options = [
          {
            text: t("events.survivorFound.options.help"),
            action: () => {
              updateExp(25);
              toast.success(t("events.survivorFound.helpSuccess"), {
                description: t("events.survivorFound.helpSuccessDesc", {
                  exp: 25,
                }),
              });
            },
            expReward: 25,
          },
          {
            text: t("events.survivorFound.options.rescue"),
            action: () => {
              const randomSuccess = Math.random() > 0.3; // %70 başarı şansı

              if (randomSuccess) {
                addMarker({
                  type: "camp",
                  position: newEvent.position!,
                  details: t("events.survivorFound.campDetails"),
                  votes: 5,
                  maxVotes: 10,
                  approved: false,
                });
                updateExp(50);
                toast.success(t("events.survivorFound.rescueSuccess"), {
                  description: t("events.survivorFound.rescueSuccessDesc", {
                    exp: 50,
                  }),
                });
              } else {
                updateExp(5);
                toast.error(t("events.survivorFound.rescueFail"), {
                  description: t("events.survivorFound.rescueFailDesc"),
                });
              }
            },
            expReward: 50,
            risk: 30,
          },
        ];
        break;

      default:
        newEvent.title = t("events.unknown.title");
        newEvent.description = t("events.unknown.description");
        newEvent.options = [
          {
            text: t("events.unknown.options.investigate"),
            action: () => {
              updateExp(15);
              toast.info(t("events.unknown.investigateSuccess"), {
                description: t("events.unknown.investigateSuccessDesc", {
                  exp: 15,
                }),
              });
            },
            expReward: 15,
          },
        ];
    }

    return newEvent;
  };

  // Rastgele olaylar oluştur
  useEffect(() => {
    const eventInterval = setInterval(() => {
      // %15 şansla yeni olay oluştur
      if (Math.random() < 0.15 && events.length < 3) {
        const newEvent = generateEvent();
        setEvents((prev) => [...prev, newEvent]);

        // Bildirim göster
        toast.warning(t("events.newEvent"), {
          description: newEvent.title,
        });

        console.log("New random event generated:", newEvent.title);
      }
    }, 60000); // Her dakika kontrol et

    return () => clearInterval(eventInterval);
  }, [events, t, generateEvent]);

  // Olay zamanlayıcısı
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setEvents((prev) =>
        prev
          .map((event) => ({
            ...event,
            timeLeft: event.timeLeft - 1,
          }))
          .filter((event) => event.timeLeft > 0)
      );
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const handleShowEvent = (event: GameEvent) => {
    setCurrentEvent(event);
    setShowEvent(true);
  };

  const handleCloseEvent = () => {
    setShowEvent(false);
    setTimeout(() => setCurrentEvent(null), 300);
  };

  const handleOption = (optionAction: () => void) => {
    optionAction();

    // Olayı listeden kaldır
    setEvents((prev) => prev.filter((e) => e.id !== currentEvent?.id));
    handleCloseEvent();
  };

  if (events.length === 0) return null;

  return (
    <>
      {/* Olay Belirteçleri */}
      <div className="fixed left-4 top-20 z-30 flex flex-col gap-2">
        {events.map((event) => (
          <button
            key={event.id}
            className="glass-panel flex items-center p-2 rounded-md border border-yellow-500/30 bg-yellow-900/40 hover:bg-yellow-800/50 transition-all group animate-pulse"
            onClick={() => handleShowEvent(event)}
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-900/60 mr-2 text-yellow-400">
              <FontAwesomeIcon icon={event.icon} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-yellow-300">
                {event.title}
              </div>
              <div className="text-xs text-gray-300 flex items-center">
                <span className="w-1 h-1 rounded-full bg-yellow-400 mr-1"></span>
                {t("events.timeLeft")}: {Math.floor(event.timeLeft / 60)}:
                {(event.timeLeft % 60).toString().padStart(2, "0")}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Olay Detay Modal */}
      <AnimatePresence>
        {showEvent && currentEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseEvent}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel w-full max-w-md p-0 overflow-hidden rounded-lg shadow-xl border border-yellow-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-900/60 to-yellow-800/40 p-4 flex items-center">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-900 mr-3 text-yellow-400">
                  <FontAwesomeIcon icon={currentEvent.icon} size="lg" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-yellow-300">
                    {currentEvent.title}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {t("events.emergencyNotification")}
                  </p>
                </div>
                <button
                  className="text-gray-400 hover:text-white p-1"
                  onClick={handleCloseEvent}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-gray-200 mb-4">{currentEvent.description}</p>

                {/* Harita Koordinatları */}
                {currentEvent.position && (
                  <div className="bg-gray-800/50 rounded p-2 mb-4 text-gray-300 text-sm flex items-center">
                    <FontAwesomeIcon
                      icon={faBullhorn}
                      className="text-yellow-500 mr-2"
                    />
                    <span>
                      {t("events.location")}:{" "}
                      {currentEvent.position[0].toFixed(4)},{" "}
                      {currentEvent.position[1].toFixed(4)}
                    </span>
                  </div>
                )}

                {/* Seçenekler */}
                <div className="space-y-2">
                  {currentEvent.options.map((option, idx) => (
                    <button
                      key={idx}
                      className="w-full p-3 rounded-md flex items-center justify-between transition-all hover:translate-y-[-2px]"
                      style={{
                        background: option.risk
                          ? "linear-gradient(to right, rgba(239, 68, 68, 0.3), rgba(30, 41, 59, 0.4))"
                          : "linear-gradient(to right, rgba(16, 185, 129, 0.3), rgba(30, 41, 59, 0.4))",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: option.risk
                          ? "rgba(239, 68, 68, 0.2)"
                          : "rgba(16, 185, 129, 0.2)",
                      }}
                      onClick={() => handleOption(option.action)}
                    >
                      <span className="text-white">{option.text}</span>
                      <div className="flex items-center">
                        {option.risk && (
                          <span className="bg-red-900/60 text-red-300 text-xs px-2 py-0.5 rounded mr-2 flex items-center">
                            <FontAwesomeIcon
                              icon={faBiohazard}
                              className="mr-1"
                            />
                            {option.risk}% {t("events.risk")}
                          </span>
                        )}
                        <span className="bg-gray-800/60 text-yellow-300 text-xs px-2 py-0.5 rounded flex items-center">
                          +{option.expReward} EXP
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Zaman */}
                <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
                  <span>
                    {t("events.messageExpire", {
                      minutes: Math.floor(currentEvent.timeLeft / 60),
                      seconds: (currentEvent.timeLeft % 60)
                        .toString()
                        .padStart(2, "0"),
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RandomEvents;
