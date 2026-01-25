
import { FirebaseShareTracker } from '../../runtime/infra/share/FirebaseShareTracker';
import { ShareUtils } from '../../runtime/infra/share/ShareUtils';
import { TextResources } from '../../runtime/adapters/TextResources';
class EditorShareService {
    constructor(editorManager) {
        this.manager = editorManager;
        this.shareTracker = this.createShareTracker();
    }

    get text() {
        return TextResources;
    }

    t(key, fallback = '') {
        const resource = this.text;
        const value = resource?.get?.(key, fallback);
        if (value) return value;
        if (fallback) return fallback;
        return key || '';
    }

    async buildShareUrl() {
        if (!ShareUtils?.buildShareUrl) {
            alert(this.t('alerts.share.unavailable'));
            return null;
        }
        const gameData = this.manager.gameEngine.exportGameData();
        const url = ShareUtils.buildShareUrl(gameData);
        try {
            globalThis.history?.replaceState?.(null, '', url);
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

            void this.trackShareUrl(url);
        } catch (error) {
            console.error(error);
            alert(this.t('alerts.share.generateError'));
        }
    }

    createShareTracker() {
        if (FirebaseShareTracker.fromGlobal) {
            return FirebaseShareTracker.fromGlobal();
        }
        const config = globalThis.TinyRPGFirebaseConfig ?? null;
        const collection = globalThis.TinyRPGFirebaseCollection ?? null;
        if (!config) return null;
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

export { EditorShareService };
