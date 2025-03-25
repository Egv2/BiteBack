"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  GameState,
  Marker,
  ChatMessage,
  City,
  ChemicalZone,
  ChemicalType,
  GameNotification,
  Rank,
} from "../types";
import {
  initialMarkers,
  initialChatMessages,
  initialInventory,
  initialExp,
  defaultCity,
  defaultSurvivorId,
  generateSurvivorId,
  expValues,
  cities,
} from "../data/mockData";
import { v4 as uuidv4 } from "uuid";
import { useI18n } from "@/app/i18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

interface GameStateContextProps {
  gameState: GameState;
  markers: Marker[];
  chatMessages: ChatMessage[];
  currentCity: City;
  cities: City[];
  addMarker: (marker: Omit<Marker, "id" | "createdAt">) => string;
  addChatMessage: (
    message: Omit<ChatMessage, "id" | "timestamp" | "sender">
  ) => string;
  voteForCamp: (campId: string) => void;
  requestItem: (itemType: string) => void;
  sendSOS: (content: string) => void;
  changeRoom: (roomName: string) => void;
  changeCity: (city: City) => void;
  toggleSafeCampsOnly: () => void;
  safeCampsOnly: boolean;
  updateExp: (amount: number) => void;
  chemicalZones: ChemicalZone[];
  addChemicalZone: (zone: Omit<ChemicalZone, "id" | "createdAt">) => string;
  clearChemicalZone: (zoneId: string) => void;
  notifications: GameNotification[];
  addNotification: (
    notification: Omit<GameNotification, "id" | "createdAt">
  ) => string;
  clearNotification: (id: string) => void;
}

const GameStateContext = createContext<GameStateContextProps | undefined>(
  undefined
);

