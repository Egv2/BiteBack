"use client";

import React, { useState, useEffect } from "react";
import { CircleMarker, useMap } from "react-leaflet";
import { useGameState } from "@/app/context/GameStateContext";
import L from "leaflet";

// Salgın Yayılım Göstergesi
export const InfectionOverlay: React.FC = () => {
  const { markers } = useGameState();
  const map = useMap();
  const [heatmapLayer, setHeatmapLayer] = useState<any>(null);

  useEffect(() => {
    // Zombie işaretleyicilerine dayalı ısı haritası
    const zombieMarkers = markers.filter((m) => m.type === "zombie");

    if (zombieMarkers.length === 0) {
      if (heatmapLayer) {
        map.removeLayer(heatmapLayer);
      }
    } else {
      // ... existing code ...
    }
  }, [markers, map]);

  return <>{/* Marker overlays content */}</>;
};
