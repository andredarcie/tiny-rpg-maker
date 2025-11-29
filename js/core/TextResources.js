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
        'doors.unlockedSkill': 'Sua habilidade abriu a porta sem usar chave.',
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
        'npc.variant.label': 'Aparência dos NPCs',
        'npc.variant.human': 'Humano',
        'npc.variant.elf': 'Elfo',
        'npc.variant.dwarf': 'Anão',
        'npcs.names.oldMage': 'Velho Mago',
        'npcs.names.oldMage.human': 'Velho Mago',
        'npcs.names.oldMage.elf': 'Velho Mago',
        'npcs.names.oldMage.dwarf': 'Velho Mago',
        'npcs.names.villagerMan': 'Homem comum',
        'npcs.names.villagerMan.human': 'Homem comum',
        'npcs.names.villagerMan.elf': 'Homem comum',
        'npcs.names.villagerMan.dwarf': 'Homem comum',
        'npcs.names.villagerWoman': 'Mulher comum',
        'npcs.names.villagerWoman.human': 'Mulher comum',
        'npcs.names.villagerWoman.elf': 'Mulher comum',
        'npcs.names.villagerWoman.dwarf': 'Mulher comum',
        'npcs.names.child': 'Criança curiosa',
        'npcs.names.child.human': 'Criança curiosa',
        'npcs.names.child.elf': 'Criança curiosa',
        'npcs.names.child.dwarf': 'Criança curiosa',
        'npcs.names.thoughtBubble': 'Balão',
        'npcs.names.woodenSign': 'Placa de madeira',
        'npcs.names.king': 'Rei',
        'npcs.names.king.human': 'Rei',
        'npcs.names.king.elf': 'Rei',
        'npcs.names.king.dwarf': 'Rei',
        'npcs.names.knight': 'Cavaleiro',
        'npcs.names.knight.human': 'Cavaleiro',
        'npcs.names.knight.elf': 'Cavaleiro',
        'npcs.names.knight.dwarf': 'Cavaleiro',
        'npcs.names.thief': 'Ladra',
        'npcs.names.thief.human': 'Ladra',
        'npcs.names.thief.elf': 'Ladra',
        'npcs.names.thief.dwarf': 'Ladra',
        'npcs.names.blacksmith': 'Ferreira',
        'npcs.names.blacksmith.human': 'Ferreira',
        'npcs.names.blacksmith.elf': 'Ferreira',
        'npcs.names.blacksmith.dwarf': 'Ferreira',
        'npcs.dialog.oldMage': 'Eu guardo segredos antigos.',
        'npcs.dialog.oldMage.human': 'Eu guardo segredos antigos.',
        'npcs.dialog.oldMage.elf': 'As árvores contam histórias para quem escuta.',
        'npcs.dialog.oldMage.dwarf': 'Lendas ecoam nas cavernas profundas.',
        'npcs.dialog.villagerMan': 'Bom dia! Posso ajudar?',
        'npcs.dialog.villagerMan.human': 'Bom dia! Posso ajudar?',
        'npcs.dialog.villagerMan.elf': 'Que a floresta guie seus passos.',
        'npcs.dialog.villagerMan.dwarf': 'Minhas mãos conhecem martelo e picareta.',
        'npcs.dialog.villagerWoman': 'Que dia lindo para explorar.',
        'npcs.dialog.villagerWoman.human': 'Que dia lindo para explorar.',
        'npcs.dialog.villagerWoman.elf': 'As flores florescem com boas intenções.',
        'npcs.dialog.villagerWoman.dwarf': 'O som das forjas acalma o coração.',
        'npcs.dialog.child': 'Vamos brincar de aventura!',
        'npcs.dialog.child.human': 'Vamos brincar de aventura!',
        'npcs.dialog.child.elf': 'Quer correr pelos bosques comigo?',
        'npcs.dialog.child.dwarf': 'Vamos cavar um túnel secreto!',
        'npcs.dialog.thoughtBubble': ' ... ',
        'npcs.dialog.woodenSign': 'Atenção aos perigos à frente.',
        'npcs.dialog.king': 'Proteja nosso reino!',
        'npcs.dialog.king.human': 'Proteja nosso reino!',
        'npcs.dialog.king.elf': 'Honre a natureza acima de tudo.',
        'npcs.dialog.king.dwarf': 'Defenda as minas com honra e aço.',
        'npcs.dialog.knight': 'Estou pronto para lutar.',
        'npcs.dialog.knight.human': 'Estou pronto para lutar.',
        'npcs.dialog.knight.elf': 'Luto para manter o verde vivo.',
        'npcs.dialog.knight.dwarf': 'Minha armadura ressoa como um tambor de guerra.',
        'npcs.dialog.thief': 'Ninguém me pega no ato.',
        'npcs.dialog.thief.human': 'Ninguém me pega no ato.',
        'npcs.dialog.thief.elf': 'Sou sombra entre galhos e folhas.',
        'npcs.dialog.thief.dwarf': 'Entre pedras e ouro, ninguém me vê chegar.',
        'npcs.dialog.blacksmith': 'Minhas forjas estão em brasas.',
        'npcs.dialog.blacksmith.human': 'Minhas forjas estão em brasas.',
        'npcs.dialog.blacksmith.elf': 'Forjo com madeira viva e aço leve.',
        'npcs.dialog.blacksmith.dwarf': 'Aço e pedra; é assim que se constrói.',
        'npc.status.available': 'Disponível',
        'npc.status.position': 'Mapa ({col}, {row}) - ({x}, {y})',
        'project.titleLabel': 'Nome do jogo',
        'project.titlePlaceholder': 'Ex.: Lendas do Vale',
        'project.authorLabel': 'Autor',
        'project.authorPlaceholder': 'Seu nome ou estúdio',
        'project.languageLabel': 'Idioma',
        'project.generateUrl': 'Gerar URL do jogo',
        'project.generateHTML': 'Exportar Projeto',
        'project.shareHint': 'Gere uma URL e compartilhe com seus amigos!',
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
        'variables.skill.bard': 'Habilidade: Bardo (falas extras)',
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
        'objects.end.textLabel': 'Mensagem final:',
        'objects.end.placeholder': 'Escreva a mensagem exibida antes de "The End"...',
        'objects.end.hint': 'Máx. {max} caracteres.',
        'objects.status.startMarker': 'Marcador inicial',
        'objects.label.door': 'Porta',
        'objects.label.doorVariable': 'Porta mágica',
        'objects.label.playerStart': 'Início do Jogador',
        'objects.label.playerEnd': 'Fim do Jogo',
        'objects.label.switch': 'Alavanca',
        'objects.label.key': 'Chave',
        'objects.label.lifePotion': 'Poção de Vida',
        'objects.label.sword': 'Espada',
        'objects.label.swordBronze': 'Espada de Bronze',
        'objects.label.swordWood': 'Espada de Madeira',
        'objects.label.xpScroll': 'Pergaminho de XP',
        'objects.item.pickup': 'Você pegou um item.',
        'objects.key.pickup.single': 'Você pegou uma chave.',
        'objects.key.pickup.count': 'Você pegou uma chave. Agora você tem {value}.',
        'objects.potion.used': 'Você usou uma poção de vida.',
        'objects.xpScroll.read': 'Você leu um pergaminho de XP e ganhou {value} de experiência.',
        'objects.xpScroll.levelUp': 'Nível +{value}!',
        'objects.switch.onMessage': 'Alavanca ligada.',
        'objects.switch.offMessage': 'Alavanca desligada.',
        'objects.sword.pickup.single': 'Você pegou uma {name}! Ela bloqueia 1 de dano no próximo ataque inimigo.',
        'objects.sword.pickup.multi': 'Você pegou uma {name}! Ela bloqueia {value} de dano somando os próximos ataques inimigos.',
        'combat.block.full': 'Ataque bloqueado!',
        'combat.block.partial': 'Bloqueado -{value}',
        'combat.stealthKill': 'Abate furtivo!',
        'combat.stealthMiss': 'Errou o ataque furtivo!',
        'player.levelUp': 'Level Up!',
        'player.levelUp.value': 'Level Up! Nível {value}',
        'skills.levelUpTitle': 'Escolha uma skill',
        'skills.levelUpHint': 'Use 1/2 ou ↑ ↓',
        'skills.pendingLabel': '+{value} escolha(s) na fila',
        'skills.allUnlocked': 'Todas as habilidades já foram aprendidas.',
        'skills.pickupMessage': 'Você aprendeu {name}!',
        'skills.keylessDoors.name': 'Ladino',
        'skills.keylessDoors.desc': 'Portas sem chave.',
        'skills.charisma.name': 'Bardo',
        'skills.charisma.desc': 'Falas extras.',
        'skills.necromancer.name': 'Necromante',
        'skills.necromancer.desc': 'Renasce ao morrer.',
        'skills.necromancer.revive': 'Você voltou da morte!',
        'skills.necromancer.revivePrompt': 'Voltar à vida',
        'gameOver.retryVictory': 'Jogar de novo?',
        'gameOver.retryDefeat': 'Tentar novamente?',
        'skills.stealth.name': 'Assassino',
        'skills.stealth.desc': 'Olhos não te veem.',
        'skills.waterWalker.name': 'Monge das Águas',
        'skills.waterWalker.desc': 'Anda sobre água.',
        'skills.lavaWalker.name': 'Mago de Fogo',
        'skills.lavaWalker.desc': 'Anda sobre lava.',
        'skills.potionMaster.name': 'Alquimista',
        'skills.potionMaster.desc': 'Poções curam tudo.',
        'skills.xpBoost.name': 'Estudioso',
        'skills.xpBoost.desc': '+50% de XP ganho.',
        'skills.ironBody.name': 'Cavaleiro de Aço',
        'skills.ironBody.desc': '-1 em todo dano recebido.',
        'game.clearAllEnemies': 'Matou todos os inimigos! As terras estão purificadas e sua força de vida floresce.',
        'enemy.defaultName': 'Inimigo',
        'world.badge.start': 'Start',
        'world.cell.title': 'Mapa ({col}, {row})',
        'editor.map.title': 'Mapa',
        'editor.mapNav.up': 'Ir para cena acima',
        'editor.mapNav.down': 'Ir para cena abaixo',
        'editor.mapNav.left': 'Ir para cena à esquerda',
        'editor.mapNav.right': 'Ir para cena à direita',
        'editor.mobileNav.label': 'Selecionar seção do editor',
        'editor.mobileNav.tiles': 'Mostrar tiles',
        'editor.mobileNav.world': 'Mostrar mapa do mundo',
        'editor.mobileNav.objects': 'Mostrar objetos',
        'editor.mobileNav.npcs': 'Mostrar NPCs',
        'editor.mobileNav.enemies': 'Mostrar inimigos',
        'editor.mobileNav.project': 'Mostrar projeto',
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
        'doors.unlockedSkill': 'Your skill opens the door without a key.',
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
        'npc.variant.label': 'NPC appearance',
        'npc.variant.human': 'Human',
        'npc.variant.elf': 'Elf',
        'npc.variant.dwarf': 'Dwarf',
        'npcs.names.oldMage': 'Old Mage',
        'npcs.names.villagerMan': 'Common man',
        'npcs.names.villagerMan.human': 'Common man',
        'npcs.names.villagerMan.elf': 'Common man',
        'npcs.names.villagerMan.dwarf': 'Common man',
        'npcs.names.villagerWoman': 'Common woman',
        'npcs.names.villagerWoman.human': 'Common woman',
        'npcs.names.villagerWoman.elf': 'Common woman',
        'npcs.names.villagerWoman.dwarf': 'Common woman',
        'npcs.names.child': 'Curious child',
        'npcs.names.child.human': 'Curious child',
        'npcs.names.child.elf': 'Curious child',
        'npcs.names.child.dwarf': 'Curious child',
        'npcs.names.thoughtBubble': 'Balloon',
        'npcs.names.woodenSign': 'Wooden sign',
        'npcs.names.king': 'King',
        'npcs.names.king.human': 'King',
        'npcs.names.king.elf': 'King',
        'npcs.names.king.dwarf': 'King',
        'npcs.names.knight': 'Knight',
        'npcs.names.knight.human': 'Knight',
        'npcs.names.knight.elf': 'Knight',
        'npcs.names.knight.dwarf': 'Knight',
        'npcs.names.thief': 'Thief',
        'npcs.names.thief.human': 'Thief',
        'npcs.names.thief.elf': 'Thief',
        'npcs.names.thief.dwarf': 'Thief',
        'npcs.names.blacksmith': 'Blacksmith',
        'npcs.names.blacksmith.human': 'Blacksmith',
        'npcs.names.blacksmith.elf': 'Blacksmith',
        'npcs.names.blacksmith.dwarf': 'Blacksmith',
        'npcs.dialog.oldMage': 'I guard old secrets.',
        'npcs.dialog.oldMage.human': 'I guard old secrets.',
        'npcs.dialog.oldMage.elf': 'Trees whisper stories to careful ears.',
        'npcs.dialog.oldMage.dwarf': 'Legends echo through the deep caverns.',
        'npcs.dialog.villagerMan': 'Good morning! Can I help?',
        'npcs.dialog.villagerMan.human': 'Good morning! Can I help?',
        'npcs.dialog.villagerMan.elf': 'May the forest guide your steps.',
        'npcs.dialog.villagerMan.dwarf': 'My hands know hammers and pickaxes.',
        'npcs.dialog.villagerWoman': 'What a lovely day to explore.',
        'npcs.dialog.villagerWoman.human': 'What a lovely day to explore.',
        'npcs.dialog.villagerWoman.elf': 'Flowers bloom with good intentions.',
        'npcs.dialog.villagerWoman.dwarf': 'The sound of the forge calms my heart.',
        'npcs.dialog.child': 'Let\'s play adventure!',
        'npcs.dialog.child.human': 'Let\'s play adventure!',
        'npcs.dialog.child.elf': 'Want to race through the woods with me?',
        'npcs.dialog.child.dwarf': 'Let\'s dig a secret tunnel!',
        'npcs.dialog.thoughtBubble': ' ... ',
        'npcs.dialog.woodenSign': 'Beware of the dangers ahead.',
        'npcs.dialog.king': 'Defend our kingdom!',
        'npcs.dialog.king.human': 'Defend our kingdom!',
        'npcs.dialog.king.elf': 'Honor nature above all.',
        'npcs.dialog.king.dwarf': 'Guard the mines with steel and honor.',
        'npcs.dialog.knight': 'I am ready to fight.',
        'npcs.dialog.knight.human': 'I am ready to fight.',
        'npcs.dialog.knight.elf': 'I fight to keep the green alive.',
        'npcs.dialog.knight.dwarf': 'My armor thunders like a war drum.',
        'npcs.dialog.thief': 'No one catches me in the act.',
        'npcs.dialog.thief.human': 'No one catches me in the act.',
        'npcs.dialog.thief.elf': 'I am a shadow between leaves and branches.',
        'npcs.dialog.thief.dwarf': 'Among stone and gold, no one sees me coming.',
        'npcs.dialog.blacksmith': 'My forges are blazing hot.',
        'npcs.dialog.blacksmith.human': 'My forges are blazing hot.',
        'npcs.dialog.blacksmith.elf': 'I forge with living wood and light steel.',
        'npcs.dialog.blacksmith.dwarf': 'Steel and stone; that is how you build.',
        'npc.status.available': 'Available',
        'npc.status.position': 'Map ({col}, {row}) - ({x}, {y})',
        'project.titleLabel': 'Game name',
        'project.titlePlaceholder': 'Eg: Legends of the Vale',
        'project.authorLabel': 'Author',
        'project.authorPlaceholder': 'Your name or studio',
        'project.languageLabel': 'Language',
        'project.generateUrl': 'Generate share URL',
        'project.generateHTML': 'Export Project',
        'project.shareHint': 'Generate a URL and share it with friends!',
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
        'variables.skill.bard': 'Skill: Bard (alternate lines)',
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
        'objects.end.textLabel': 'Final message:',
        'objects.end.placeholder': 'Type the message shown before "The End"...',
        'objects.end.hint': 'Max {max} characters.',
        'objects.status.startMarker': 'Start marker',
        'objects.label.door': 'Door',
        'objects.label.doorVariable': 'Magic door',
        'objects.label.playerStart': 'Player start',
        'objects.label.playerEnd': 'Game end',
        'objects.label.switch': 'Switch',
        'objects.label.key': 'Key',
        'objects.label.lifePotion': 'Health potion',
        'objects.label.sword': 'Sword',
        'objects.label.swordBronze': 'Bronze sword',
        'objects.label.swordWood': 'Wooden sword',
        'objects.label.xpScroll': 'XP scroll',
        'objects.item.pickup': 'You picked up an item.',
        'objects.key.pickup.single': 'You picked up a key.',
        'objects.key.pickup.count': 'You picked up a key. You now have {value}.',
        'objects.potion.used': 'You used a health potion.',
        'objects.xpScroll.read': 'You read an XP scroll and gained {value} experience.',
        'objects.xpScroll.levelUp': 'Level +{value}!',
        'objects.switch.onMessage': 'Switch turned on.',
        'objects.switch.offMessage': 'Switch turned off.',
        'objects.sword.pickup.single': 'You picked up a {name}! It blocks 1 damage from the next enemy attack.',
        'objects.sword.pickup.multi': 'You picked up a {name}! It blocks {value} damage across upcoming enemy attacks.',
        'combat.block.full': 'Attack blocked!',
        'combat.block.partial': 'Blocked -{value}',
        'combat.stealthKill': 'Stealth kill!',
        'combat.stealthMiss': 'Stealth strike missed!',
        'player.levelUp': 'Level Up!',
        'player.levelUp.value': 'Level Up! Level {value}',
        'skills.levelUpTitle': 'Pick a skill',
        'skills.levelUpHint': 'Use 1/2 or ↑ ↓',
        'skills.pendingLabel': '+{value} pick(s) queued',
        'skills.allUnlocked': 'All skills already unlocked.',
        'skills.pickupMessage': 'You learned {name}!',
        'skills.keylessDoors.name': 'Rogue',
        'skills.keylessDoors.desc': 'Locked doors open without spending keys.',
        'skills.charisma.name': 'Bard',
        'skills.charisma.desc': 'Unlock alternate NPC dialogues.',
        'skills.necromancer.name': 'Necromancer',
        'skills.necromancer.desc': 'Automatically revive once after death.',
        'skills.necromancer.revive': 'You returned from death!',
        'skills.necromancer.revivePrompt': 'Return to life',
        'gameOver.retryVictory': 'Play again?',
        'gameOver.retryDefeat': 'Try again?',
        'skills.stealth.name': 'Assassin',
        'skills.stealth.desc': 'Enemies with eyes will not detect you.',
        'skills.waterWalker.name': 'Water Monk',
        'skills.waterWalker.desc': 'Water tiles stop blocking your path.',
        'skills.lavaWalker.name': 'Fire Mage',
        'skills.lavaWalker.desc': 'Stride over lava without harm.',
        'skills.potionMaster.name': 'Alchemist',
        'skills.potionMaster.desc': 'Health potions restore all HP.',
        'skills.xpBoost.name': 'Scholar',
        'skills.xpBoost.desc': '+50% experience gain.',
        'skills.ironBody.name': 'Iron Knight',
        'skills.ironBody.desc': '-1 to every incoming hit.',
        'game.clearAllEnemies': 'You felled every foe. The land is cleansed and your life force swells.',
        'enemy.defaultName': 'Enemy',
        'world.badge.start': 'Start',
        'world.cell.title': 'Map ({col}, {row})',
        'editor.map.title': 'Map',
        'editor.mapNav.up': 'Go to scene above',
        'editor.mapNav.down': 'Go to scene below',
        'editor.mapNav.left': 'Go to scene on the left',
        'editor.mapNav.right': 'Go to scene on the right',
        'editor.mobileNav.label': 'Select editor section',
        'editor.mobileNav.tiles': 'Show tiles',
        'editor.mobileNav.world': 'Show world map',
        'editor.mobileNav.objects': 'Show objects',
        'editor.mobileNav.npcs': 'Show NPCs',
        'editor.mobileNav.enemies': 'Show enemies',
        'editor.mobileNav.project': 'Show project',
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
            document.dispatchEvent(new CustomEvent('language-changed', { detail: { locale: this.locale } }));
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
