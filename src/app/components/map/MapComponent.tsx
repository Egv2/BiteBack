"use client";

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L, { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGameState } from "@/app/context/GameStateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSkullCrossbones,
  faCampground,
  faCar,
  faFlask,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { City, MarkerType } from "@/app/types";
import { devLog } from "@/app/utils/logger";
import ChemicalOverlay from "./ChemicalOverlay";
import EnvironmentalPopup from "./EnvironmentalPopup";
import ReactDOMServer from "react-dom/server";

// Fix for Leaflet icons in Next.js
const fixLeafletIcons = () => {
  // This workaround is needed for Next.js and Leaflet
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

// Component to handle map center changes
const ChangeMapView = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
    console.log("Map view updated to", center, "with zoom level", zoom);
  }, [center, zoom, map]);

  return null;
};

// Custom marker icons
const createMarkerIcon = (type: MarkerType) => {
  const getColor = () => {
    switch (type) {
      case "zombie":
        return "#ff4d4d";
      case "camp":
        return "#4caf50";
      case "traffic":
        return "#9c27b0";
      case "chemical":
        return "#ffbb00";
      default:
        return "#ffffff";
    }
  };

  // Get icon for marker type
  const getIcon = () => {
    switch (type) {
      case "zombie":
        return faSkullCrossbones;
      case "camp":
        return faCampground;
      case "traffic":
        return faCar;
      case "chemical":
        return faFlask;
      default:
        return faMapMarkerAlt;
    }
  };

  // Marker görsel iyileştirmeleri
  const getIconHtml = () => {
    // Get the FontAwesome icon from React component
    const iconSvg = ReactDOMServer.renderToString(
      <FontAwesomeIcon
        icon={getIcon()}
        style={{ color: getColor() }}
        className="fa-lg"
      />
    );

    switch (type) {
      case "zombie":
        return `
          <div class="marker-icon zombie-marker">
            <div class="marker-pulse"></div>
            <div class="marker-symbol">${iconSvg}</div>
          </div>
        `;
      case "camp":
        return `
          <div class="marker-icon camp-marker">
            <div class="marker-glow"></div>
            <div class="marker-symbol">${iconSvg}</div>
          </div>
        `;
      case "traffic":
        return `
          <div class="marker-icon traffic-marker">
            <div class="marker-symbol">${iconSvg}</div>
          </div>
        `;
      case "chemical":
        return `
          <div class="marker-icon chemical-marker">
            <div class="marker-pulse"></div>
            <div class="marker-symbol">${iconSvg}</div>
          </div>
        `;
      default:
        return `<div class="marker-symbol">${iconSvg}</div>`;
    }
  };

  return new L.DivIcon({
    className: `${type}-marker-custom`,
    html: getIconHtml(),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// Map click handler component
const MapClickHandler = () => {
  const [modalPosition, setModalPosition] = useState<[number, number] | null>(
    null
  );
  const { addMarker } = useGameState();

  // Record map click position
  const map = useMapEvents({
    click(e) {
      const pos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setModalPosition(pos);
      devLog("Map clicked at:", e.latlng);
    },
  });

  if (!modalPosition) return null;

  // Render add marker modal
  return (
    <div className="absolute bottom-4 left-4 right-4 bg-gray-900 p-4 rounded-md shadow-lg border border-gray-800 z-[1000]">
      <h3 className="text-white text-lg mb-3">Konuma işaretleyici ekle:</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => {
            addMarker({
              type: "zombie",
              position: modalPosition,
              details: "Zombi görüldü",
            });
            setModalPosition(null);
          }}
        >
          <FontAwesomeIcon icon={faSkullCrossbones} className="mr-2" />
          Zombi
        </button>

        <button
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => {
            addMarker({
              type: "camp",
              position: modalPosition,
              details: "Hayatta kalan kampı",
              votes: 0,
              maxVotes: 10,
              approved: false,
            });
            setModalPosition(null);
          }}
        >
          <FontAwesomeIcon icon={faCampground} className="mr-2" />
          Kamp
        </button>

        <button
          className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => {
            addMarker({
              type: "traffic",
              position: modalPosition,
              details: "Hayatta kalan hareketi",
            });
            setModalPosition(null);
          }}
        >
          <FontAwesomeIcon icon={faCar} className="mr-2" />
          Hareket
        </button>

        <button
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md ml-auto"
          onClick={() => setModalPosition(null)}
        >
          İptal
        </button>
      </div>
    </div>
  );
};

