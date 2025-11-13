const TEXT_BUNDLES = {
    'pt-BR': {
        'app.title': 'Tiny RPG Maker',
        'tabs.game': 'Jogo',
        'tabs.editor': 'Editor',
        'sections.tiles': 'Tiles',
        'sections.world': 'Mundo',
        'sections.objects': 'Objetos',
        'sections.npcs': 'NPCs',
        'sections.enemies': 'Inimigos',
        'sections.project': 'Projeto',
        'buttons.reset': 'Reiniciar',
        'buttons.newGame': 'Novo jogo',
        'buttons.remove': 'Remover',
        'aria.reset': 'Reiniciar a partida atual',
        'aria.newGame': 'Criar um novo jogo do zero em outra aba',
        'touchControls.show': 'Exibir controles',
        'touchControls.hide': 'Ocultar controles',
        'touchControls.upLabel': 'Mover para cima',
        'touchControls.downLabel': 'Mover para baixo',
        'touchControls.leftLabel': 'Mover para a esquerda',
        'touchControls.rightLabel': 'Mover para a direita',
        'doors.variableLocked': 'Não abre com chave.',
        'doors.openedRemaining': 'Você usou uma chave para abrir a porta. Restam: {value}.',
        'doors.opened': 'Você usou uma chave para abrir a porta.',
        'doors.locked': 'Porta trancada. Precisa de uma chave.',
        'log.engineReady': 'Tiny RPG Maker engine initialized successfully.',
        'npc.dialog.defaultLabel': 'Diálogo padrão:',
        'npc.dialog.placeholder': 'Digite o diálogo do NPC...',
        'npc.reward.defaultLabel': 'Ao concluir o diálogo padrão, ativar variável:',
        'npc.toggle.create': 'Criar diálogo alternativo',
        'npc.toggle.hide': 'Ocultar diálogo alternativo',
        'npc.conditional.variableLabel': 'Variável para diálogo alternativo:',
        'npc.conditional.textLabel': 'Texto alternativo:',
        'npc.conditional.placeholder': 'Mensagem exibida quando a variável estiver ON.',
        'npc.conditional.rewardLabel': 'Ao concluir o diálogo alternativo, ativar variável:',
        'npc.delete': 'Remover NPC',
        'npc.defaultName': 'NPC',
        'npcs.names.oldMage': 'Velho Mago',
        'npcs.names.villagerMan': 'Homem comum',
        'npcs.names.villagerWoman': 'Mulher comum',
        'npcs.names.child': 'Criança curiosa',
        'npcs.names.woodenSign': 'Placa de madeira',
        'npcs.dialog.oldMage': 'Eu guardo segredos antigos.',
        'npcs.dialog.villagerMan': 'Bom dia! Posso ajudar?',
        'npcs.dialog.villagerWoman': 'Que dia lindo para explorar.',
        'npcs.dialog.child': 'Vamos brincar de aventura!',
        'npcs.dialog.woodenSign': 'Atenção aos perigos à frente.',
        'npc.status.available': 'Disponível',
        'npc.status.position': 'Mapa ({col}, {row}) - ({x}, {y})',
        'project.titleLabel': 'Nome do jogo',
        'project.titlePlaceholder': 'Ex.: Lendas do Vale',
        'project.authorLabel': 'Autor',
        'project.authorPlaceholder': 'Seu nome ou estúdio',
        'project.languageLabel': 'Idioma',
        'project.generateUrl': 'Gerar URL do jogo',
        'language.option.ptBR': 'Português (Brasil)',
        'language.option.enUS': 'English (US)',
        'history.undo': 'Desfazer',
        'history.redo': 'Refazer',
        'alerts.npc.full': 'Todos os NPCs já estão no mapa.',
        'alerts.npc.createError': 'Não foi possível criar o NPC.',
        'alerts.npc.selectFirst': 'Selecione um NPC para colocar.',
        'alerts.npc.placeError': 'Não foi possível posicionar o NPC.',
        'alerts.share.unavailable': 'Função de compartilhar não está disponível.',
        'alerts.share.copied': 'URL do jogo copiada para a área de transferência!',
        'alerts.share.copyPrompt': 'Copie a URL do seu jogo:',
        'alerts.share.generateError': 'Não foi possível gerar a URL do jogo.',
        'alerts.share.loadError': 'Não foi possível carregar o arquivo.',
        'enemies.damageInfo': ' - Dano: {value}',
        'enemies.variableLabel': 'Variável:',
        'enemies.names.giantRat': '🐀 Rato Gigante',
        'enemies.names.bandit': '🧔 Bandido',
        'enemies.names.darkKnight': '⚔️ Cavaleiro Negro',
        'enemies.names.necromancer': '🧙‍♂️ Necro',
        'enemies.names.dragon': '🐉 Dragão',
        'enemies.names.skeleton': '💀 Esqueleto',
        'enemies.names.fallenKing': '👑 Rei Caído',
        'enemies.names.ancientDemon': '😈 Demônio Ancião',
        'enemies.defeat.dragon': 'Selo do Dragão ativado!',
        'enemies.defeat.fallenKing': 'Selo Real despertou!',
        'enemies.defeat.ancientDemon': 'Selo Demoníaco ativo!',
        'variables.none': 'Nenhuma',
        'objects.info.available': 'Disponível (1 por cenário)',
        'objects.info.placed': 'Já no mapa (1 por cenário)',
        'variables.names.var1': 'Preto',
        'variables.names.var2': 'Azul Escuro',
        'variables.names.var3': 'Roxo',
        'variables.names.var4': 'Verde',
        'variables.names.var5': 'Marrom',
        'variables.names.var6': 'Cinza',
        'variables.names.var7': 'Azul Claro',
        'variables.names.var8': 'Rosa Choque',
        'variables.names.var9': 'Amarelo',
        'objects.switch.variableLabel': 'Variável associada:',
        'objects.switch.stateLabel': 'Estado atual: {state}',
        'objects.state.on': 'ON',
        'objects.state.off': 'OFF',
        'objects.status.doorOpened': 'Porta aberta',
        'objects.status.keyCollected': 'Chave coletada',
        'objects.status.potionCollected': 'Poção coletada',
        'objects.status.scrollUsed': 'Pergaminho usado',
        'objects.status.swordBroken': 'Espada quebrada',
        'objects.status.gameEnd': 'Final do jogo',
        'objects.status.startMarker': 'Marcador inicial',
        'objects.label.door': 'Porta',
        'objects.label.doorVariable': 'Porta mágica',
        'objects.label.playerStart': 'Início do Jogador',
        'objects.label.playerEnd': 'Fim do Jogo',
        'objects.label.switch': 'Alavanca',
        'objects.label.key': 'Chave',
        'objects.label.lifePotion': 'Poção de Vida',
        'objects.label.sword': 'Espada',
        'objects.label.xpScroll': 'Pergaminho de XP',
        'enemy.defaultName': 'Inimigo',
        'world.badge.start': 'Start',
        'world.cell.title': 'Mapa ({col}, {row})',
        'tiles.summaryFallback': 'Tile {id}'
    },
    'en-US': {
        'app.title': 'Tiny RPG Maker',
        'tabs.game': 'Game',
        'tabs.editor': 'Editor',
        'sections.tiles': 'Tiles',
        'sections.world': 'World',
        'sections.objects': 'Objects',
        'sections.npcs': 'NPCs',
        'sections.enemies': 'Enemies',
        'sections.project': 'Project',
        'buttons.reset': 'Reset',
        'buttons.newGame': 'New Game',
        'buttons.remove': 'Remove',
        'aria.reset': 'Restart the current run',
        'aria.newGame': 'Spin up a fresh project in a new tab',
        'touchControls.show': 'Show controls',
        'touchControls.hide': 'Hide controls',
        'touchControls.upLabel': 'Move up',
        'touchControls.downLabel': 'Move down',
        'touchControls.leftLabel': 'Move left',
        'touchControls.rightLabel': 'Move right',
        'doors.variableLocked': 'This door does not open with a key.',
        'doors.openedRemaining': 'You used a key to open the door. Remaining: {value}.',
        'doors.opened': 'You used a key to open the door.',
        'doors.locked': 'Door locked. You need a key.',
        'log.engineReady': 'Tiny RPG Maker engine initialized successfully.',
        'npc.dialog.defaultLabel': 'Default dialogue:',
        'npc.dialog.placeholder': 'Type the NPC dialogue...',
        'npc.reward.defaultLabel': 'After the default dialogue, enable variable:',
        'npc.toggle.create': 'Create alternate dialogue',
        'npc.toggle.hide': 'Hide alternate dialogue',
        'npc.conditional.variableLabel': 'Variable for alternate dialogue:',
        'npc.conditional.textLabel': 'Alternate text:',
        'npc.conditional.placeholder': 'Message displayed when the variable is ON.',
        'npc.conditional.rewardLabel': 'After the alternate dialogue, enable variable:',
        'npc.delete': 'Remove NPC',
        'npc.defaultName': 'NPC',
        'npcs.names.oldMage': 'Old Mage',
        'npcs.names.villagerMan': 'Common man',
        'npcs.names.villagerWoman': 'Common woman',
        'npcs.names.child': 'Curious child',
        'npcs.names.woodenSign': 'Wooden sign',
        'npcs.dialog.oldMage': 'I guard old secrets.',
        'npcs.dialog.villagerMan': 'Good morning! Can I help?',
        'npcs.dialog.villagerWoman': 'What a lovely day to explore.',
        'npcs.dialog.child': 'Let\'s play adventure!',
        'npcs.dialog.woodenSign': 'Beware of the dangers ahead.',
        'npc.status.available': 'Available',
        'npc.status.position': 'Map ({col}, {row}) - ({x}, {y})',
        'project.titleLabel': 'Game name',
        'project.titlePlaceholder': 'Eg: Legends of the Vale',
        'project.authorLabel': 'Author',
        'project.authorPlaceholder': 'Your name or studio',
        'project.languageLabel': 'Language',
        'project.generateUrl': 'Generate share URL',
        'language.option.ptBR': 'Portuguese (Brazil)',
        'language.option.enUS': 'English (US)',
        'history.undo': 'Undo',
        'history.redo': 'Redo',
        'alerts.npc.full': 'All NPCs are already on the map.',
        'alerts.npc.createError': 'Could not create this NPC.',
        'alerts.npc.selectFirst': 'Select an NPC before placing.',
        'alerts.npc.placeError': 'Could not place the NPC.',
        'alerts.share.unavailable': 'Share feature is not available.',
        'alerts.share.copied': 'Game URL copied to your clipboard!',
        'alerts.share.copyPrompt': 'Copy your game URL:',
        'alerts.share.generateError': 'Unable to generate the game URL.',
        'alerts.share.loadError': 'Unable to load the file.',
        'enemies.damageInfo': ' - Damage: {value}',
        'enemies.variableLabel': 'Variable:',
        'enemies.names.giantRat': '🐀 Giant Rat',
        'enemies.names.bandit': '🧔 Bandit',
        'enemies.names.darkKnight': '⚔️ Dark Knight',
        'enemies.names.necromancer': '🧙‍♂️ Necromancer',
        'enemies.names.dragon': '🐉 Dragon',
        'enemies.names.skeleton': '💀 Skeleton',
        'enemies.names.fallenKing': '👑 Fallen King',
        'enemies.names.ancientDemon': '😈 Ancient Demon',
        'enemies.defeat.dragon': 'Dragon Seal activated!',
        'enemies.defeat.fallenKing': 'Royal Seal awakened!',
        'enemies.defeat.ancientDemon': 'Demonic Seal is active!',
        'variables.none': 'None',
        'objects.info.available': 'Available (1 per scene)',
        'objects.info.placed': 'Already on the map (1 per scene)',
        'variables.names.var1': 'Black',
        'variables.names.var2': 'Dark Blue',
        'variables.names.var3': 'Purple',
        'variables.names.var4': 'Green',
        'variables.names.var5': 'Brown',
        'variables.names.var6': 'Gray',
        'variables.names.var7': 'Light Blue',
        'variables.names.var8': 'Hot Pink',
        'variables.names.var9': 'Yellow',
        'objects.switch.variableLabel': 'Linked variable:',
        'objects.switch.stateLabel': 'Current state: {state}',
        'objects.state.on': 'ON',
        'objects.state.off': 'OFF',
        'objects.status.doorOpened': 'Door opened',
        'objects.status.keyCollected': 'Key collected',
        'objects.status.potionCollected': 'Potion collected',
        'objects.status.scrollUsed': 'Scroll used',
        'objects.status.swordBroken': 'Sword broken',
        'objects.status.gameEnd': 'End of game',
        'objects.status.startMarker': 'Start marker',
        'objects.label.door': 'Door',
        'objects.label.doorVariable': 'Magic door',
        'objects.label.playerStart': 'Player start',
        'objects.label.playerEnd': 'Game end',
        'objects.label.switch': 'Switch',
        'objects.label.key': 'Key',
        'objects.label.lifePotion': 'Health potion',
        'objects.label.sword': 'Sword',
        'objects.label.xpScroll': 'XP scroll',
        'enemy.defaultName': 'Enemy',
        'world.badge.start': 'Start',
        'world.cell.title': 'Map ({col}, {row})',
        'tiles.summaryFallback': 'Tile {id}'
    }
};

