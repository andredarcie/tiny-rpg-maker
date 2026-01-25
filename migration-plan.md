# Plano de migracao para Vite + TS

## Objetivo
Migrar a engine atual (JS puro no build) para o projeto Vite Vanilla TS em `tiny-rpg-maker/`, mantendo comportamento identico (editor + jogo + export mode) e preservando o layout/fluxo atual.

## Premissas
- Manter compatibilidade funcional com `index.html` atual ate a migracao concluir.
- Evitar reescrita total: migracao incremental e segura.
- Deixar a engine pronta para evolucao em TS, mas sem bloquear o merge por tipagem completa.

## Inventario inicial (o que existe hoje)
- Entrada principal: `js/main.js` (boot, tabs, engine, editor, bindings UI, touch pad, export mode).
- Modulos de engine: `js/core/**`.
- Modulos de editor: `js/editor/**`.
- UI e estilos: `index.html`, `styles.css`, `showcase.html`, `share-analyzer.html`.
- Assets estaticos: imagens/preview em `showcase_img/`.
- Novo Vite app: `tiny-rpg-maker/` com `src/main.ts`, `src/counter.ts`, `index.html` proprio.

## Estrategia geral
Migracao em camadas: primeiro carregar o JS existente dentro do Vite (sem converter), depois ir movendo arquivos e tipando aos poucos, mantendo o comportamento. O foco e preservar o runtime enquanto trocamos o sistema de build.

## Plano de acao detalhado

### Fase 0 - Preparacao e mapeamento
1) Catalogar entrypoints e dependencias
   - Mapear como `js/main.js` referencia `GameEngine`, `EditorManager`, `TextResources`, etc.
   - Listar globals expostos via `window.TinyRPGMaker` e `window.__TINY_RPG_EXPORT_MODE`.
   - Identificar scripts carregados no `index.html` atual e a ordem de carregamento.
2) Inventariar assets e caminhos relativos
   - CSS, imagens, fontes, e qualquer asset referenciado em HTML/CSS/JS.
   - Marcar quais assets precisam ir para `public/` do Vite.
3) Inventariar eventos custom
   - Eventos como `game-tab-activated`, `editor-tab-activated`, `language-changed`.
   - Quem emite e quem escuta cada evento (para evitar regressao ao modularizar).

