
class FirebaseShareTracker {
    constructor(config = null, options = {}) {
        this.config = config || null;
        this.collection = options.collection || 'shareUrls';
        this.app = null;
        this.db = null;
        this.mode = null;
        this.firestoreHelpers = null;
        this.init();
    }

    static fromGlobal() {
        const config = globalThis.TinyRPGFirebaseConfig ?? null;
        const collection = globalThis.TinyRPGFirebaseCollection ?? null;
        return new FirebaseShareTracker(config, { collection });
    }

    get firebase() {
        return globalThis.firebase ?? null;
    }

    init() {
        if (this.initFromModule()) return true;
        if (!this.config) return false;
        return this.initFromCompat();
    }

    initFromModule() {
        const db = globalThis.TinyRPGFirebaseDb ?? null;
        const helpers = globalThis.TinyRPGFirebaseFirestore ?? null;
        if (!db || !helpers?.addDoc || !helpers?.collection) return false;
        this.db = db;
        this.firestoreHelpers = helpers;
        this.mode = 'modular';
        console.info('[TinyRPG] Firebase tracker initialized (modular).');
        return true;
    }

    initFromCompat() {
        const firebase = this.firebase;
        if (!firebase?.initializeApp) {
            console.warn('[TinyRPG] Firebase SDK not available.');
            return false;
        }
        try {
            this.app = firebase.apps?.length ? firebase.app() : firebase.initializeApp(this.config);
        } catch (error) {
            console.warn('[TinyRPG] Firebase init failed.', error);
            return false;
        }
        if (!firebase.firestore) {
            console.warn('[TinyRPG] Firebase Firestore not available.');
            return false;
        }
        this.db = firebase.firestore();
        this.mode = 'compat';
        console.info('[TinyRPG] Firebase tracker initialized (compat).');
        return true;
    }

    buildPayload(url, metadata = {}) {
        const serverTimestamp = this.mode === 'modular'
            ? this.firestoreHelpers?.serverTimestamp
            : this.firebase?.firestore?.FieldValue?.serverTimestamp;
        return {
            url,
            createdAt: serverTimestamp ? serverTimestamp() : new Date().toISOString(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            language: typeof navigator !== 'undefined' ? navigator.language : '',
            referrer: typeof document !== 'undefined' ? document.referrer : '',
            ...metadata
        };
    }

    async trackShareUrl(url, metadata = {}) {
        if (!url) return false;
        if (!this.db) {
            this.init();
        }
        if (!this.db) return false;
        try {
            const payload = this.buildPayload(url, metadata);
            if (this.mode === 'modular') {
                const { addDoc, collection } = this.firestoreHelpers;
                await addDoc(collection(this.db, this.collection), payload);
            } else {
                await this.db.collection(this.collection).add(payload);
            }
            console.info('[TinyRPG] Share URL tracked.', { url, collection: this.collection });
            return true;
        } catch (error) {
            console.warn('[TinyRPG] Failed to track share URL.', error);
            return false;
        }
    }
}

export { FirebaseShareTracker };
