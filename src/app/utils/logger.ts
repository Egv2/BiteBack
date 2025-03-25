/**
 * Development-only logger utility
 * Safely logs messages only in development environment
 */
export const devLog = (...args: any[]): void => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

export const devWarn = (...args: any[]): void => {
  if (process.env.NODE_ENV === "development") {
    console.warn(...args);
  }
};

export const devError = (...args: any[]): void => {
  if (process.env.NODE_ENV === "development") {
    console.error(...args);
  }
};

/**
 * Herhangi bir ortamda kullanıcıya gösterilmesi gereken kritik hatalar için
 */
export const logCriticalError = (error: any): void => {
  console.error("CRITICAL ERROR:", error);
  // Burada hata izleme sistemine de gönderebiliriz (örn. Sentry)
};

/**
 * Performans ölçümü için başlatma fonksiyonu
 */
export const startPerformanceTimer = (label: string): void => {
  if (process.env.NODE_ENV === "development") {
    console.time(label);
  }
};

/**
 * Performans ölçümü için bitirme fonksiyonu
 */
export const endPerformanceTimer = (label: string): void => {
  if (process.env.NODE_ENV === "development") {
    console.timeEnd(label);
  }
};
