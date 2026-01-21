class EditorShareService {
    constructor(editorManager) {
        this.manager = editorManager;
        this.shareTracker = this.createShareTracker();
    }

    get text() {
        return typeof TextResources !== 'undefined' ? TextResources : null;
    }

    t(key, fallback = '') {
        const resource = this.text;
        const value = resource?.get?.(key, fallback);
        if (value) return value;
        if (fallback) return fallback;
        return key || '';
    }

    async buildShareUrl() {
        const share = window.ShareUtils
            ? window.ShareUtils
            : (typeof window !== 'undefined' ? window.TinyRPGShare : null);
        if (!share?.buildShareUrl) {
            alert(this.t('alerts.share.unavailable'));
            return null;
        }
        const gameData = this.manager.gameEngine.exportGameData();
        const url = share.buildShareUrl(gameData);
        try {
            window.history?.replaceState?.(null, '', url);
        } catch {
            /* ignore */
        }
        return url;
    }

    updateShareUrlField(url) {
        const input = this.manager?.dom?.shareUrlInput;
        if (!input) return;
        input.value = url || '';
    }

    async generateShareableUrl() {
        try {
            const url = await this.buildShareUrl();
            if (!url) return;
            this.updateShareUrlField(url);

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
                alert(this.t('alerts.share.copied'));
            } else {
                prompt(this.t('alerts.share.copyPrompt'), url);
            }

            this.trackShareUrl(url);
        } catch (error) {
            console.error(error);
            alert(this.t('alerts.share.generateError'));
        }
    }

    createShareTracker() {
        if (typeof FirebaseShareTracker === 'undefined') return null;
        if (FirebaseShareTracker.fromGlobal) {
            return FirebaseShareTracker.fromGlobal();
        }
        const config = typeof window !== 'undefined' ? window.TinyRPGFirebaseConfig : null;
        const collection = typeof window !== 'undefined' ? window.TinyRPGFirebaseCollection : null;
        return new FirebaseShareTracker(config, { collection });
    }

    async trackShareUrl(url) {
        if (!this.shareTracker?.trackShareUrl) return;
        console.info('[TinyRPG] Tracking share URL...', { url });
        const ok = await this.shareTracker.trackShareUrl(url, { source: 'editor' });
        console.info('[TinyRPG] Share URL tracking result:', ok ? 'ok' : 'failed');
    }

    saveGame() {
        const blob = new Blob(
            [JSON.stringify(this.manager.gameEngine.exportGameData(), null, 2)],
            { type: 'application/json' }
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tiny-rpg-maker.json';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    loadGameFile(ev) {
        const file = ev.target?.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                this.manager.restore(data, { skipHistory: true });
                this.manager.history.pushCurrentState();
            } catch {
                alert(this.t('alerts.share.loadError'));
            }
        };
        reader.readAsText(file);
        ev.target.value = '';
    }
}

if (typeof window !== 'undefined') {
    window.EditorShareService = EditorShareService;
}
