// src/types/global.d.ts
export {}; // Convierte el archivo en un módulo

declare global {
  interface Window {
    AppleID: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          state: string;
          usePopup: boolean;
        }) => Promise<void>;
        signIn: () => void;
      };
    };
  }
}
