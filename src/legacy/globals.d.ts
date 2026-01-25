type TinyRpgFirebaseHelpers = {
  addDoc?: (...args: any[]) => Promise<unknown>;
  collection?: (...args: any[]) => unknown;
  serverTimestamp?: () => unknown;
};

declare global {
  interface GlobalThis {
    TEXT_BUNDLES?: Record<string, Record<string, string>>;
    __TINY_RPG_EXPORT_MODE?: boolean;
    __TINY_RPG_SHARED_CODE?: string;
    TinyRPGFirebaseConfig?: Record<string, unknown> | null;
    TinyRPGFirebaseCollection?: string | null;
    TinyRPGFirebaseApp?: unknown;
    TinyRPGFirebaseDb?: unknown;
    TinyRPGFirebaseFirestore?: TinyRpgFirebaseHelpers | null;
    firebase?: {
      initializeApp?: (...args: any[]) => unknown;
      apps?: unknown[];
      app?: () => unknown;
      firestore?: () => {
        collection: (...args: any[]) => { add: (...args: any[]) => Promise<unknown> };
        FieldValue?: { serverTimestamp?: () => unknown };
      };
    } | null;
    TinyRPGMaker?: Record<string, unknown>;
    TinyRPGShare?: Record<string, unknown>;
    TinyRPGApplication?: Record<string, unknown>;
  }
}

export {};
