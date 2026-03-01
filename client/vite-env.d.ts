/// <reference types="vite/client" />

interface ImportMetaEnv {
  // ==============================
  // API Configuration
  // ==============================
  readonly VITE_API_URL: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_WS_URL: string;

  //pesapal api configuration
  readonly VITE_PESAPAL_CONSUMER_KEY: string;
  readonly VITE_PESAPAL_CONSUMER_SECRET: string;

  // ==============================
  // Firebase Configuration
  // ==============================
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_VAPID_KEY: string;

  // ==============================
  // Development Configuration
  // ==============================
  readonly VITE_NODE_ENV: "development" | "production" | "test";
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
