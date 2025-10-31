class EditorShareService {
    constructor(editorManager) {
        this.manager = editorManager;
    }

    async generateShareableUrl() {
        try {
            const share = window.ShareUtils
                ? window.ShareUtils
                : (typeof window !== 'undefined' ? window.TinyRPGShare : null);
            if (!share?.buildShareUrl) {
                alert('Funcao de compartilhar nao esta disponivel.');
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
                alert('URL do jogo copiada para a area de transferencia!');
            } else {
                prompt('Copie a URL do seu jogo:', url);
            }
        } catch (error) {
            console.error(error);
            alert('Nao foi possivel gerar a URL do jogo.');
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
                alert('Nao foi possivel carregar o arquivo.');
            }
        };
        reader.readAsText(file);
        ev.target.value = '';
    }
}

if (typeof window !== 'undefined') {
    window.EditorShareService = EditorShareService;
}
