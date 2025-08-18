# Bitsy Mini Engine

Uma engine de jogos modular inspirada no Bitsy, organizada com boas práticas e separação de responsabilidades.

## 🏗️ Estrutura do Projeto

```
bitsy/
├── index.html              # Arquivo principal HTML
├── styles.css              # Estilos CSS
├── js/
│   ├── main.js             # Arquivo principal de inicialização
│   ├── core/               # Módulos principais da engine
│   │   ├── GameState.js    # Gerenciamento de estado do jogo
│   │   ├── TileManager.js  # Gerenciamento de tiles
│   │   ├── NPCManager.js   # Gerenciamento de NPCs
│   │   ├── InputManager.js # Gerenciamento de entrada
│   │   ├── Renderer.js     # Sistema de renderização
│   │   └── GameEngine.js   # Motor principal do jogo
│   └── editor/             # Módulos do editor
│       └── EditorManager.js # Gerenciamento do editor
└── README.md               # Esta documentação
```

## 🎮 Funcionalidades

### Motor do Jogo
- **Sistema de tiles 8x8**: Tiles personalizáveis com pixel art
- **Sistema de NPCs**: Personagens com diálogos interativos
- **Sistema de colisão**: Tiles e paredes com detecção de colisão
- **Sistema de diálogos**: Interface de conversa com NPCs
- **Sistema de salas**: Múltiplas salas (atualmente suporte a 1 sala)

### Editor
- **Editor de tiles**: Criar e editar tiles pixel por pixel
- **Editor de mapa**: Pintar tiles no mapa 8x8
- **Gerenciador de NPCs**: Adicionar, posicionar e editar NPCs
- **Sistema de histórico**: Undo/Redo com Ctrl+Z/Ctrl+Y
- **Exportação**: Salvar como JSON ou HTML standalone

## 🚀 Como Usar

### 1. Iniciar o Servidor
```bash
python -m http.server 8000
```

### 2. Abrir no Navegador
Acesse `http://localhost:8000`

### 3. Criar um Jogo
1. **Abra a aba "Editor"**
2. **Crie tiles**: Use o editor de tiles para desenhar pixel art 8x8
3. **Pinte o mapa**: Selecione um tile e clique no mapa para pintar
4. **Adicione NPCs**: Crie NPCs e posicione-os no mapa
5. **Teste o jogo**: Mude para a aba "Jogo" e use as setas para mover

## 📁 Módulos

### GameState.js
Gerencia todo o estado do jogo:
- Dados do jogo (título, paleta, salas)
- Estado do jogador (posição, sala atual)
- Estado do diálogo

### TileManager.js
Gerencia tiles e operações relacionadas:
- Criação de tiles em branco
- Adição/remoção/atualização de tiles
- Gerenciamento do mapa de tiles
- Criação de tiles padrão (árvore)

### NPCManager.js
Gerencia NPCs e operações relacionadas:
- Criação de NPCs
- Posicionamento no mapa
- Gerenciamento de diálogos

### InputManager.js
Gerencia entrada do usuário:
- Controles do jogador (setas)
- Interação com diálogos (Z)
- Eventos do editor

### Renderer.js
Gerencia toda a renderização:
- Renderização do jogo
- Renderização do editor
- Renderização de tiles
- Renderização de diálogos

### GameEngine.js
Motor principal que coordena todos os módulos:
- Inicialização dos módulos
- Lógica de movimento
- Detecção de interações
- Interface com o editor

### EditorManager.js
Gerencia todas as operações do editor:
- Interface do editor
- Gerenciamento de histórico
- Operações de arquivo
- Renderização do editor

## 🔧 API Pública

O motor expõe uma API através de `window.BitsyMini`:

```javascript
// Dados do jogo
BitsyMini.exportGameData()     // Exportar dados do jogo
BitsyMini.importGameData(data) // Importar dados do jogo
BitsyMini.getState()           // Obter estado atual
BitsyMini.draw()               // Redesenhar o jogo
BitsyMini.resetGame()          // Reiniciar o jogo

// Tiles
BitsyMini.addTile(tile)        // Adicionar tile
BitsyMini.updateTile(id, data) // Atualizar tile
BitsyMini.createBlankTile(name) // Criar tile em branco
BitsyMini.setMapTile(x, y, id) // Definir tile no mapa
BitsyMini.getTiles()           // Obter lista de tiles
BitsyMini.getTileMap()         // Obter mapa de tiles

// NPCs
BitsyMini.addSprite(npc)       // Adicionar NPC
BitsyMini.getSprites()         // Obter lista de NPCs
```

## 🎨 Personalização

### Cores
As cores padrão podem ser alteradas no `GameState.js`:
```javascript
palette: ['#0e0f13', '#2e3140', '#f4f4f8']
```

### Tamanho do Mapa
O tamanho do mapa é fixo em 8x8 tiles, mas pode ser alterado modificando as constantes nos módulos.

## 📝 Boas Práticas Implementadas

1. **Separação de Responsabilidades**: Cada módulo tem uma função específica
2. **Encapsulamento**: Dados privados protegidos, API pública clara
3. **Modularidade**: Módulos independentes e reutilizáveis
4. **Nomenclatura Clara**: Funções e variáveis com nomes descritivos
5. **Documentação**: Comentários explicativos em cada módulo
6. **Compatibilidade**: API mantida para código existente

## 🔄 Migração

O código foi reorganizado mantendo compatibilidade com a API anterior. Se você tinha código usando `window.BitsyMini`, ele continuará funcionando.

## 🐛 Solução de Problemas

### Editor não funciona
- Verifique se todos os arquivos JavaScript estão sendo carregados
- Abra o console do navegador para ver erros
- Certifique-se de que o servidor está rodando

### Tiles não aparecem
- Verifique se há pelo menos um tile criado
- Use o botão "Adicionar Tile" para criar um tile padrão
- Verifique se o tile está selecionado antes de pintar

### NPCs não funcionam
- Verifique se o NPC foi adicionado corretamente
- Certifique-se de que o NPC está posicionado no mapa
- Verifique se o diálogo foi definido

## 📄 Licença

Este projeto é uma implementação educacional inspirada no Bitsy original.
