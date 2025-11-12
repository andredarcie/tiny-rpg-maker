class EditorShareService {
    constructor(editorManager) {
        this.manager = editorManager;
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

    async generateShareableUrl() {
        try {
            const share = window.ShareUtils
                ? window.ShareUtils
                : (typeof window !== 'undefined' ? window.TinyRPGShare : null);
            if (!share?.buildShareUrl) {
                alert(this.t('alerts.share.unavailable'));
                return;
            }
            const gameData = this.manager.gameEngine.exportGameData();
            const url = share.buildShareUrl(gameData);
            try {
                window.history?.replaceState?.(null, '', url);
            } catch {
                // ignore
            }

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
                alert(this.t('alerts.share.copied'));
            } else {
                prompt(this.t('alerts.share.copyPrompt'), url);
            }
        } catch (error) {
            console.error(error);
            alert(this.t('alerts.share.generateError'));
        }
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