const calculateRank = (exp: number): Rank => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Calculating rank for XP: ${exp}`);
  }

  if (exp >= 1001) return "elite";
  if (exp >= 601) return "defender";
  if (exp >= 301) return "ranger";
  if (exp >= 101) return "survivor";
  return "novice";
};

export const GameStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { t } = useI18n();

  const [gameState, setGameState] = useState<GameState>({
    exp: initialExp,
    inventory: initialInventory,
    currentRoom: defaultCity.name,
    playerId: defaultSurvivorId,
    currentCity: defaultCity,
    rank: calculateRank(initialExp),
  });

  const [markers, setMarkers] = useState<Marker[]>(initialMarkers);
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(initialChatMessages);
  const [currentCity, setCurrentCity] = useState<City>(defaultCity);
  const [safeCampsOnly, setSafeCampsOnly] = useState<boolean>(false);
  const [chemicalZones, setChemicalZones] = useState<ChemicalZone[]>([]);
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("GameState updated:", gameState);
      console.log("Markers updated:", markers);
      console.log("Chat messages updated:", chatMessages);
    }
  }, [gameState, markers, chatMessages]);

  useEffect(() => {
    const newRank = calculateRank(gameState.exp);
    if (newRank !== gameState.rank) {
      if (process.env.NODE_ENV === "development") {
        console.log(`Rank changed from ${gameState.rank} to ${newRank}`);
      }
      setGameState((prev) => ({ ...prev, rank: newRank }));
    }
  }, [gameState.exp, gameState.rank]);

  const addMarker = (marker: Omit<Marker, "id" | "createdAt">): string => {
    const newMarkerId = uuidv4();
    const newMarker: Marker = {
      ...marker,
      id: newMarkerId,
      createdAt: Date.now(),
    };

    setMarkers((prev) => [...prev, newMarker]);

    if (marker.type === "zombie") {
      updateExp(expValues.addZombie);
      console.log(`Added zombie marker, earned ${expValues.addZombie} EXP`);
    } else if (marker.type === "camp") {
      updateExp(expValues.proposeCamp);
      console.log(`Proposed camp, earned ${expValues.proposeCamp} EXP`);

      const campMessage: Omit<ChatMessage, "id" | "timestamp" | "sender"> = {
        room: currentCity.name,
        content: `Safe camp proposed at [${marker.position[0].toFixed(
          4
        )}, ${marker.position[1].toFixed(4)}]. Vote now!`,
        type: "camp",
        votes: 0,
        maxVotes: 10,
        position: marker.position,
        campId: newMarkerId,
      };

      addChatMessage(campMessage);
    }

    return newMarkerId;
  };

  const addChatMessage = (
    message: Omit<ChatMessage, "id" | "timestamp" | "sender">
  ): string => {
    const newMessageId = uuidv4();
    const newMessage: ChatMessage = {
      ...message,
      id: newMessageId,
      timestamp: Date.now(),
      sender: gameState.playerId,
    };

    setChatMessages((prev: ChatMessage[]) => [...prev, newMessage]);
    console.log("Added new chat message:", newMessage);

    return newMessageId;
  };

  const voteForCamp = (campId: string) => {
    setMarkers((prev) =>
      prev.map((marker) => {
        if (marker.id === campId && marker.type === "camp") {
          const newVotes = (marker.votes || 0) + 1;
          const approved = newVotes >= (marker.maxVotes || 10) * 0.7;

          console.log(
            `Voted for camp ${campId}, new votes: ${newVotes}, approved: ${approved}`
          );

          return {
            ...marker,
            votes: newVotes,
            approved,
          };
        }
        return marker;
      })
    );

    setChatMessages((prev: ChatMessage[]) =>
      prev.map((msg: ChatMessage) => {
        if (msg.campId === campId) {
          const newVotes = (msg.votes || 0) + 1;
          return {
            ...msg,
            votes: newVotes,
          };
        }
        return msg;
      })
    );

    updateExp(expValues.vote);
    console.log(`Voted for camp, earned ${expValues.vote} EXP`);
  };

  const requestItem = (itemType: string) => {
    const message: Omit<ChatMessage, "id" | "timestamp" | "sender"> = {
      room: gameState.currentRoom,
      content: `!need ${itemType} Can anyone spare this?`,
      type: "request",
    };

    addChatMessage(message);
    updateExp(expValues.requestItem);
    console.log(
      `Requested item ${itemType}, earned ${expValues.requestItem} EXP`
    );
  };

  const sendSOS = (content: string) => {
    const message: Omit<ChatMessage, "id" | "timestamp" | "sender"> = {
      room: gameState.currentRoom,
      content: `!help ${content}`,
      type: "emergency",
    };

    addChatMessage(message);
    updateExp(expValues.sosCall);
    console.log(`Sent SOS message, earned ${expValues.sosCall} EXP`);
  };

  const showNotification = (
    notification: Omit<GameNotification, "id" | "createdAt">
  ) => {
    addNotification(notification);
  };

  const updateExp = (amount: number) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`Updating EXP by ${amount}, current: ${gameState.exp}`);
    }

    const oldExp = gameState.exp;
    const newExp = Math.max(0, oldExp + amount);
    const oldRank = calculateRank(oldExp);
    const newRank = calculateRank(newExp);

    setGameState((prev) => ({ ...prev, exp: newExp }));

    if (newRank !== oldRank && amount > 0) {
      showNotification({
        title: t("notifications.levelUp"),
        message: t("notifications.rankChanged", {
          rank: t(`ranks.${newRank}`),
        }),
        type: "success",
        duration: 5000,
      });
    }
  };

  const changeRoom = (roomName: string) => {
    setGameState((prev) => ({
      ...prev,
      currentRoom: roomName,
    }));
    console.log(`Changed room to ${roomName}`);
  };

  const changeCity = (city: City) => {
    setCurrentCity(city);
    changeRoom(city.name);
    console.log(
      `Changed city to ${city.name} at [${city.position[0]}, ${city.position[1]}]`
    );
  };

  const toggleSafeCampsOnly = () => {
    setSafeCampsOnly((prev) => !prev);
    console.log(`Toggled safe camps only view: ${!safeCampsOnly}`);
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    console.log("Setting up random zombie spawner");

    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        const lat = currentCity.position[0] + (Math.random() - 0.5) * 0.05;
        const lng = currentCity.position[1] + (Math.random() - 0.5) * 0.05;

        const randomZombie: Omit<Marker, "id" | "createdAt"> = {
          type: "zombie",
          position: [lat, lng],
          details: `Rastgele zombi sürüsü ${new Date().toLocaleTimeString()} saatinde görüldü!`,
        };

        addMarker(randomZombie);
        console.log("Random zombie spawned:", randomZombie);
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      console.log("Zombie spawner cleanup");
    };
  }, [currentCity]);

  const addChemicalZone = (
    zone: Omit<ChemicalZone, "id" | "createdAt">
  ): string => {
    const newZoneId = uuidv4();
    const newZone: ChemicalZone = {
      ...zone,
      id: newZoneId,
      createdAt: Date.now(),
    };

    setChemicalZones((prev) => [...prev, newZone]);
    console.log(
      `Added chemical zone: ${getChemicalName(zone.type)} at [${
        zone.position[0]
      }, ${zone.position[1]}]`
    );

    addNotification({
      type: "warning",
      title: t("notifications.chemicalDetected"),
      message: `${getChemicalName(zone.type)} - ${t("chemicals.warning")}`,
      duration: 5000,
    });

    return newZoneId;
  };

  const clearChemicalZone = (zoneId: string) => {
    setChemicalZones((prev) => prev.filter((zone) => zone.id !== zoneId));
    console.log(`Cleared chemical zone: ${zoneId}`);
  };

  const getChemicalName = (type: ChemicalType): string => {
    switch (type) {
      case "tearGas":
        return "Biber Gazı";
      case "toxin":
        return "Toksin";
      case "smokeScreen":
        return "Duman Perdesi";
      case "radiation":
        return "Radyasyon";
      default:
        return "Kimyasal";
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setChemicalZones((prev) => prev.filter((zone) => zone.expiresAt > now));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const addNotification = (
    notification: Omit<GameNotification, "id" | "createdAt">
  ): string => {
    const id = uuidv4();
    const newNotification: GameNotification = {
      ...notification,
      id,
      createdAt: Date.now(),
    };

    setNotifications((prev) => [...prev, newNotification]);

    if (process.env.NODE_ENV === "development") {
      console.log(`Notification added: ${newNotification.title}`);
    }

    return id;
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setNotifications((prev) =>
        prev.filter((n) => now - n.createdAt < n.duration)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <GameStateContext.Provider
      value={{
        gameState,
        markers,
        chatMessages,
        currentCity,
        cities,
        addMarker,
        addChatMessage,
        voteForCamp,
        requestItem,
        sendSOS,
        changeRoom,
        changeCity,
        toggleSafeCampsOnly,
        safeCampsOnly,
        updateExp,
        chemicalZones,
        addChemicalZone,
        clearChemicalZone,
        notifications,
        addNotification,
        clearNotification,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};