#### Resultados da fase 0
- Entrada principal (boot): `js/main.js` inicializa `GameEngine` e `EditorManager` quando `DOMContentLoaded` dispara, expõe `window.TinyRPGMaker` e lê `window.__TINY_RPG_EXPORT_MODE`.
- Scripts carregados no `index.html` (ordem atual): `js/core/**` (TextResources, SkillDefinitions, state/*, GameState, sprites/*, renderer/*, share/*), modulo inline Firebase (CDN), `js/core/FirebaseShareTracker.js`, `js/core/*Definitions.js`, `js/editor/**` (modules, manager, renderers, services), `js/core/*` (ShareUtils, TileManager, NPCManager, InputManager, Renderer, engine/*, GameEngine), `js/main.js`, `js/editor/modules/EditorExportService.js`.
- Globals detectados: `window.TextResources`, `window.GameEngine`, `window.EditorManager`, `window.EditorManagerModule`, `window.TinyRPGMaker`, `window.__TINY_RPG_EXPORT_MODE`, `window.TinyRPGFirebaseConfig`, `window.TinyRPGFirebaseCollection`, `window.TinyRPGFirebaseApp`, `window.TinyRPGFirebaseDb`, `window.TinyRPGFirebaseFirestore`.
- Eventos custom: `game-tab-activated` e `editor-tab-activated` sao emitidos em `js/main.js` e consumidos em `js/main.js`, `js/core/GameState.js`, `js/editor/manager/EditorEventBinder.js`; `language-changed` e emitido por `js/core/TextResources.js` e consumido em `js/main.js`, `js/editor/EditorManager.js`, `js/editor/manager/EditorUIController.js`.
- Dependencias externas no HTML: Google Fonts (Press Start 2P), Google Tag (gtag.js) e Firebase via CDN (firebase-app, analytics, firestore).
- Outras paginas: `share-analyzer.html` depende apenas de `js/core/share/*`; `showcase.html` depende de `js/core/state/StateObjectManager.js`, sprites, *Definitions, share/* e `js/showcase/ShareCoverPreview.js`.

### Fase 1 - Boot no Vite sem reescrever a engine
4) Criar entry Vite que carrega a engine legacy
   - Substituir `src/main.ts` por um bootstrap simples que chama o boot atual.
   - Trazer os arquivos JS legacy para `tiny-rpg-maker/src/legacy/` sem alteracoes.
   - Converter os scripts legacy em ES modules via export/import leves, ou usar um unico `legacy-index.js` que importa tudo em ordem.
   - Garantir que o `DOMContentLoaded` continue sendo o gatilho de boot.
5) Migrar `index.html` para o do Vite
   - Copiar estrutura de `index.html` raiz para `tiny-rpg-maker/index.html`.
   - Ajustar paths para assets e CSS (usar `public/` do Vite).
   - Garantir os mesmos IDs/classes usados pelo JS (canvas, tabs, botoes, etc).
6) Migrar `styles.css` e assets estaticos
   - Mover `styles.css` e imagens para locais corretos (`public/` ou `src/`).
   - Validar que `background-image` e `url(...)` continuam funcionando.

### Fase 2 - Modularizacao leve (JS -> TS incremental)
7) Criar ponte de tipos e globals
   - Definir um arquivo `src/legacy/globals.d.ts` para `window.TinyRPGMaker` e `window.__TINY_RPG_EXPORT_MODE`.
   - Adicionar tipos minimos para `TextResources`, `GameEngine`, `EditorManager` (interfaces basicas).
8) Converter modulos criticos primeiro
   - Priorizar `js/main.js` -> `src/main.ts` (mantendo logica, apenas tipando).
   - Converter arquivos que expõem APIs publicas (e.g., `GameEngine`) antes de arquivos internos.
   - Evitar mudar logica; apenas ajustar imports/exports e tipos.
9) Padronizar imports/exports
   - Remover dependencias de ordem de script tags.
   - Garantir que cada modulo exporte explicitamente o que usa.
   - Substituir referencias globais por imports (quando possivel).
10) Migracao por partes (classe a classe) - ordem sugerida
   - Boot e globals: `js/main.js`, `js/core/TextResources.js`, `js/core/ShareUtils.js`.
   - Engine principal: `js/core/GameEngine.js`, `js/core/GameState.js`.
   - Managers de engine: `js/core/engine/MovementManager.js`, `js/core/engine/InteractionManager.js`, `js/core/engine/DialogManager.js`, `js/core/engine/EnemyManager.js`.
   - State managers: `js/core/state/**` (World, Player, Dialog, Variable, Enemy, Object, Item, Skill, Lifecycle, Screen, Data).
   - Render: `js/core/renderer/**` + `js/core/Renderer.js`.
   - Sprites e definicoes: `js/core/sprites/**`, `js/core/*Definitions.js`, `js/core/TileManager.js`, `js/core/NPCManager.js`, `js/core/InputManager.js`.
   - Editor core: `js/editor/EditorManager.js`, `js/editor/manager/**`.
   - Editor modules: `js/editor/modules/**` e `js/editor/modules/renderers/**`.
   - Share: `js/core/share/**` + `js/core/FirebaseShareTracker.js` (por ultimo).
   - Showcase: `js/showcase/ShareCoverPreview.js`.

### Fase 3 - Validacao funcional e regressao zero
11) Criar checklist de QA manual
   - Jogo inicia, movimenta, colisoes e interacoes.
   - Editor: pintar tiles, salvar, reset, troca de tabs.
   - Export mode: `window.__TINY_RPG_EXPORT_MODE` funcionando.
   - Touch pad e mobile UI.
   - Internacionalizacao e troca de idioma.
12) Comparar comportamento entre legacy e Vite
   - Rodar side-by-side (HTML antigo vs Vite) para validar paridade visual e funcional.

### Fase 4 - Limpeza e consolidacao
13) Remover arquivos legacy duplicados
   - Assim que tudo estiver no Vite, remover `js/` raiz (apenas quando seguro).
   - Atualizar README para refletir novo fluxo (Vite dev/build).
14) Ajustar build e deploy
   - Garantir que `npm run build` gere artefatos equivalentes ao HTML antigo.
   - Se houver deploy estatico, validar paths relativos.

## Riscos e mitigacoes
- Ordem de execucao dos scripts: resolver com imports explicitos ou um entrypoint legacy que importa na ordem correta.
- Dependencias de globals: mapear e tipar antes de modularizar.
- Paths relativos em CSS/HTML: migrar assets para `public/` e ajustar URLs.

## Saidas esperadas
- App Vite funcionando com a mesma interface/engine atual.
- Codigo legacy progressivamente em TS.
- Build moderno com estrutura limpa e facil de manter.
