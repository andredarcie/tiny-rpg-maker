declare const TEXT_BUNDLES: Record<string, Record<string, string>>;

interface GlobalThis {
  __TINY_RPG_EXPORT_MODE?: boolean;
  __TINY_RPG_SHARED_CODE?: string;
  TinyRPGFirebaseConfig?: Record<string, unknown> | null;
  TinyRPGFirebaseCollection?: string | null;
  TinyRPGFirebaseDb?: unknown;
  TinyRPGFirebaseFirestore?: unknown;
  firebase?: unknown;
}
