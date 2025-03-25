"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "leaflet/dist/leaflet.css";
import { I18nProvider } from "./i18n";
import { ThemeProvider } from "./context/ThemeContext";
import { GameStateProvider } from "./context/GameStateContext";
import NotificationSystem from "./components/ui/NotificationSystem";
import Head from "next/head";

// Font Awesome CSS'yi manuel olarak yüklemesini önlüyoruz
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

// metadata burada dışa aktarılamaz çünkü "use client" direktifi kullanılmış
// yerine Head bileşeni içinde title ve meta tanımları yapılacak

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>BiteBack - Survival Coordination Game</title>
        <meta
          name="description"
          content="Simulation game for survival coordination in a zombie outbreak"
        />
      </head>
      <body className={inter.className}>
        <I18nProvider>
          <ThemeProvider>
            <GameStateProvider>
              {children}
              <NotificationSystem />
            </GameStateProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
