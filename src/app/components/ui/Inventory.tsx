"use client";

import React, { useState, useEffect } from "react";
import { useGameState } from "@/app/context/GameStateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMedkit,
  faVial,
  faPills,
  faAppleAlt,
  faTimes,
  faBoxOpen,
  faBriefcaseMedical,
  faEllipsisH,
  faSearch,
  faSort,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/app/i18n";

// Custom hook for item usage
const useItemActions = () => {
  const handleItemUse = (itemType: string) => {
    console.log(`Using item: ${itemType}`);
    // Dev ortamında konsola bilgi ver
    if (process.env.NODE_ENV === "development") {
      console.log(`${itemType} kullanıldı`);
    }
  };

  return { handleItemUse };
};

interface InventoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const Inventory: React.FC<InventoryProps> = ({ isOpen, onClose }) => {
  const { gameState } = useGameState();
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "count">("name");
  const [lowSupplies, setLowSupplies] = useState<string[]>([]);
  const { handleItemUse } = useItemActions();

  // getTotalItems fonksiyonu
  const getTotalItems = (): number => {
    return Object.values(gameState.inventory).reduce(
      (total, count) => total + (count || 0),
      0
    );
  };

  // Maksimum kapasite
  const maxCapacity = 20;

  // Envanteri kategorilere ayır
  const categorizedItems = {
    medical: ["medkit", "serum", "painkiller"],
    consumable: ["food", "water"],
    protection: ["gasMask", "armor"],
  };

  // Düşük stok kontrolü
  useEffect(() => {
    const lowItems = Object.entries(gameState.inventory)
      .filter(([key, value]) => (value || 0) <= 1 && (value || 0) > 0)
      .map(([key]) => key);

    setLowSupplies(lowItems);
  }, [gameState.inventory]);

