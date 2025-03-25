import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

// Marker types for map
export type MarkerType = "zombie" | "camp" | "traffic" | "chemical";

export interface Marker {
  id: string;
  type: MarkerType;
  position: [number, number]; // [lat, lng]
  details?: string;
  votes?: number;
  maxVotes?: number;
  approved?: boolean;
  createdAt: number;
}

// Chat message types
export type MessageType =
  | "normal"
  | "emergency"
  | "request"
  | "camp"
  | "campProposal"
  | "itemRequest";

export interface ChatMessage {
  id: string;
  room: string; // City name: Istanbul, Ankara, Izmir
  sender: string; // Anonymous ID like "Survivor123"
  content: string;
  timestamp: number;
  type: MessageType;
  votes?: number;
  maxVotes?: number;
  position?: [number, number]; // Related position for camp messages
  campId?: string; // Related camp ID if applicable
}

// Rank tipi tanımı
export type Rank = "novice" | "survivor" | "ranger" | "defender" | "elite";

// Game state
export interface GameState {
  exp: number;
  inventory: Record<string, number>; // e.g., { "medkit": 2, "food": 1 }
  currentRoom: string;
  playerId: string;
  infectionRate?: number;
  lastNotificationId?: string;
  notifications?: GameNotification[];
  chemicalZones?: ChemicalZone[];
  events?: GameEvent[];
  currentCity: City;
  zombieAlertActive?: boolean;
  rank?: Rank; // Rank eklendi (opsiyonel)
}

// City data
export interface City {
  name: string;
  position: [number, number];
  zoom: number;
}

// Item types
export type ItemType = "medkit" | "serum" | "painkiller" | "food";

export interface ChemicalZone {
  id: string;
  type: ChemicalType;
  position: [number, number];
  radius: number; // km cinsinden
  intensity: number; // 0-100
  createdAt: number;
  expiresAt: number;
}

export type ChemicalType = "tearGas" | "toxin" | "smokeScreen" | "radiation";

export interface ChemicalLevel {
  tearGas: number;
  toxin: number;
  smokeScreen: number;
  radiation: number;
}

export type EventType =
  | "zombieHorde"
  | "survivorFound"
  | "contaminatedArea"
  | "suppliesDrop"
  | "radioMessage";

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  icon: IconDefinition;
  options: EventOption[];
  position: [number, number];
  timeLeft: number;
}

export interface EventOption {
  id: string;
  text: string;
  expReward: number;
  risk: number;
  action: () => void;
}

export interface GameNotification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration: number;
  createdAt: number;
}