const MapComponent: React.FC = () => {
  const {
    markers,
    currentCity,
    changeCity,
    safeCampsOnly,
    toggleSafeCampsOnly,
    cities,
  } = useGameState();
  const [clickedPosition, setClickedPosition] = useState<
    [number, number] | null
  >(null);

  // Fix Leaflet icons on component mount
  useEffect(() => {
    fixLeafletIcons();
    console.log("Leaflet icons fixed");
  }, []);

  // Filter markers based on the safeCampsOnly setting
  const filteredMarkers = safeCampsOnly
    ? markers.filter((marker) => marker.type !== "camp" || marker.approved)
    : markers;

  const handleMapClick = (e: LeafletMouseEvent) => {
    setClickedPosition([e.latlng.lat, e.latlng.lng]);
  };

  return (
    <div className="relative w-full h-full">
      {/* City selection dropdown */}
      <div className="absolute top-4 left-4 z-[1000] bg-gray-900 p-2 rounded-md shadow-lg">
        <select
          className="bg-gray-800 text-white px-3 py-2 rounded border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
          value={currentCity.name}
          onChange={(e) => {
            const selectedCity = cities.find(
              (city: City) => city.name === e.target.value
            );
            if (selectedCity) {
              changeCity(selectedCity);
              console.log("City changed to:", selectedCity.name);
            }
          }}
        >
          {cities.map((city: City) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Toggle safe camps button */}
      <div className="absolute top-4 right-4 z-[1000]">
        <button
          className={`px-3 py-2 rounded-md text-white ${
            safeCampsOnly ? "bg-green-700" : "bg-gray-700"
          }`}
          onClick={toggleSafeCampsOnly}
        >
          {safeCampsOnly ? "Sadece Güvenli Kamplar" : "Tüm Kamplar"}
        </button>
      </div>

      {/* Map container */}
      <MapContainer
        center={[currentCity.position[0], currentCity.position[1]]}
        zoom={currentCity.zoom}
        style={{ height: "100%", width: "100%" }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeMapView center={currentCity.position} zoom={currentCity.zoom} />
        <MapClickHandler />

        {/* Render all markers */}
        {filteredMarkers.map((marker) => {
          // For camp markers, show vote information in popup
          const popupContent =
            marker.type === "camp"
              ? `${marker.details || "Hayatta Kalan Kampı"} - Oylar: ${
                  marker.votes || 0
                }/${marker.maxVotes || 10}${
                  marker.approved ? " (Onaylandı)" : ""
                }`
              : marker.details ||
                (marker.type === "zombie"
                  ? "Zombi Görüldü"
                  : "Hayatta Kalan Hareketi");

          return (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={createMarkerIcon(marker.type)}
            >
              <Popup>
                <div className="text-gray-900">
                  <h3 className="font-bold">
                    {marker.type === "zombie"
                      ? "Zombi Görüldü"
                      : marker.type === "camp"
                      ? "Hayatta Kalan Kampı"
                      : "Hayatta Kalan Hareketi"}
                  </h3>
                  <p>{popupContent}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Eklenme: {new Date(marker.createdAt).toLocaleString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Kimyasal Bölgeler */}
        <ChemicalOverlay />

        {clickedPosition && (
          <EnvironmentalPopup
            position={clickedPosition}
            onClose={() => setClickedPosition(null)}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