const TextResources = {
    defaultLocale: 'pt-BR',
    locale: 'pt-BR',
    bundles: TEXT_BUNDLES,

    getStrings(locale = this.locale) {
        return this.bundles[locale] || this.bundles[this.defaultLocale] || {};
    },

    detectBrowserLocale() {
        if (typeof navigator === 'undefined') {
            return this.defaultLocale;
        }
        const languages = Array.isArray(navigator.languages) && navigator.languages.length
            ? navigator.languages
            : [navigator.language || navigator.userLanguage || this.defaultLocale];
        for (const lang of languages) {
            if (lang && this.bundles[lang]) {
                return lang;
            }
            const short = String(lang || '').split('-')[0];
            const match = Object.keys(this.bundles).find((locale) => locale.startsWith(short));
            if (match) {
                return match;
            }
        }
        return this.defaultLocale;
    },

    setLocale(locale, { silent = false, root } = {}) {
        if (!locale || !this.bundles[locale]) {
            return false;
        }
        this.locale = locale;
        if (!silent) {
            this.apply(root);
            if (typeof document !== 'undefined' && typeof document.dispatchEvent === 'function') {
                document.dispatchEvent(new CustomEvent('language-changed', { detail: { locale: this.locale } }));
            }
        }
        return true;
    },

    getLocale() {
        return this.locale;
    },

    extend(locale, strings = {}) {
        if (!locale || typeof strings !== 'object') return;
        const existing = this.bundles[locale] || {};
        this.bundles[locale] = { ...existing, ...strings };
        if (locale === this.locale) {
            this.apply();
        }
    },

    get(key, fallback = '') {
        if (!key) return fallback || '';
        const strings = this.getStrings(this.locale);
        if (Object.prototype.hasOwnProperty.call(strings, key)) {
            return strings[key];
        }
        if (this.locale !== this.defaultLocale) {
            const defaultStrings = this.getStrings(this.defaultLocale);
            if (Object.prototype.hasOwnProperty.call(defaultStrings, key)) {
                return defaultStrings[key];
            }
        }
        return fallback || key || '';
    },

    format(key, params = {}, fallback = '') {
        const template = this.get(key, fallback);
        if (!template) return fallback || key || '';
        return template.replace(/\{(\w+)\}/g, (_, token) => {
            if (Object.prototype.hasOwnProperty.call(params, token)) {
                return params[token];
            }
            return '';
        });
    },

    apply(root = (typeof document !== 'undefined' ? document : null)) {
        if (!root || typeof root.querySelectorAll !== 'function') return;
        root.querySelectorAll('[data-text-key]').forEach((el) => {
            const key = el.getAttribute('data-text-key');
            const text = this.get(key, el.textContent);
            if (text !== undefined) {
                el.textContent = text;
            }
        });

        root.querySelectorAll('[data-placeholder-key]').forEach((el) => {
            const key = el.getAttribute('data-placeholder-key');
            const text = this.get(key, el.getAttribute('placeholder') || '');
            if (text) {
                el.setAttribute('placeholder', text);
            }
        });

        root.querySelectorAll('[data-aria-label-key]').forEach((el) => {
            const key = el.getAttribute('data-aria-label-key');
            const text = this.get(key, el.getAttribute('aria-label') || '');
            if (text) {
                el.setAttribute('aria-label', text);
            }
        });

        root.querySelectorAll('[data-title-key]').forEach((el) => {
            const key = el.getAttribute('data-title-key');
            const text = this.get(key, el.getAttribute('title') || '');
            if (text) {
                el.setAttribute('title', text);
            }
        });
    }
};

if (typeof window !== 'undefined') {
    window.TextResources = TextResources;
    document.addEventListener('DOMContentLoaded', () => {
        const detected = TextResources.detectBrowserLocale();
        TextResources.setLocale(detected, { silent: true });
        TextResources.apply();
    });
} else if (typeof globalThis !== 'undefined') {
    globalThis.TextResources = TextResources;
}
