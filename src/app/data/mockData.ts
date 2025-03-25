import { Marker, ChatMessage, City, ItemType } from "../types";
import { v4 as uuidv4 } from "uuid";

// City data for Turkey
export const cities: City[] = [
  { name: "Istanbul", position: [41.0082, 28.9784], zoom: 10 },
  { name: "Ankara", position: [39.9334, 32.8597], zoom: 10 },
  { name: "Izmir", position: [38.4237, 27.1428], zoom: 10 },
  { name: "Antalya", position: [36.8969, 30.7133], zoom: 10 },
  { name: "Bursa", position: [40.1885, 29.061], zoom: 10 },
];

// Default city
export const defaultCity: City = cities[0];

// Initial markers on the map
export const initialMarkers: Marker[] = [
  {
    id: uuidv4(),
    type: "zombie",
    position: [41.033, 28.9773],
    details: "Large group of zombies near Taksim Square",
    createdAt: Date.now() - 3600000, // 1 hour ago
  },
  {
    id: uuidv4(),
    type: "zombie",
    position: [41.0111, 28.9684],
    details: "Two zombies spotted near Grand Bazaar",
    createdAt: Date.now() - 7200000, // 2 hours ago
  },
  {
    id: uuidv4(),
    type: "camp",
    position: [41.0418, 29.0089],
    details: "Safe zone with food and medicine",
    votes: 8,
    maxVotes: 10,
    approved: true,
    createdAt: Date.now() - 10800000, // 3 hours ago
  },
  {
    id: uuidv4(),
    type: "camp",
    position: [41.0105, 29.057],
    details: "Small camp with limited supplies",
    votes: 4,
    maxVotes: 10,
    approved: false,
    createdAt: Date.now() - 14400000, // 4 hours ago
  },
  {
    id: uuidv4(),
    type: "traffic",
    position: [41.0213, 28.9944],
    details: "Group of survivors moving east",
    createdAt: Date.now() - 1800000, // 30 minutes ago
  },
  {
    id: uuidv4(),
    type: "traffic",
    position: [40.9862, 29.0274],
    details: "Survivor caravan with supplies",
    createdAt: Date.now() - 900000, // 15 minutes ago
  },
];

// Generate a random survivor ID
export const generateSurvivorId = (): string => {
  const id = Math.floor(Math.random() * 999) + 1;
  return `Survivor${id}`;
};

// Default survivor ID
export const defaultSurvivorId = generateSurvivorId();

// Initial chat messages
export const initialChatMessages: ChatMessage[] = [
  {
    id: uuidv4(),
    room: "Istanbul",
    sender: "Survivor752",
    content: "Meet at Taksim safe zone at 5 PM. Bringing medical supplies.",
    timestamp: Date.now() - 3600000, // 1 hour ago
    type: "normal",
  },
  {
    id: uuidv4(),
    room: "Istanbul",
    sender: "Survivor224",
    content: "!help Zombies near Galata Tower! Need backup immediately!",
    timestamp: Date.now() - 2700000, // 45 minutes ago
    type: "emergency",
  },
  {
    id: uuidv4(),
    room: "Istanbul",
    sender: "Survivor118",
    content: "Safe camp proposed at Kadıköy [40.9928, 29.0250]. Vote now!",
    timestamp: Date.now() - 7200000, // 2 hours ago
    type: "camp",
    votes: 5,
    maxVotes: 10,
    position: [40.9928, 29.025],
    campId: initialMarkers[3].id,
  },
  {
    id: uuidv4(),
    room: "Istanbul",
    sender: "Survivor365",
    content: "!need medkit Found an injured survivor near Beşiktaş",
    timestamp: Date.now() - 1800000, // 30 minutes ago
    type: "request",
  },
  {
    id: uuidv4(),
    room: "Ankara",
    sender: "Survivor187",
    content: "Kızılay is overrun. Avoid central areas.",
    timestamp: Date.now() - 5400000, // 1.5 hours ago
    type: "normal",
  },
  {
    id: uuidv4(),
    room: "Ankara",
    sender: "Survivor442",
    content: "!help Large horde at Ulus! Need evacuation!",
    timestamp: Date.now() - 1200000, // 20 minutes ago
    type: "emergency",
  },
  {
    id: uuidv4(),
    room: "Izmir",
    sender: "Survivor599",
    content: "Found clean water source at Konak. Safe for now.",
    timestamp: Date.now() - 10800000, // 3 hours ago
    type: "normal",
  },
  {
    id: uuidv4(),
    room: "Izmir",
    sender: "Survivor321",
    content: "!need food Running low on supplies near Alsancak",
    timestamp: Date.now() - 4500000, // 1.25 hours ago
    type: "request",
  },
];

// Available items in the game
export const availableItems: ItemType[] = [
  "medkit",
  "serum",
  "painkiller",
  "food",
];

// Initial inventory
export const initialInventory: Record<string, number> = {
  medkit: 2,
  serum: 1,
  painkiller: 3,
  food: 5,
};

// Initial experience points
export const initialExp = 100;

// EXP values for actions
export const expValues = {
  addZombie: 20,
  proposeCamp: 30,
  vote: 10,
  sosCall: 50,
  requestItem: 10,
};
