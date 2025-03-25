"use client";

import React from "react";
import { useI18n } from "@/app/i18n";

const Footer: React.FC = () => {
  const { t } = useI18n();
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Ekran genişliğini izle
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobil cihazlarda daha kompakt footer
  if (windowWidth < 768) {
    return (
      <footer className="z-10 text-center text-xs text-gray-400 py-2 px-4 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800">
        <p>© {new Date().getFullYear()} BiteBack</p>
      </footer>
    );
  }

  return (
    <footer className="z-10 text-center py-2 px-4 text-sm text-gray-400 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <div>{t("footer.description")}</div>
        <div className="text-xs">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