  // Ekran boyutunu izle
  const [screenSize, setScreenSize] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    const checkScreenSize = () => {
      setScreenSize(window.innerWidth < 768 ? "mobile" : "desktop");
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Inventar ikonunu animasyonla göster
  const [showPulse, setShowPulse] = useState(false);
  const prevTotal = React.useRef(getTotalItems());

  useEffect(() => {
    const currentTotal = getTotalItems();

    if (currentTotal > prevTotal.current) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 3000);
      return () => clearTimeout(timer);
    }

    prevTotal.current = currentTotal;
  }, [gameState.inventory, getTotalItems]);

  // Envanter öğelerini filtrele ve sırala
  const getFilteredItems = () => {
    let items = [...inventoryItems];

    // Arama filtreleme
    if (searchTerm) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sıralama
    items.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else {
        return (b.count || 0) - (a.count || 0);
      }
    });

    return items;
  };

  // Envanter öğelerini tanımla
  const inventoryItems = [
    {
      id: "medkit",
      name: t("inventory.medkit"),
      description: "+40 HP iyileştirme",
      icon: faMedkit,
      color: "red",
      count: gameState.inventory.medkit || 0,
      category: "medical",
    },
    {
      id: "serum",
      name: t("inventory.serum"),
      description: "Enfeksiyonu %30 azaltır",
      icon: faVial,
      color: "blue",
      count: gameState.inventory.serum || 0,
      category: "medical",
    },
    {
      id: "painkiller",
      name: t("inventory.painkiller"),
      description: "Hasar etkisini %50 azaltır",
      icon: faPills,
      color: "purple",
      count: gameState.inventory.painkiller || 0,
      category: "medical",
    },
    {
      id: "food",
      name: t("inventory.food"),
      description: "+20 enerji sağlar",
      icon: faAppleAlt,
      color: "green",
      count: gameState.inventory.food || 0,
      category: "consumable",
    },
  ];

  // Filtrelenmiş öğeleri al
  const filteredItems = getFilteredItems();

  // Stok durumu sınıfını hesapla
  const getStockClass = (count: number): string => {
    if (count === 0) return "text-red-500";
    if (count <= 1) return "text-yellow-500";
    return "text-white";
  };

  // Handle using an item
  const handleUseItem = (itemId: string, itemCount: number) => {
    if (itemCount > 0) {
      handleItemUse(itemId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="relative z-40">
      <button
        className={`px-3 py-1.5 rounded-md flex items-center bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors duration-200 ${
          lowSupplies.length > 0 ? "border-yellow-600/50" : ""
        } ${showPulse ? "animate-pulse" : ""}`}
        onClick={onClose}
        aria-label={t(isOpen ? "inventory.hide" : "inventory.show")}
      >
        <FontAwesomeIcon
          icon={faBoxOpen}
          className={`mr-2 ${
            lowSupplies.length > 0 ? "text-yellow-500" : "text-blue-400"
          }`}
        />
        <span>{t("inventory.title")}</span>
        <span className="ml-2 bg-gray-700 text-xs px-2 py-0.5 rounded-full">
          {getTotalItems()}/{maxCapacity}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-80 bg-gray-800/90 backdrop-blur-md p-3 rounded-lg border border-gray-700 shadow-lg"
          >
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-700/50">
              <h3 className="font-bold flex items-center">
                <FontAwesomeIcon
                  icon={faBriefcaseMedical}
                  className="mr-2 text-blue-400"
                />
                {t("inventory.title")}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Arama ve Sıralama */}
            <div className="flex mb-3 gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("common.search")}
                  className="w-full bg-gray-700/70 text-sm px-3 py-1 rounded-md pl-8 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-2.5 top-2 text-gray-500 text-sm"
                />
              </div>
              <button
                onClick={() => setSortBy(sortBy === "name" ? "count" : "name")}
                className="bg-gray-700/70 px-2 py-1 rounded-md text-sm text-gray-300 hover:bg-gray-600"
                title={
                  sortBy === "name"
                    ? t("inventory.sortByCount")
                    : t("inventory.sortByName")
                }
              >
                <FontAwesomeIcon icon={faSort} />
              </button>
            </div>

            {/* Düşük stok uyarısı */}
            {lowSupplies.length > 0 && (
              <div className="mb-3 p-2 bg-yellow-900/20 border border-yellow-800/30 rounded-md flex items-start">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-yellow-500 mt-0.5 mr-2"
                />
                <div className="text-sm">
                  <p className="text-yellow-400 font-medium">
                    {t("inventory.lowSupplies")}
                  </p>
                  <p className="text-xs text-gray-300">
                    {t("inventory.lowSuppliesDesc")}
                  </p>
                </div>
              </div>
            )}

            {/* Envanter Öğeleri */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 bg-gray-700/50 rounded-md flex items-center justify-between group hover:bg-gray-700/80 transition-colors border border-gray-600/30"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-md bg-${item.color}-900/30 border border-${item.color}-700/30 mr-2`}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className={`text-${item.color}-500`}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-gray-400">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-sm ${getStockClass(
                          item.count
                        )}`}
                      >
                        {item.count}
                      </span>
                      <button
                        onClick={() => handleUseItem(item.id, item.count)}
                        disabled={item.count <= 0}
                        className={`ml-2 px-${
                          screenSize === "mobile" ? "3" : "2"
                        } py-${screenSize === "mobile" ? "1" : "0.5"} text-${
                          screenSize === "mobile" ? "sm" : "xs"
                        } rounded bg-${
                          item.color
                        }-900/30 text-white border border-${
                          item.color
                        }-700/30 hover:bg-${
                          item.color
                        }-800/50 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {t("common.use")}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm
                    ? t("inventory.noSearchResults")
                    : t("inventory.empty")}
                </div>
              )}
            </div>

            {/* Mobil görünümde daha büyük kapatma butonu */}
            {screenSize === "mobile" && (
              <button
                onClick={onClose}
                className="mt-3 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm text-gray-300"
              >
                {t("common.close")}
              </button>
            )}

            {/* Envanter durumu */}
            <div className="mt-3 pt-2 border-t border-gray-700/50 flex justify-between items-center text-xs text-gray-400">
              <div>
                {t("inventory.capacity")}: {getTotalItems()}/{maxCapacity}
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faEllipsisH} className="mr-1" />
                <span>{t("inventory.more")}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
