src/__tests__/engine/EnemyManager.test.ts(96,17): error TS2774: This condition will always return true since this function is always defined. Did you mean to call it instead?
src/__tests__/engine/EnemyManager.test.ts(208,43): error TS2345: Argument of type '{ playing: boolean; game: { roomSize: number; }; getEnemyDefinitions: Mock<() => never[]>; getEnemies: Mock<() => { id: string; type: string; roomIndex: number; x: number; y: number; lastX: number; }[]>; ... 23 more ...; setPlayerPosition: (x: number, y: number, roomIndex: number | null) => void; }' is not assignable to parameter of type 'GameStateLike'.
  The types returned by 'setVariableValue(...)' are incompatible between these types.
    Type 'boolean[]' is not assignable to type '[boolean, (boolean | undefined)?]'.
      Target requires 1 element(s) but source may have fewer.
src/__tests__/GameEngine.test.ts(36,20): error TS2352: Conversion of type 'typeof GameEngine' to type 'GameEngineCtor' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Types of construct signatures are incompatible.
    Type 'new (canvas: HTMLCanvasElement) => GameEngine' is not assignable to type 'new (canvas: HTMLCanvasElement) => GameEngineLike'.
      Construct signature return types 'GameEngine' and 'GameEngineLike' are incompatible.
        The types of 'tileManager.ensureDefaultTiles' are incompatible between these types.
          Type '() => void' is not comparable to type '{ mock: { calls: unknown[]; }; }'.
src/__tests__/GameEngine.test.ts(237,29): error TS2339: Property 'setGameOverCalls' does not exist on type '{ pauseCalls: string[]; resumeCalls: string[]; state: { game: { title: string; }; }; playerRoomIndex?: number | undefined; objectsByRoom: Map<number, unknown[]>; enemyVariableResult: boolean; pickupOverlayActive: boolean; ... 7 more ...; testSettings: { ...; }; }'.
src/__tests__/GameEngine.test.ts(252,29): error TS2339: Property 'setGameOverCalls' does not exist on type '{ pauseCalls: string[]; resumeCalls: string[]; state: { game: { title: string; }; }; playerRoomIndex?: number | undefined; objectsByRoom: Map<number, unknown[]>; enemyVariableResult: boolean; pickupOverlayActive: boolean; ... 7 more ...; testSettings: { ...; }; }'.
src/__tests__/GameState.test.ts(7,27): error TS2352: Conversion of type '{ addEventListener: Mock<Procedure>; }' to type 'Document' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ addEventListener: Mock<Procedure>; }' is missing the following properties from type 'Document': URL, alinkColor, all, anchors, and 258 more.
src/__tests__/renderer/Renderer.test.ts(114,17): error TS2352: Conversion of type '{ imageSmoothingEnabled: true; clearRect: Mock<Procedure>; save: Mock<Procedure>; translate: Mock<Procedure>; fillRect: Mock<Procedure>; restore: Mock<...>; fillText: Mock<...>; strokeRect: Mock<...>; }' to type 'CanvasRenderingContext2D' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ imageSmoothingEnabled: true; clearRect: Mock<Procedure>; save: Mock<Procedure>; translate: Mock<Procedure>; fillRect: Mock<Procedure>; restore: Mock<...>; fillText: Mock<...>; strokeRect: Mock<...>; }' is missing the following properties from type 'CanvasRenderingContext2D': canvas, globalAlpha, globalCompositeOperation, drawImage, and 60 more.
src/__tests__/renderer/Renderer.test.ts(125,20): error TS2352: Conversion of type '{ width: number; height: number; getContext: () => CanvasRenderingContext2D; }' to type 'HTMLCanvasElement' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ width: number; height: number; getContext: () => CanvasRenderingContext2D; }' is missing the following properties from type 'HTMLCanvasElement': captureStream, toBlob, toDataURL, transferControlToOffscreen, and 318 more.
src/__tests__/renderer/Renderer.test.ts(153,30): error TS2352: Conversion of type 'typeof CustomEvent' to type '{ new <T>(type: string, eventInitDict?: CustomEventInit<T> | undefined): CustomEvent<T>; prototype: CustomEvent<any>; }' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Types of property 'prototype' are incompatible.
    Property 'initCustomEvent' is missing in type 'CustomEvent' but required in type 'CustomEvent<any>'.
src/__tests__/renderer/RendererDialogRenderer.test.ts(21,17): error TS2352: Conversion of type '{ fillStyle: string; strokeStyle: string; font: string; fillRect: Mock<Procedure>; strokeRect: Mock<Procedure>; fillText: Mock<(text: string) => number>; measureText: (text: string) => { ...; }; }' to type 'CanvasRenderingContext2D' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ fillStyle: string; strokeStyle: string; font: string; fillRect: Mock<Procedure>; strokeRect: Mock<Procedure>; fillText: Mock<(text: string) => number>; measureText: (text: string) => { ...; }; }' is missing the following properties from type 'CanvasRenderingContext2D': canvas, globalAlpha, globalCompositeOperation, drawImage, and 61 more.
src/__tests__/renderer/RendererEffectsManager.test.ts(33,27): error TS2352: Conversion of type '{ getElementById: Mock<(id: string) => { classList: { add: Mock<Procedure>; remove: Mock<Procedure>; }; setAttribute: Mock<Procedure>; textContent: string; style: { ...; }; offsetWidth: number; } | null>; }' to type 'Document' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ getElementById: Mock<(id: string) => { classList: { add: Mock<Procedure>; remove: Mock<Procedure>; }; setAttribute: Mock<Procedure>; textContent: string; style: { ...; }; offsetWidth: number; } | null>; }' is missing the following properties from type 'Document': URL, alinkColor, all, anchors, and 258 more.
src/__tests__/renderer/RendererEffectsManager.test.ts(70,27): error TS2352: Conversion of type '{ getElementById: Mock<() => null>; }' to type 'Document' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ getElementById: Mock<() => null>; }' is missing the following properties from type 'Document': URL, alinkColor, all, anchors, and 258 more.
src/__tests__/share/ShareDataNormalizer.test.ts(94,23): error TS2339: Property 'endingText' does not exist on type '{ id: string; type: any; roomIndex: any; x: any; y: any; }'.
src/__tests__/share/ShareMatrixCodec.test.ts(32,5): error TS2322: Type '7' is not assignable to type 'null'.
src/__tests__/share/shareTestUtils.ts(40,68): error TS2345: Argument of type '(type?: string | undefined) => string' is not assignable to parameter of type '(type: EnemyTypeInput) => string'.
  Types of parameters 'type' and 'type' are incompatible.
    Type 'EnemyTypeInput' is not assignable to type 'string | undefined'.
      Type 'null' is not assignable to type 'string | undefined'.
src/__tests__/share/ShareUrlHelper.test.ts(27,75): error TS2345: Argument of type '{ title: string; }' is not assignable to parameter of type '{ title: string; author: string; start: { x: number; y: number; roomIndex: any; }; sprites: ({ id: string; type: any; name: any; x: number; y: number; roomIndex: any; text: string; placed: boolean; conditionVariableId: string | null; conditionText: string; rewardVariableId: string | null; conditionalRewardVariableId...'.
  Type '{ title: string; }' is missing the following properties from type '{ title: string; author: string; start: { x: number; y: number; roomIndex: any; }; sprites: ({ id: string; type: any; name: any; x: number; y: number; roomIndex: any; text: string; placed: boolean; conditionVariableId: string | null; conditionText: string; rewardVariableId: string | null; conditionalRewardVariableId...': author, start, sprites, enemies, and 5 more.
src/__tests__/ShareUtils.test.ts(12,24): error TS2345: Argument of type '{ title: string; }' is not assignable to parameter of type '{ title: string; author: string; start: { x: number; y: number; roomIndex: any; }; sprites: ({ id: string; type: any; name: any; x: number; y: number; roomIndex: any; text: string; placed: boolean; conditionVariableId: string | null; conditionText: string; rewardVariableId: string | null; conditionalRewardVariableId...'.
  Type '{ title: string; }' is missing the following properties from type '{ title: string; author: string; start: { x: number; y: number; roomIndex: any; }; sprites: ({ id: string; type: any; name: any; x: number; y: number; roomIndex: any; text: string; placed: boolean; conditionVariableId: string | null; conditionText: string; rewardVariableId: string | null; conditionalRewardVariableId...': author, start, sprites, enemies, and 5 more.
src/__tests__/ShareUtils.test.ts(14,81): error TS2345: Argument of type '{ title: string; }' is not assignable to parameter of type '{ title: string; author: string; start: { x: number; y: number; roomIndex: any; }; sprites: ({ id: string; type: any; name: any; x: number; y: number; roomIndex: any; text: string; placed: boolean; conditionVariableId: string | null; conditionText: string; rewardVariableId: string | null; conditionalRewardVariableId...'.
  Type '{ title: string; }' is missing the following properties from type '{ title: string; author: string; start: { x: number; y: number; roomIndex: any; }; sprites: ({ id: string; type: any; name: any; x: number; y: number; roomIndex: any; text: string; placed: boolean; conditionVariableId: string | null; conditionText: string; rewardVariableId: string | null; conditionalRewardVariableId...': author, start, sprites, enemies, and 5 more.
src/__tests__/smoke/RendererModules.test.ts(29,17): error TS2352: Conversion of type '{ fillRect: () => void; }' to type 'CanvasRenderingContext2D' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ fillRect: () => void; }' is missing the following properties from type 'CanvasRenderingContext2D': canvas, globalAlpha, globalCompositeOperation, drawImage, and 67 more.
src/__tests__/state/StateEnemyManager.test.ts(26,28): error TS2339: Property 'id' does not exist on type 'never'.
src/__tests__/state/StateObjectManager.test.ts(33,28): error TS2339: Property 'type' does not exist on type 'never'.
src/__tests__/state/StateObjectManager.test.ts(34,28): error TS2339: Property 'roomIndex' does not exist on type 'never'.
src/__tests__/TileManager.test.ts(103,9): error TS2774: This condition will always return true since this function is always defined. Did you mean to call it instead?
src/__tests__/TileManager.test.ts(122,14): error TS2790: The operand of a 'delete' operator must be optional.
src/__tests__/TileManager.test.ts(240,21): error TS2339: Property 'animated' does not exist on type 'TileDefinition'.
src/core/GameEngine.ts(152,22): error TS2352: Conversion of type 'GameState' to type 'GameStateLike' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  The types returned by 'setVariableValue(...)' are incompatible between these types.
    Type 'any[]' is not comparable to type '[boolean, unknown?]'.
      Target requires 1 element(s) but source may have fewer.
src/core/GameEngine.ts(153,40): error TS2345: Argument of type 'GameStateLike' is not assignable to parameter of type 'import("C:/repos/tiny-rpg-maker/src/core/tileTypes").GameStateLike'.
  Property 'game' is missing in type 'GameStateLike' but required in type 'import("C:/repos/tiny-rpg-maker/src/core/tileTypes").GameStateLike'.
src/core/GameEngine.ts(156,58): error TS2345: Argument of type 'TileManagerLike' is not assignable to parameter of type 'TileManagerLike'.
  Type 'TileManagerLike' is missing the following properties from type 'TileManagerLike': getAnimationFrameCount, advanceAnimationFrame
src/core/GameEngine.ts(157,44): error TS2345: Argument of type 'GameStateLike' is not assignable to parameter of type 'GameStateLike'.
  Type 'GameStateLike' is missing the following properties from type 'GameStateLike': setDialog, getDialog
src/core/GameEngine.ts(158,54): error TS2345: Argument of type 'GameStateLike' is not assignable to parameter of type 'GameStateLike'.
  Type 'GameStateLike' is missing the following properties from type 'GameStateLike': setPlayerPosition, getRoomIndex
src/core/GameEngine.ts(161,42): error TS2345: Argument of type 'GameStateLike' is not assignable to parameter of type 'GameStateLike'.
  Type 'GameStateLike' is missing the following properties from type 'GameStateLike': playing, getEnemyDefinitions, getEnemies, addEnemy, and 6 more.
src/core/GameEngine.ts(166,7): error TS2740: Type 'GameStateLike' is missing the following properties from type 'GameStateLike': game, getDialog, setDialogPage, getRoomCoords, and 4 more.
src/core/GameEngine.ts(167,7): error TS2741: Property 'getTile' is missing in type 'TileManagerLike' but required in type 'TileManagerLike'.
src/core/GameEngine.ts(168,7): error TS2739: Type 'RendererLike' is missing the following properties from type 'RendererLike': captureGameplayFrame, startRoomTransition, flashEdge
src/core/GameEngine.ts(171,7): error TS2741: Property 'collideAt' is missing in type 'EnemyManagerLike' but required in type 'EnemyManagerLike'.
src/core/GameEngine.ts(173,25): error TS2352: Conversion of type 'InputManager' to type 'InputManagerLike' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Index signature for type 'string' is missing in type 'InputManager'.
src/core/GameEngine.ts(173,42): error TS2345: Argument of type 'this' is not assignable to parameter of type 'GameEngineLike'.
  Type 'GameEngine' is not assignable to type 'GameEngineLike'.
    Types of property 'gameState' are incompatible.
      Type 'GameStateLike' is missing the following properties from type 'GameStateLike': getDialog, setDialogPage
src/core/GameEngine.ts(224,5): error TS2322: Type 'boolean | undefined' is not assignable to type 'boolean'.
  Type 'undefined' is not assignable to type 'boolean'.
src/core/GameEngine.ts(234,5): error TS2322: Type 'boolean | undefined' is not assignable to type 'boolean'.
  Type 'undefined' is not assignable to type 'boolean'.
src/core/GameEngine.ts(246,58): error TS18049: 'overlay' is possibly 'null' or 'undefined'.
src/core/GameEngine.ts(280,48): error TS2322: Type 'number | undefined' is not assignable to type 'number | null'.
  Type 'undefined' is not assignable to type 'number | null'.
src/core/GameEngine.ts(320,46): error TS2322: Type 'number | undefined' is not assignable to type 'number | null'.
  Type 'undefined' is not assignable to type 'number | null'.
src/core/GameEngine.ts(432,24): error TS2722: Cannot invoke an object which is possibly 'undefined'.
src/core/GameEngine.ts(466,24): error TS2722: Cannot invoke an object which is possibly 'undefined'.
src/core/GameEngine.ts(490,46): error TS2345: Argument of type 'number | null' is not assignable to parameter of type 'number'.
  Type 'null' is not assignable to type 'number'.
src/core/GameEngine.ts(512,24): error TS2722: Cannot invoke an object which is possibly 'undefined'.
src/core/GameState.ts(27,14): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(49,14): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(49,38): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(51,14): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(95,14): error TS2551: Property 'testSettings' does not exist on type 'GameState'. Did you mean 'getTestSettings'?
src/core/GameState.ts(97,14): error TS2339: Property 'worldManager' does not exist on type 'GameState'.
src/core/GameState.ts(97,56): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(98,14): error TS2339: Property 'variableManager' does not exist on type 'GameState'.
src/core/GameState.ts(98,62): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(98,73): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(99,14): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(99,58): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(99,69): error TS2339: Property 'worldManager' does not exist on type 'GameState'.
src/core/GameState.ts(99,88): error TS2339: Property 'variableManager' does not exist on type 'GameState'.
src/core/GameState.ts(100,14): error TS2339: Property 'enemyManager' does not exist on type 'GameState'.
src/core/GameState.ts(100,56): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(100,67): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(100,79): error TS2339: Property 'worldManager' does not exist on type 'GameState'.
src/core/GameState.ts(101,14): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(101,56): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(102,14): error TS2339: Property 'playerManager' does not exist on type 'GameState'.
src/core/GameState.ts(102,58): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(102,70): error TS2339: Property 'worldManager' does not exist on type 'GameState'.
src/core/GameState.ts(102,89): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(103,14): error TS2339: Property 'playerManager' does not exist on type 'GameState'.
src/core/GameState.ts(103,51): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(104,14): error TS2339: Property 'dialogManager' does not exist on type 'GameState'.
src/core/GameState.ts(104,58): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(105,14): error TS2339: Property 'itemManager' does not exist on type 'GameState'.
src/core/GameState.ts(105,54): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(106,14): error TS2339: Property 'worldFacade' does not exist on type 'GameState'.
src/core/GameState.ts(106,64): error TS2339: Property 'worldManager' does not exist on type 'GameState'.
src/core/GameState.ts(107,14): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(107,66): error TS2339: Property 'playerManager' does not exist on type 'GameState'.
src/core/GameState.ts(108,14): error TS2339: Property 'screenManager' does not exist on type 'GameState'.
src/core/GameState.ts(109,14): error TS2339: Property 'dataManager' does not exist on type 'GameState'.
src/core/GameState.ts(110,24): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(111,32): error TS2339: Property 'worldManager' does not exist on type 'GameState'.
src/core/GameState.ts(112,33): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(113,35): error TS2339: Property 'variableManager' does not exist on type 'GameState'.
src/core/GameState.ts(115,14): error TS2339: Property 'dataFacade' does not exist on type 'GameState'.
src/core/GameState.ts(115,62): error TS2339: Property 'dataManager' does not exist on type 'GameState'.
src/core/GameState.ts(116,14): error TS2339: Property 'playing' does not exist on type 'GameState'.
src/core/GameState.ts(117,14): error TS2339: Property 'lifecycle' does not exist on type 'GameState'.
src/core/GameState.ts(117,60): error TS2339: Property 'screenManager' does not exist on type 'GameState'.
src/core/GameState.ts(120,14): error TS2339: Property 'reviveSnapshot' does not exist on type 'GameState'.
src/core/GameState.ts(122,14): error TS2551: Property 'editorMode' does not exist on type 'GameState'. Did you mean 'setEditorMode'?
src/core/GameState.ts(131,21): error TS7006: Parameter 'size' implicitly has an 'any' type.
src/core/GameState.ts(132,21): error TS2339: Property 'worldFacade' does not exist on type 'GameState'.
src/core/GameState.ts(135,22): error TS7006: Parameter 'rows' implicitly has an 'any' type.
src/core/GameState.ts(135,28): error TS7006: Parameter 'cols' implicitly has an 'any' type.
src/core/GameState.ts(135,34): error TS7006: Parameter 'size' implicitly has an 'any' type.
src/core/GameState.ts(136,21): error TS2339: Property 'worldFacade' does not exist on type 'GameState'.
src/core/GameState.ts(139,24): error TS7006: Parameter 'size' implicitly has an 'any' type.
src/core/GameState.ts(140,21): error TS2339: Property 'worldFacade' does not exist on type 'GameState'.
src/core/GameState.ts(144,21): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(148,21): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(152,28): error TS2339: Property 'worldManager' does not exist on type 'GameState'.
src/core/GameState.ts(152,61): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(153,14): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(154,21): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(158,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(162,21): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(165,14): error TS7006: Parameter 'skillId' implicitly has an 'any' type.
src/core/GameState.ts(166,21): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(170,21): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(174,21): error TS2339: Property 'playerManager' does not exist on type 'GameState'.
src/core/GameState.ts(178,21): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(182,21): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(189,18): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(189,63): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(190,34): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(198,14): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(200,21): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(204,29): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(209,19): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(212,29): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(214,18): error TS2339: Property 'playerManager' does not exist on type 'GameState'.
src/core/GameState.ts(219,18): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(220,34): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(231,21): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(235,21): error TS2339: Property 'dialogManager' does not exist on type 'GameState'.
src/core/GameState.ts(238,23): error TS7006: Parameter 'x' implicitly has an 'any' type.
src/core/GameState.ts(238,26): error TS7006: Parameter 'y' implicitly has an 'any' type.
src/core/GameState.ts(239,14): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(242,15): error TS7006: Parameter 'active' implicitly has an 'any' type.
src/core/GameState.ts(243,14): error TS2339: Property 'dialogManager' does not exist on type 'GameState'.
src/core/GameState.ts(246,19): error TS7006: Parameter 'page' implicitly has an 'any' type.
src/core/GameState.ts(247,14): error TS2339: Property 'dialogManager' does not exist on type 'GameState'.
src/core/GameState.ts(251,14): error TS2551: Property 'editorMode' does not exist on type 'GameState'. Did you mean 'setEditorMode'?
src/core/GameState.ts(255,29): error TS2551: Property 'editorMode' does not exist on type 'GameState'. Did you mean 'setEditorMode'?
src/core/GameState.ts(267,19): error TS2551: Property 'testSettings' does not exist on type 'GameState'. Did you mean 'getTestSettings'?
src/core/GameState.ts(268,18): error TS2551: Property 'testSettings' does not exist on type 'GameState'. Did you mean 'getTestSettings'?
src/core/GameState.ts(271,46): error TS2551: Property 'testSettings' does not exist on type 'GameState'. Did you mean 'getTestSettings'?
src/core/GameState.ts(272,35): error TS2551: Property 'testSettings' does not exist on type 'GameState'. Did you mean 'getTestSettings'?
src/core/GameState.ts(274,40): error TS2551: Property 'testSettings' does not exist on type 'GameState'. Did you mean 'getTestSettings'?
src/core/GameState.ts(274,68): error TS2551: Property 'testSettings' does not exist on type 'GameState'. Did you mean 'getTestSettings'?
src/core/GameState.ts(275,35): error TS2551: Property 'testSettings' does not exist on type 'GameState'. Did you mean 'getTestSettings'?
src/core/GameState.ts(281,31): error TS2339: Property 'playerManager' does not exist on type 'GameState'.
src/core/GameState.ts(282,53): error TS2339: Property 'startLevel' does not exist on type '{}'.
src/core/GameState.ts(283,66): error TS2339: Property 'startLevel' does not exist on type '{}'.
src/core/GameState.ts(290,56): error TS2339: Property 'skills' does not exist on type '{}'.
src/core/GameState.ts(291,24): error TS2339: Property 'skills' does not exist on type '{}'.
src/core/GameState.ts(292,23): error TS7006: Parameter 'id' implicitly has an 'any' type.
src/core/GameState.ts(293,26): error TS7006: Parameter 'id' implicitly has an 'any' type.
src/core/GameState.ts(296,34): error TS2339: Property 'godMode' does not exist on type '{}'.
src/core/GameState.ts(296,75): error TS2339: Property 'godMode' does not exist on type '{}'.
src/core/GameState.ts(298,14): error TS2551: Property 'testSettings' does not exist on type 'GameState'. Did you mean 'getTestSettings'?
src/core/GameState.ts(305,18): error TS2339: Property 'playerManager' does not exist on type 'GameState'.
src/core/GameState.ts(306,18): error TS2339: Property 'playerManager' does not exist on type 'GameState'.
src/core/GameState.ts(309,50): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(311,14): error TS2339: Property 'playerManager' does not exist on type 'GameState'.
src/core/GameState.ts(312,14): error TS2339: Property 'playerManager' does not exist on type 'GameState'.
src/core/GameState.ts(316,14): error TS2339: Property 'screenManager' does not exist on type 'GameState'.
src/core/GameState.ts(317,14): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(318,14): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(319,14): error TS2339: Property 'dialogManager' does not exist on type 'GameState'.
src/core/GameState.ts(320,14): error TS2339: Property 'enemyManager' does not exist on type 'GameState'.
src/core/GameState.ts(321,14): error TS2339: Property 'variableManager' does not exist on type 'GameState'.
src/core/GameState.ts(322,14): error TS2339: Property 'itemManager' does not exist on type 'GameState'.
src/core/GameState.ts(323,14): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(324,14): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(334,21): error TS2339: Property 'dataFacade' does not exist on type 'GameState'.
src/core/GameState.ts(337,20): error TS7006: Parameter 'data' implicitly has an 'any' type.
src/core/GameState.ts(338,14): error TS2339: Property 'dataFacade' does not exist on type 'GameState'.
src/core/GameState.ts(341,20): error TS7006: Parameter 'rooms' implicitly has an 'any' type.
src/core/GameState.ts(341,27): error TS7006: Parameter 'totalRooms' implicitly has an 'any' type.
src/core/GameState.ts(341,39): error TS7006: Parameter 'cols' implicitly has an 'any' type.
src/core/GameState.ts(342,21): error TS2339: Property 'worldFacade' does not exist on type 'GameState'.
src/core/GameState.ts(345,23): error TS7006: Parameter 'source' implicitly has an 'any' type.
src/core/GameState.ts(345,31): error TS7006: Parameter 'totalRooms' implicitly has an 'any' type.
src/core/GameState.ts(346,21): error TS2339: Property 'worldFacade' does not exist on type 'GameState'.
src/core/GameState.ts(349,22): error TS7006: Parameter 'objects' implicitly has an 'any' type.
src/core/GameState.ts(350,21): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(353,18): error TS7006: Parameter 'enemies' implicitly has an 'any' type.
src/core/GameState.ts(354,21): error TS2339: Property 'enemyManager' does not exist on type 'GameState'.
src/core/GameState.ts(357,22): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/GameState.ts(357,28): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/core/GameState.ts(358,21): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(362,21): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(365,23): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/core/GameState.ts(366,21): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(369,17): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/core/GameState.ts(369,28): error TS7006: Parameter 'x' implicitly has an 'any' type.
src/core/GameState.ts(369,31): error TS7006: Parameter 'y' implicitly has an 'any' type.
src/core/GameState.ts(370,21): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(373,23): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/GameState.ts(373,29): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/core/GameState.ts(373,40): error TS7006: Parameter 'x' implicitly has an 'any' type.
src/core/GameState.ts(373,43): error TS7006: Parameter 'y' implicitly has an 'any' type.
src/core/GameState.ts(374,21): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(377,18): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/GameState.ts(377,24): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/core/GameState.ts(378,14): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(381,23): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/GameState.ts(381,29): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/core/GameState.ts(381,40): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/core/GameState.ts(382,21): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(385,22): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/core/GameState.ts(385,33): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/GameState.ts(386,21): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(390,21): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(394,21): error TS2339: Property 'screenManager' does not exist on type 'GameState'.
src/core/GameState.ts(398,21): error TS2339: Property 'screenManager' does not exist on type 'GameState'.
src/core/GameState.ts(402,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(406,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(410,28): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(416,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(420,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(424,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(428,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(432,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(436,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(440,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(444,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(448,21): error TS2339: Property 'variableManager' does not exist on type 'GameState'.
src/core/GameState.ts(451,20): error TS7006: Parameter 'list' implicitly has an 'any' type.
src/core/GameState.ts(452,21): error TS2339: Property 'variableManager' does not exist on type 'GameState'.
src/core/GameState.ts(455,24): error TS7006: Parameter 'source' implicitly has an 'any' type.
src/core/GameState.ts(456,21): error TS2339: Property 'variableManager' does not exist on type 'GameState'.
src/core/GameState.ts(460,21): error TS2339: Property 'variableManager' does not exist on type 'GameState'.
src/core/GameState.ts(464,21): error TS2339: Property 'variableManager' does not exist on type 'GameState'.
src/core/GameState.ts(467,25): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/core/GameState.ts(468,21): error TS2339: Property 'variableManager' does not exist on type 'GameState'.
src/core/GameState.ts(471,17): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/core/GameState.ts(472,21): error TS2339: Property 'variableManager' does not exist on type 'GameState'.
src/core/GameState.ts(475,18): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/core/GameState.ts(476,21): error TS2339: Property 'variableManager' does not exist on type 'GameState'.
src/core/GameState.ts(479,22): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/core/GameState.ts(479,34): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/GameState.ts(480,30): error TS2339: Property 'variableManager' does not exist on type 'GameState'.
src/core/GameState.ts(483,36): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(484,18): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(490,21): error TS2339: Property 'enemyManager' does not exist on type 'GameState'.
src/core/GameState.ts(494,21): error TS2339: Property 'enemyManager' does not exist on type 'GameState'.
src/core/GameState.ts(497,20): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/GameState.ts(498,21): error TS2339: Property 'worldManager' does not exist on type 'GameState'.
src/core/GameState.ts(501,21): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/GameState.ts(502,21): error TS2339: Property 'worldManager' does not exist on type 'GameState'.
src/core/GameState.ts(506,21): error TS2339: Property 'worldManager' does not exist on type 'GameState'.
src/core/GameState.ts(510,21): error TS2339: Property 'worldManager' does not exist on type 'GameState'.
src/core/GameState.ts(513,19): error TS7006: Parameter 'index' implicitly has an 'any' type.
src/core/GameState.ts(514,21): error TS2339: Property 'worldManager' does not exist on type 'GameState'.
src/core/GameState.ts(517,18): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/core/GameState.ts(517,23): error TS7006: Parameter 'col' implicitly has an 'any' type.
src/core/GameState.ts(518,21): error TS2339: Property 'worldManager' does not exist on type 'GameState'.
src/core/GameState.ts(521,14): error TS7006: Parameter 'enemy' implicitly has an 'any' type.
src/core/GameState.ts(522,21): error TS2339: Property 'enemyManager' does not exist on type 'GameState'.
src/core/GameState.ts(525,17): error TS7006: Parameter 'enemyId' implicitly has an 'any' type.
src/core/GameState.ts(526,14): error TS2339: Property 'enemyManager' does not exist on type 'GameState'.
src/core/GameState.ts(529,22): error TS7006: Parameter 'enemyId' implicitly has an 'any' type.
src/core/GameState.ts(529,31): error TS7006: Parameter 'x' implicitly has an 'any' type.
src/core/GameState.ts(529,34): error TS7006: Parameter 'y' implicitly has an 'any' type.
src/core/GameState.ts(530,14): error TS2339: Property 'enemyManager' does not exist on type 'GameState'.
src/core/GameState.ts(533,22): error TS7006: Parameter 'enemyId' implicitly has an 'any' type.
src/core/GameState.ts(535,21): error TS2339: Property 'enemyManager' does not exist on type 'GameState'.
src/core/GameState.ts(539,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(543,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(547,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(551,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(555,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(559,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(563,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(567,21): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(571,29): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(576,29): error TS2339: Property 'playerFacade' does not exist on type 'GameState'.
src/core/GameState.ts(581,21): error TS2339: Property 'leveledUp' does not exist on type 'never'.
src/core/GameState.ts(582,48): error TS2339: Property 'level' does not exist on type 'never'.
src/core/GameState.ts(583,51): error TS2339: Property 'levelsGained' does not exist on type 'never'.
src/core/GameState.ts(584,49): error TS2339: Property 'levelsGained' does not exist on type 'never'.
src/core/GameState.ts(586,53): error TS2339: Property 'level' does not exist on type 'never'.
src/core/GameState.ts(592,19): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(593,18): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(601,21): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(607,32): error TS2339: Property 'name' does not exist on type '{}'.
src/core/GameState.ts(607,48): error TS2339: Property 'title' does not exist on type '{}'.
src/core/GameState.ts(608,39): error TS2339: Property 'spriteGroup' does not exist on type '{}'.
src/core/GameState.ts(609,38): error TS2339: Property 'spriteType' does not exist on type '{}'.
src/core/GameState.ts(610,41): error TS2339: Property 'effect' does not exist on type '{}'.
src/core/GameState.ts(610,73): error TS2339: Property 'effect' does not exist on type '{}'.
src/core/GameState.ts(638,19): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(639,18): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(647,21): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(652,78): error TS2345: Argument of type 'null' is not assignable to parameter of type 'number'.
src/core/GameState.ts(656,54): error TS2339: Property 'durationMs' does not exist on type '{}'.
src/core/GameState.ts(657,48): error TS2339: Property 'durationMs' does not exist on type '{}'.
src/core/GameState.ts(697,14): error TS2339: Property 'screenManager' does not exist on type 'GameState'.
src/core/GameState.ts(698,14): error TS2339: Property 'screenManager' does not exist on type 'GameState'.
src/core/GameState.ts(702,19): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(705,14): error TS2339: Property 'reviveSnapshot' does not exist on type 'GameState'.
src/core/GameState.ts(706,29): error TS2339: Property 'reviveSnapshot' does not exist on type 'GameState'.
src/core/GameState.ts(710,29): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(710,77): error TS2339: Property 'reviveSnapshot' does not exist on type 'GameState'.
src/core/GameState.ts(715,58): error TS2339: Property 'reviveSnapshot' does not exist on type 'GameState'.
src/core/GameState.ts(716,14): error TS2339: Property 'reviveSnapshot' does not exist on type 'GameState'.
src/core/GameState.ts(720,31): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(724,18): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(725,51): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(726,47): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(728,18): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(729,18): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(731,14): error TS2339: Property 'lifecycle' does not exist on type 'GameState'.
src/core/GameState.ts(732,14): error TS2339: Property 'lifecycle' does not exist on type 'GameState'.
src/core/GameState.ts(733,14): error TS2339: Property 'screenManager' does not exist on type 'GameState'.
src/core/GameState.ts(738,14): error TS2339: Property 'reviveSnapshot' does not exist on type 'GameState'.
src/core/GameState.ts(739,14): error TS2339: Property 'skillManager' does not exist on type 'GameState'.
src/core/GameState.ts(744,50): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(745,51): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(754,24): error TS2339: Property 'game' does not exist on type 'never'.
src/core/GameState.ts(754,43): error TS2339: Property 'state' does not exist on type 'never'.
src/core/GameState.ts(756,34): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(756,49): error TS2339: Property 'game' does not exist on type 'never'.
src/core/GameState.ts(757,34): error TS2339: Property 'state' does not exist on type 'GameState'.
src/core/GameState.ts(757,50): error TS2339: Property 'state' does not exist on type 'never'.
src/core/GameState.ts(758,18): error TS2339: Property 'worldManager' does not exist on type 'GameState'.
src/core/GameState.ts(758,46): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(759,18): error TS2339: Property 'objectManager' does not exist on type 'GameState'.
src/core/GameState.ts(759,47): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(760,18): error TS2339: Property 'variableManager' does not exist on type 'GameState'.
src/core/GameState.ts(760,49): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(761,18): error TS2339: Property 'itemManager' does not exist on type 'GameState'.
src/core/GameState.ts(761,45): error TS2339: Property 'game' does not exist on type 'GameState'.
src/core/GameState.ts(769,16): error TS7006: Parameter 'target' implicitly has an 'any' type.
src/core/GameState.ts(769,24): error TS7006: Parameter 'source' implicitly has an 'any' type.
src/core/GameState.ts(779,15): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/GameState.ts(787,14): error TS2339: Property 'lifecycle' does not exist on type 'GameState'.
src/core/GameState.ts(791,14): error TS2339: Property 'lifecycle' does not exist on type 'GameState'.
src/core/GameState.ts(795,14): error TS2339: Property 'lifecycle' does not exist on type 'GameState'.
src/core/GameState.ts(799,21): error TS2339: Property 'lifecycle' does not exist on type 'GameState'.
src/core/GameState.ts(803,21): error TS2339: Property 'lifecycle' does not exist on type 'GameState'.
src/core/GameState.ts(807,21): error TS2339: Property 'screenManager' does not exist on type 'GameState'.
src/core/NPCDefinitions.ts(309,29): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/NPCDefinitions.ts(313,29): error TS7006: Parameter 'variant' implicitly has an 'any' type.
src/core/NPCManager.ts(9,27): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/NPCManager.ts(17,27): error TS7006: Parameter 'key' implicitly has an 'any' type.
src/core/NPCManager.ts(22,32): error TS7006: Parameter 'def' implicitly has an 'any' type.
src/core/NPCManager.ts(30,32): error TS7006: Parameter 'def' implicitly has an 'any' type.
src/core/NPCManager.ts(43,27): error TS7006: Parameter 'npc' implicitly has an 'any' type.
src/core/NPCManager.ts(43,32): error TS7006: Parameter 'def' implicitly has an 'any' type.
src/core/NPCManager.ts(80,16): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/NPCManager.ts(80,23): error TS7006: Parameter 'min' implicitly has an 'any' type.
src/core/NPCManager.ts(80,28): error TS7006: Parameter 'max' implicitly has an 'any' type.
src/core/NPCManager.ts(80,33): error TS7006: Parameter 'fallback' implicitly has an 'any' type.
src/core/NPCManager.ts(85,28): error TS7006: Parameter 'id' implicitly has an 'any' type.
src/core/NPCManager.ts(92,29): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/NPCManager.ts(98,30): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/NPCManager.ts(112,17): error TS7006: Parameter 'gameState' implicitly has an 'any' type.
src/core/NPCManager.ts(113,14): error TS2339: Property 'gameState' does not exist on type 'NPCManager'.
src/core/NPCManager.ts(125,21): error TS2339: Property 'gameState' does not exist on type 'NPCManager'.
src/core/NPCManager.ts(128,12): error TS7006: Parameter 'npcId' implicitly has an 'any' type.
src/core/NPCManager.ts(129,21): error TS2339: Property 'gameState' does not exist on type 'NPCManager'.
src/core/NPCManager.ts(129,50): error TS7006: Parameter 's' implicitly has an 'any' type.
src/core/NPCManager.ts(132,18): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/NPCManager.ts(133,21): error TS2339: Property 'gameState' does not exist on type 'NPCManager'.
src/core/NPCManager.ts(133,50): error TS7006: Parameter 's' implicitly has an 'any' type.
src/core/NPCManager.ts(141,32): error TS2339: Property 'gameState' does not exist on type 'NPCManager'.
src/core/NPCManager.ts(153,14): error TS2339: Property 'gameState' does not exist on type 'NPCManager'.
src/core/NPCManager.ts(154,21): error TS2339: Property 'gameState' does not exist on type 'NPCManager'.
src/core/NPCManager.ts(157,18): error TS7006: Parameter 'npc' implicitly has an 'any' type.
src/core/NPCManager.ts(169,48): error TS2339: Property 'gameState' does not exist on type 'NPCManager'.
src/core/NPCManager.ts(181,42): error TS2339: Property 'gameState' does not exist on type 'NPCManager'.
src/core/NPCManager.ts(183,39): error TS2339: Property 'gameState' does not exist on type 'NPCManager'.
src/core/NPCManager.ts(184,50): error TS2339: Property 'gameState' does not exist on type 'NPCManager'.
src/core/NPCManager.ts(206,26): error TS7006: Parameter 'def' implicitly has an 'any' type.
src/core/NPCManager.ts(238,12): error TS7006: Parameter 'data' implicitly has an 'any' type.
src/core/NPCManager.ts(262,14): error TS2339: Property 'gameState' does not exist on type 'NPCManager'.
src/core/NPCManager.ts(266,15): error TS7006: Parameter 'npcId' implicitly has an 'any' type.
src/core/NPCManager.ts(266,22): error TS7006: Parameter 'data' implicitly has an 'any' type.
src/core/NPCManager.ts(273,15): error TS7006: Parameter 'npcId' implicitly has an 'any' type.
src/core/NPCManager.ts(283,20): error TS7006: Parameter 'npcId' implicitly has an 'any' type.
src/core/NPCManager.ts(283,27): error TS7006: Parameter 'x' implicitly has an 'any' type.
src/core/NPCManager.ts(283,30): error TS7006: Parameter 'y' implicitly has an 'any' type.
src/core/NPCManager.ts(292,52): error TS2339: Property 'gameState' does not exist on type 'NPCManager'.
src/core/NPCManager.ts(300,21): error TS7006: Parameter 'npcId' implicitly has an 'any' type.
src/core/NPCManager.ts(300,28): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(158,32): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(163,19): error TS2551: Property '_behaviorMap' does not exist on type 'typeof ObjectDefinitions'. Did you mean 'behaviorMap'?
src/core/ObjectDefinitions.ts(173,39): error TS2345: Argument of type 'number | undefined' is not assignable to parameter of type 'number'.
  Type 'undefined' is not assignable to type 'number'.
src/core/ObjectDefinitions.ts(177,18): error TS2551: Property '_behaviorMap' does not exist on type 'typeof ObjectDefinitions'. Did you mean 'behaviorMap'?
src/core/ObjectDefinitions.ts(179,21): error TS2551: Property '_behaviorMap' does not exist on type 'typeof ObjectDefinitions'. Did you mean 'behaviorMap'?
src/core/ObjectDefinitions.ts(182,20): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(187,19): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(187,25): error TS7006: Parameter 'tag' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(194,26): error TS7006: Parameter 'tag' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(197,15): error TS7034: Variable 'result' implicitly has type 'any[]' in some locations where its type cannot be determined.
src/core/ObjectDefinitions.ts(203,16): error TS7005: Variable 'result' implicitly has an 'any[]' type.
src/core/ObjectDefinitions.ts(242,26): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(246,36): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(250,33): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(254,39): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(258,30): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(262,29): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(266,19): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(270,27): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(274,25): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(278,21): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(282,26): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(286,24): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/ObjectDefinitions.ts(290,31): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/Renderer.ts(105,100): error TS2345: Argument of type 'TileManagerLike' is not assignable to parameter of type 'TileManagerLike'.
  Property 'getTile' is missing in type 'TileManagerLike' but required in type 'TileManagerLike'.
src/core/Renderer.ts(106,54): error TS2345: Argument of type 'RendererGameState' is not assignable to parameter of type 'RendererGameState'.
  Property 'getCurrentRoom' is missing in type 'RendererGameState' but required in type 'RendererGameState'.
src/core/Renderer.ts(107,58): error TS2345: Argument of type 'RendererGameState' is not assignable to parameter of type 'GameStateLike'.
  Type 'RendererGameState' is missing the following properties from type 'GameStateLike': getGame, getPlayer
src/core/Renderer.ts(109,58): error TS2345: Argument of type 'RendererGameState' is not assignable to parameter of type 'DialogGameState'.
  Property 'getDialog' is missing in type 'RendererGameState' but required in type 'DialogGameState'.
src/core/Renderer.ts(110,52): error TS2345: Argument of type 'RendererGameState' is not assignable to parameter of type 'GameStateLike'.
  Type 'RendererGameState' is missing the following properties from type 'GameStateLike': getMaxKeys, getKeys, getDamageShield, getDamageShieldMax
src/core/Renderer.ts(111,58): error TS2345: Argument of type 'this' is not assignable to parameter of type 'RendererLike'.
  Type 'Renderer' is not assignable to type 'RendererLike'.
    Types of property 'gameEngine' are incompatible.
      Type 'RendererEngine | null' is not assignable to type 'Record<string, unknown> | undefined'.
        Type 'null' is not assignable to type 'Record<string, unknown> | undefined'.
src/core/Renderer.ts(112,64): error TS2345: Argument of type 'this' is not assignable to parameter of type 'RendererLike'.
  Type 'Renderer' is not assignable to type 'RendererLike'.
    Types of property 'gameEngine' are incompatible.
      Type 'RendererEngine | null' is not assignable to type 'Record<string, unknown> | undefined'.
        Type 'null' is not assignable to type 'Record<string, unknown> | undefined'.
src/core/Renderer.ts(113,60): error TS2345: Argument of type 'this' is not assignable to parameter of type 'RendererLike'.
  Type 'Renderer' is not assignable to type 'RendererLike'.
    Types of property 'gameEngine' are incompatible.
      Type 'RendererEngine | null' is not assignable to type 'Record<string, unknown> | undefined'.
        Type 'null' is not assignable to type 'Record<string, unknown> | undefined'.
src/core/Renderer.ts(117,9): error TS2719: Type 'SpriteMap' is not assignable to type 'SpriteMap'. Two different types with this name exist, but they are unrelated.
  'string' index signatures are incompatible.
    Type 'SpriteOrNull' is not assignable to type 'SpriteMatrix'.
      Type 'null' is not assignable to type '(string | null)[][]'.
src/core/Renderer.ts(118,9): error TS2719: Type 'SpriteMap' is not assignable to type 'SpriteMap'. Two different types with this name exist, but they are unrelated.
  'string' index signatures are incompatible.
    Type 'SpriteOrNull' is not assignable to type 'SpriteMatrix'.
      Type 'null' is not assignable to type '(string | null)[][]'.
src/core/Renderer.ts(120,9): error TS2719: Type 'SpriteMap' is not assignable to type 'SpriteMap'. Two different types with this name exist, but they are unrelated.
  'string' index signatures are incompatible.
    Type 'SpriteOrNull' is not assignable to type 'SpriteMatrix'.
      Type 'null' is not assignable to type '(string | null)[][]'.
src/core/Renderer.ts(357,9): error TS2719: Type 'SpriteMap' is not assignable to type 'SpriteMap'. Two different types with this name exist, but they are unrelated.
  'string' index signatures are incompatible.
    Type 'SpriteOrNull' is not assignable to type 'SpriteMatrix'.
      Type 'null' is not assignable to type '(string | null)[][]'.
src/core/Renderer.ts(362,9): error TS2719: Type 'SpriteMap' is not assignable to type 'SpriteMap'. Two different types with this name exist, but they are unrelated.
  'string' index signatures are incompatible.
    Type 'SpriteOrNull' is not assignable to type 'SpriteMatrix'.
      Type 'null' is not assignable to type '(string | null)[][]'.
src/core/Renderer.ts(368,9): error TS2719: Type 'SpriteMap' is not assignable to type 'SpriteMap'. Two different types with this name exist, but they are unrelated.
  'string' index signatures are incompatible.
    Type 'SpriteOrNull' is not assignable to type 'SpriteMatrix'.
      Type 'null' is not assignable to type '(string | null)[][]'.
src/core/renderer/RendererCanvasHelper.ts(40,51): error TS2345: Argument of type 'TileDefinition | null' is not assignable to parameter of type 'TileDefinition'.
  Type 'null' is not assignable to type 'TileDefinition'.
src/core/renderer/RendererEffectsManager.ts(48,27): error TS2345: Argument of type 'number | undefined' is not assignable to parameter of type 'number'.
  Type 'undefined' is not assignable to type 'number'.
src/core/renderer/RendererEffectsManager.ts(77,28): error TS2345: Argument of type 'number | undefined' is not assignable to parameter of type 'number'.
  Type 'undefined' is not assignable to type 'number'.
src/core/renderer/RendererEffectsManager.ts(103,28): error TS2345: Argument of type 'number | undefined' is not assignable to parameter of type 'number'.
  Type 'undefined' is not assignable to type 'number'.
src/core/renderer/RendererEffectsManager.ts(110,36): error TS2345: Argument of type 'number | null | undefined' is not assignable to parameter of type 'number'.
  Type 'undefined' is not assignable to type 'number'.
src/core/renderer/RendererEffectsManager.ts(133,38): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererEffectsManager.ts(136,29): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/renderer/RendererEffectsManager.ts(140,24): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererEntityRenderer.ts(115,67): error TS2345: Argument of type 'number | undefined' is not assignable to parameter of type 'number'.
  Type 'undefined' is not assignable to type 'number'.
src/core/renderer/RendererEntityRenderer.ts(132,58): error TS2345: Argument of type 'number | undefined' is not assignable to parameter of type 'number'.
  Type 'undefined' is not assignable to type 'number'.
src/core/renderer/RendererEntityRenderer.ts(299,6): error TS6196: 'EnemyDefinitionLike' is declared but never used.
src/core/renderer/RendererHudRenderer.ts(97,61): error TS2345: Argument of type 'number | undefined' is not assignable to parameter of type 'number'.
  Type 'undefined' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(174,64): error TS2345: Argument of type 'number | undefined' is not assignable to parameter of type 'number'.
  Type 'undefined' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(176,38): error TS2345: Argument of type 'number | undefined' is not assignable to parameter of type 'number'.
  Type 'undefined' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(179,62): error TS18048: 'options.heartSize' is possibly 'undefined'.
src/core/renderer/RendererHudRenderer.ts(181,15): error TS2722: Cannot invoke an object which is possibly 'undefined'.
src/core/renderer/RendererHudRenderer.ts(182,32): error TS2345: Argument of type 'number | undefined' is not assignable to parameter of type 'number'.
  Type 'undefined' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(191,24): error TS18048: 'offsetX' is possibly 'undefined'.
src/core/renderer/RendererHudRenderer.ts(192,24): error TS18048: 'offsetY' is possibly 'undefined'.
src/core/renderer/RendererHudRenderer.ts(193,47): error TS2345: Argument of type '(number | null)[][]' is not assignable to parameter of type '(string | null)[][]'.
  Type '(number | null)[]' is not assignable to type '(string | null)[]'.
    Type 'number | null' is not assignable to type 'string | null'.
      Type 'number' is not assignable to type 'string'.
src/core/renderer/RendererHudRenderer.ts(248,43): error TS18048: 'xpNeeded' is possibly 'undefined'.
src/core/renderer/RendererHudRenderer.ts(260,27): error TS2532: Object is possibly 'undefined'.
src/core/renderer/RendererHudRenderer.ts(260,27): error TS2722: Cannot invoke an object which is possibly 'undefined'.
src/core/renderer/RendererHudRenderer.ts(262,53): error TS18048: 'xpNeeded' is possibly 'undefined'.
src/core/renderer/RendererHudRenderer.ts(280,30): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(280,34): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(280,44): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(280,48): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(281,24): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(281,28): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(281,32): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(281,36): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(281,40): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(281,44): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(281,50): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(282,24): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(282,28): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(282,32): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(282,36): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(282,40): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(282,44): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(282,48): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(283,30): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(283,34): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(283,38): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(283,42): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(283,46): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(284,36): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(284,40): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(284,44): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(285,42): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(290,30): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(290,34): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(290,44): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(290,48): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(291,24): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(291,38): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(291,52): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(292,24): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(292,53): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(293,30): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(293,49): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(294,36): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(294,45): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererHudRenderer.ts(295,42): error TS2322: Type 'string' is not assignable to type 'number'.
src/core/renderer/RendererOverlayRenderer.ts(36,9): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererOverlayRenderer.ts(71,40): error TS2349: This expression is not callable.
  Type '{}' has no call signatures.
src/core/renderer/RendererOverlayRenderer.ts(73,9): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererOverlayRenderer.ts(79,52): error TS2349: This expression is not callable.
  Type '{}' has no call signatures.
src/core/renderer/RendererOverlayRenderer.ts(80,24): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererOverlayRenderer.ts(81,30): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererOverlayRenderer.ts(159,30): error TS18047: 'computedTitleFont' is possibly 'null'.
src/core/renderer/RendererOverlayRenderer.ts(161,22): error TS18047: 'computedPendingFont' is possibly 'null'.
src/core/renderer/RendererOverlayRenderer.ts(197,34): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererOverlayRenderer.ts(197,84): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererOverlayRenderer.ts(287,40): error TS2349: This expression is not callable.
  Type '{}' has no call signatures.
src/core/renderer/RendererOverlayRenderer.ts(293,9): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererOverlayRenderer.ts(310,24): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererOverlayRenderer.ts(330,40): error TS2349: This expression is not callable.
  Type '{}' has no call signatures.
src/core/renderer/RendererOverlayRenderer.ts(367,13): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererOverlayRenderer.ts(376,39): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererOverlayRenderer.ts(440,33): error TS2349: This expression is not callable.
  Type '{}' has no call signatures.
src/core/renderer/RendererOverlayRenderer.ts(442,32): error TS2339: Property 'draw' does not exist on type 'RendererLike'.
src/core/renderer/RendererOverlayRenderer.ts(446,28): error TS2339: Property 'draw' does not exist on type 'RendererLike'.
src/core/renderer/RendererOverlayRenderer.ts(460,33): error TS2349: This expression is not callable.
  Type '{}' has no call signatures.
src/core/renderer/RendererOverlayRenderer.ts(465,28): error TS2339: Property 'draw' does not exist on type 'RendererLike'.
src/core/renderer/RendererOverlayRenderer.ts(520,33): error TS18046: 'factory.getObjectSprites' is of type 'unknown'.
src/core/renderer/RendererOverlayRenderer.ts(531,9): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererOverlayRenderer.ts(535,24): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererOverlayRenderer.ts(538,16): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererOverlayRenderer.ts(556,32): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/renderer/RendererOverlayRenderer.ts(557,80): error TS7006: Parameter 'section' implicitly has an 'any' type.
src/core/renderer/RendererOverlayRenderer.ts(559,23): error TS7034: Variable 'lines' implicitly has type 'any[]' in some locations where its type cannot be determined.
src/core/renderer/RendererOverlayRenderer.ts(560,35): error TS7006: Parameter 'section' implicitly has an 'any' type.
src/core/renderer/RendererOverlayRenderer.ts(560,44): error TS7006: Parameter 'index' implicitly has an 'any' type.
src/core/renderer/RendererOverlayRenderer.ts(563,36): error TS7006: Parameter 'word' implicitly has an 'any' type.
src/core/renderer/RendererOverlayRenderer.ts(579,39): error TS7005: Variable 'lines' implicitly has an 'any[]' type.
src/core/renderer/RendererOverlayRenderer.ts(620,44): error TS2349: This expression is not callable.
  Type '{}' has no call signatures.
src/core/renderer/RendererPalette.ts(18,9): error TS4104: The type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.
src/core/renderer/RendererTransitionManager.ts(57,29): error TS2345: Argument of type 'number | undefined' is not assignable to parameter of type 'number'.
  Type 'undefined' is not assignable to type 'number'.
src/core/renderer/RendererTransitionManager.ts(80,9): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererTransitionManager.ts(82,23): error TS2339: Property 'draw' does not exist on type 'RendererLike'.
src/core/renderer/RendererTransitionManager.ts(97,27): error TS2339: Property 'draw' does not exist on type 'RendererLike'.
src/core/renderer/RendererTransitionManager.ts(108,31): error TS2532: Object is possibly 'undefined'.
src/core/renderer/RendererTransitionManager.ts(109,50): error TS2532: Object is possibly 'undefined'.
src/core/renderer/RendererTransitionManager.ts(147,25): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererTransitionManager.ts(147,54): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererTransitionManager.ts(149,23): error TS2345: Argument of type 'HTMLCanvasElement | undefined' is not assignable to parameter of type 'CanvasImageSource'.
  Type 'undefined' is not assignable to type 'CanvasImageSource'.
src/core/renderer/RendererTransitionManager.ts(150,23): error TS2345: Argument of type 'HTMLCanvasElement | undefined' is not assignable to parameter of type 'CanvasImageSource'.
  Type 'undefined' is not assignable to type 'CanvasImageSource'.
src/core/renderer/RendererTransitionManager.ts(167,16): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererTransitionManager.ts(168,22): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererTransitionManager.ts(169,25): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererTransitionManager.ts(182,22): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererTransitionManager.ts(188,22): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererTransitionManager.ts(190,9): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererTransitionManager.ts(194,25): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererTransitionManager.ts(209,24): error TS2571: Object is of type 'unknown'.
src/core/renderer/RendererTransitionManager.ts(229,9): error TS2571: Object is of type 'unknown'.
src/core/share/ShareBase64.ts(3,24): error TS7006: Parameter 'bytes' implicitly has an 'any' type.
src/core/share/ShareBase64.ts(5,20): error TS2591: Cannot find name 'Buffer'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
src/core/share/ShareBase64.ts(6,20): error TS2591: Cannot find name 'Buffer'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
src/core/share/ShareBase64.ts(22,26): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/share/ShareBase64.ts(27,25): error TS2554: Expected 2 arguments, but got 1.
src/core/share/ShareBase64.ts(34,24): error TS2591: Cannot find name 'Buffer'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
src/core/share/ShareBase64.ts(35,40): error TS2591: Cannot find name 'Buffer'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
src/core/share/ShareBase64.ts(49,28): error TS7006: Parameter 'input' implicitly has an 'any' type.
src/core/share/ShareBase64.ts(49,35): error TS7006: Parameter 'error' implicitly has an 'any' type.
src/core/share/ShareConstants.ts(175,19): error TS2551: Property '_supportedVersions' does not exist on type 'typeof ShareConstants'. Did you mean 'SUPPORTED_VERSIONS'?
src/core/share/ShareConstants.ts(176,18): error TS2551: Property '_supportedVersions' does not exist on type 'typeof ShareConstants'. Did you mean 'SUPPORTED_VERSIONS'?
src/core/share/ShareConstants.ts(198,21): error TS2551: Property '_supportedVersions' does not exist on type 'typeof ShareConstants'. Did you mean 'SUPPORTED_VERSIONS'?
src/core/share/ShareConstants.ts(202,19): error TS2551: Property '_npcDefinitions' does not exist on type 'typeof ShareConstants'. Did you mean 'NPC_DEFINITIONS'?
src/core/share/ShareConstants.ts(202,44): error TS2551: Property '_npcDefinitions' does not exist on type 'typeof ShareConstants'. Did you mean 'NPC_DEFINITIONS'?
src/core/share/ShareConstants.ts(203,18): error TS2551: Property '_npcDefinitions' does not exist on type 'typeof ShareConstants'. Did you mean 'NPC_DEFINITIONS'?
src/core/share/ShareConstants.ts(205,21): error TS2551: Property '_npcDefinitions' does not exist on type 'typeof ShareConstants'. Did you mean 'NPC_DEFINITIONS'?
src/core/share/ShareConstants.ts(209,19): error TS2551: Property '_enemyDefinitions' does not exist on type 'typeof ShareConstants'. Did you mean 'ENEMY_DEFINITIONS'?
src/core/share/ShareConstants.ts(209,46): error TS2551: Property '_enemyDefinitions' does not exist on type 'typeof ShareConstants'. Did you mean 'ENEMY_DEFINITIONS'?
src/core/share/ShareConstants.ts(210,18): error TS2551: Property '_enemyDefinitions' does not exist on type 'typeof ShareConstants'. Did you mean 'ENEMY_DEFINITIONS'?
src/core/share/ShareConstants.ts(212,21): error TS2551: Property '_enemyDefinitions' does not exist on type 'typeof ShareConstants'. Did you mean 'ENEMY_DEFINITIONS'?
src/core/share/ShareDataNormalizer.ts(12,27): error TS7006: Parameter 'start' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(20,27): error TS7006: Parameter 'npc' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(25,68): error TS7006: Parameter 'def' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(29,70): error TS7006: Parameter 'def' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(35,29): error TS7006: Parameter 'list' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(44,36): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(83,29): error TS7006: Parameter 'list' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(115,37): error TS7006: Parameter 'list' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(115,43): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(137,41): error TS7006: Parameter 'list' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(160,35): error TS7006: Parameter 'list' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(184,31): error TS7006: Parameter 'positions' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(184,42): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(186,55): error TS2339: Property 'variableNibbles' does not exist on type '{}'.
src/core/share/ShareDataNormalizer.ts(186,82): error TS2339: Property 'variableNibbles' does not exist on type '{}'.
src/core/share/ShareDataNormalizer.ts(187,51): error TS2339: Property 'endingTexts' does not exist on type '{}'.
src/core/share/ShareDataNormalizer.ts(187,74): error TS2339: Property 'endingTexts' does not exist on type '{}'.
src/core/share/ShareDataNormalizer.ts(201,23): error TS2339: Property 'collected' does not exist on type '{ id: string; type: any; roomIndex: any; x: any; y: any; }'.
src/core/share/ShareDataNormalizer.ts(204,23): error TS2339: Property 'collected' does not exist on type '{ id: string; type: any; roomIndex: any; x: any; y: any; }'.
src/core/share/ShareDataNormalizer.ts(207,23): error TS2339: Property 'collected' does not exist on type '{ id: string; type: any; roomIndex: any; x: any; y: any; }'.
src/core/share/ShareDataNormalizer.ts(210,23): error TS2339: Property 'collected' does not exist on type '{ id: string; type: any; roomIndex: any; x: any; y: any; }'.
src/core/share/ShareDataNormalizer.ts(213,23): error TS2339: Property 'opened' does not exist on type '{ id: string; type: any; roomIndex: any; x: any; y: any; }'.
src/core/share/ShareDataNormalizer.ts(219,27): error TS2339: Property 'variableId' does not exist on type '{ id: string; type: any; roomIndex: any; x: any; y: any; }'.
src/core/share/ShareDataNormalizer.ts(226,27): error TS2339: Property 'variableId' does not exist on type '{ id: string; type: any; roomIndex: any; x: any; y: any; }'.
src/core/share/ShareDataNormalizer.ts(228,53): error TS2339: Property 'stateBits' does not exist on type '{}'.
src/core/share/ShareDataNormalizer.ts(228,74): error TS2339: Property 'stateBits' does not exist on type '{}'.
src/core/share/ShareDataNormalizer.ts(229,23): error TS2339: Property 'on' does not exist on type '{ id: string; type: any; roomIndex: any; x: any; y: any; }'.
src/core/share/ShareDataNormalizer.ts(234,27): error TS2339: Property 'endingText' does not exist on type '{ id: string; type: any; roomIndex: any; x: any; y: any; }'.
src/core/share/ShareDataNormalizer.ts(248,37): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(255,34): error TS7006: Parameter 'objects' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(282,31): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/share/ShareDataNormalizer.ts(286,35): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/core/share/ShareDecoder.ts(10,28): error TS7006: Parameter 'code' implicitly has an 'any' type.
src/core/share/ShareDecoder.ts(19,13): error TS7053: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{}'.
src/core/share/ShareDecoder.ts(22,33): error TS2339: Property 'v' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(22,54): error TS2339: Property 'v' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(28,71): error TS2339: Property 'g' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(29,73): error TS2339: Property 'o' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(30,74): error TS2339: Property 's' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(31,73): error TS2339: Property 'p' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(32,65): error TS2339: Property 't' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(33,80): error TS2339: Property 'i' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(34,130): error TS2339: Property 'u' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(36,68): error TS2339: Property 'c' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(39,68): error TS2339: Property 'r' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(42,68): error TS2339: Property 'h' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(44,75): error TS2339: Property 'e' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(46,65): error TS2339: Property 'f' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(49,68): error TS2339: Property 'w' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(51,118): error TS2339: Property 'd' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(52,117): error TS2339: Property 'k' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(53,126): error TS2339: Property 'm' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(55,68): error TS2339: Property 'q' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(58,58): error TS2339: Property 'l' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(61,58): error TS2339: Property 'x' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(64,58): error TS2339: Property 'a' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(67,58): error TS2339: Property 'B' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(70,58): error TS2339: Property 'W' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(73,58): error TS2339: Property 'z' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(75,13): error TS7034: Variable 'playerEndMessages' implicitly has type 'any[]' in some locations where its type cannot be determined.
src/core/share/ShareDecoder.ts(77,72): error TS2339: Property 'E' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(79,69): error TS2339: Property 'E' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(84,121): error TS2339: Property 'b' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(86,58): error TS2339: Property 'J' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(89,68): error TS2339: Property 'K' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(92,68): error TS2339: Property 'L' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(94,58): error TS2339: Property 'n' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(95,59): error TS2339: Property 'y' does not exist on type '{}'.
src/core/share/ShareDecoder.ts(96,29): error TS7006: Parameter 'index' implicitly has an 'any' type.
src/core/share/ShareDecoder.ts(147,54): error TS2554: Expected 1 arguments, but got 0.
src/core/share/ShareDecoder.ts(178,28): error TS7005: Variable 'playerEndMessages' implicitly has an 'any[]' type.
src/core/share/ShareEncoder.ts(10,27): error TS7006: Parameter 'gameData' implicitly has an 'any' type.
src/core/share/ShareMath.ts(4,18): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/share/ShareMath.ts(4,25): error TS7006: Parameter 'min' implicitly has an 'any' type.
src/core/share/ShareMath.ts(4,30): error TS7006: Parameter 'max' implicitly has an 'any' type.
src/core/share/ShareMath.ts(4,35): error TS7006: Parameter 'fallback' implicitly has an 'any' type.
src/core/share/ShareMath.ts(9,27): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(6,28): error TS7006: Parameter 'matrix' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(21,29): error TS7006: Parameter 'matrix' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(41,34): error TS7006: Parameter 'gameData' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(41,44): error TS7006: Parameter 'roomCount' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(52,35): error TS7006: Parameter 'gameData' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(52,45): error TS7006: Parameter 'roomCount' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(63,25): error TS7006: Parameter 'matrix' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(108,25): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(108,31): error TS7006: Parameter 'version' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(172,26): error TS7006: Parameter 'matrix' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(211,26): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(211,32): error TS7006: Parameter 'version' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(267,30): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(267,36): error TS7006: Parameter 'version' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(267,45): error TS7006: Parameter 'roomCount' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(280,31): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(280,37): error TS7006: Parameter 'version' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(280,46): error TS7006: Parameter 'roomCount' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(293,28): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(306,42): error TS7006: Parameter 'matrix' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(313,35): error TS7006: Parameter 'matrix' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(328,27): error TS7006: Parameter 'values' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(328,35): error TS7006: Parameter 'useExtended' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(337,16): error TS2304: Cannot find name 'ShareVariableCodec'.
src/core/share/ShareMatrixCodec.ts(337,59): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(340,29): error TS7006: Parameter 'bytes' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(340,36): error TS7006: Parameter 'expectedCount' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(340,51): error TS7006: Parameter 'useExtended' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(348,16): error TS2304: Cannot find name 'ShareVariableCodec'.
src/core/share/ShareMatrixCodec.ts(351,25): error TS7006: Parameter 'bytes' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(363,36): error TS7006: Parameter 'tileCount' implicitly has an 'any' type.
src/core/share/ShareMatrixCodec.ts(364,31): error TS2339: Property '_tileMaskLengthCache' does not exist on type 'typeof ShareMatrixCodec'.
src/core/share/ShareMatrixCodec.ts(365,30): error TS2339: Property '_tileMaskLengthCache' does not exist on type 'typeof ShareMatrixCodec'.
src/core/share/ShareMatrixCodec.ts(367,31): error TS2339: Property '_tileMaskLengthCache' does not exist on type 'typeof ShareMatrixCodec'.
src/core/share/ShareMatrixCodec.ts(369,30): error TS2339: Property '_tileMaskLengthCache' does not exist on type 'typeof ShareMatrixCodec'.
src/core/share/ShareMatrixCodec.ts(374,33): error TS2339: Property '_tileMaskLengthCache' does not exist on type 'typeof ShareMatrixCodec'.
src/core/share/SharePositionCodec.ts(6,27): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/core/share/SharePositionCodec.ts(13,27): error TS7006: Parameter 'byte' implicitly has an 'any' type.
src/core/share/SharePositionCodec.ts(21,28): error TS7006: Parameter 'entries' implicitly has an 'any' type.
src/core/share/SharePositionCodec.ts(24,14): error TS7006: Parameter 'max' implicitly has an 'any' type.
src/core/share/SharePositionCodec.ts(24,19): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/core/share/SharePositionCodec.ts(48,28): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/share/SharePositionCodec.ts(69,33): error TS7006: Parameter 'sprites' implicitly has an 'any' type.
src/core/share/SharePositionCodec.ts(76,43): error TS7006: Parameter 'def' implicitly has an 'any' type.
src/core/share/SharePositionCodec.ts(86,33): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/share/SharePositionCodec.ts(91,35): error TS7006: Parameter 'enemies' implicitly has an 'any' type.
src/core/share/SharePositionCodec.ts(108,35): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/share/ShareTextCodec.ts(4,23): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/share/ShareTextCodec.ts(16,23): error TS7006: Parameter 'bytes' implicitly has an 'any' type.
src/core/share/ShareTextCodec.ts(27,23): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/share/ShareTextCodec.ts(32,23): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/share/ShareTextCodec.ts(42,28): error TS7006: Parameter 'values' implicitly has an 'any' type.
src/core/share/ShareTextCodec.ts(48,28): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/share/ShareUrlHelper.ts(12,26): error TS7006: Parameter 'gameData' implicitly has an 'any' type.
src/core/share/ShareUrlHelper.ts(19,40): error TS7006: Parameter 'location' implicitly has an 'any' type.
src/core/share/ShareVariableCodec.ts(5,28): error TS7006: Parameter 'variables' implicitly has an 'any' type.
src/core/share/ShareVariableCodec.ts(30,28): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/share/ShareVariableCodec.ts(45,31): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/core/share/ShareVariableCodec.ts(51,31): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/share/ShareVariableCodec.ts(57,38): error TS7006: Parameter 'values' implicitly has an 'any' type.
src/core/share/ShareVariableCodec.ts(64,38): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/share/ShareVariableCodec.ts(64,44): error TS7006: Parameter 'expectedCount' implicitly has an 'any' type.
src/core/share/ShareVariableCodec.ts(72,33): error TS7006: Parameter 'states' implicitly has an 'any' type.
src/core/share/ShareVariableCodec.ts(88,24): error TS7006: Parameter 'values' implicitly has an 'any' type.
src/core/share/ShareVariableCodec.ts(100,26): error TS7006: Parameter 'bytes' implicitly has an 'any' type.
src/core/share/ShareVariableCodec.ts(100,33): error TS7006: Parameter 'expectedCount' implicitly has an 'any' type.
src/core/ShareUtils.ts(11,26): error TS7006: Parameter 'gameData' implicitly has an 'any' type.
src/core/ShareUtils.ts(15,40): error TS7006: Parameter 'location' implicitly has an 'any' type.
src/core/ShareUtils.ts(19,19): error TS7006: Parameter 'gameData' implicitly has an 'any' type.
src/core/ShareUtils.ts(23,19): error TS7006: Parameter 'code' implicitly has an 'any' type.
src/core/SkillDefinitions.ts(57,20): error TS7006: Parameter 'id' implicitly has an 'any' type.
src/core/SkillDefinitions.ts(62,30): error TS7006: Parameter 'level' implicitly has an 'any' type.
src/core/SkillDefinitions.ts(64,22): error TS7053: Element implicitly has an 'any' type because expression of type 'number' can't be used to index type '{ 2: string[]; 4: string[]; 6: string[]; 8: string[]; 10: string[]; }'.
  No index signature with a parameter of type 'number' was found on type '{ 2: string[]; 4: string[]; 6: string[]; 8: string[]; 10: string[]; }'.
src/core/SkillDefinitions.ts(66,15): error TS7034: Variable 'unique' implicitly has type 'any[]' in some locations where its type cannot be determined.
src/core/SkillDefinitions.ts(70,18): error TS7005: Variable 'unique' implicitly has an 'any[]' type.
src/core/SkillDefinitions.ts(74,16): error TS7005: Variable 'unique' implicitly has an 'any[]' type.
src/core/SkillDefinitions.ts(77,31): error TS7006: Parameter 'level' implicitly has an 'any' type.
src/core/SkillDefinitions.ts(81,15): error TS7034: Variable 'queue' implicitly has type 'any[]' in some locations where its type cannot be determined.
src/core/SkillDefinitions.ts(84,30): error TS2345: Argument of type 'string' is not assignable to parameter of type 'never'.
src/core/SkillDefinitions.ts(86,18): error TS7005: Variable 'queue' implicitly has an 'any[]' type.
src/core/SkillDefinitions.ts(92,35): error TS2345: Argument of type 'string' is not assignable to parameter of type 'never'.
src/core/SkillDefinitions.ts(92,49): error TS7005: Variable 'queue' implicitly has an 'any[]' type.
src/core/SkillDefinitions.ts(97,16): error TS7005: Variable 'queue' implicitly has an 'any[]' type.
src/core/SkillDefinitions.ts(102,75): error TS2345: Argument of type 'string' is not assignable to parameter of type 'never'.
src/core/SkillDefinitions.ts(108,20): error TS7006: Parameter 'list' implicitly has an 'any' type.
src/core/sprites/SpriteMatrixRegistry.ts(9,16): error TS7006: Parameter 'group' implicitly has an 'any' type.
src/core/sprites/SpriteMatrixRegistry.ts(17,26): error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ player: Record<string, SpriteMatrix>; npc: Record<string, SpriteMatrix>; enemy: Record<string, SpriteMatrix>; object: Record<...>; }'.
  No index signature with a parameter of type 'string' was found on type '{ player: Record<string, SpriteMatrix>; npc: Record<string, SpriteMatrix>; enemy: Record<string, SpriteMatrix>; object: Record<...>; }'.
src/core/state/GameStateDataFacade.ts(3,17): error TS7006: Parameter 'gameState' implicitly has an 'any' type.
src/core/state/GameStateDataFacade.ts(3,28): error TS7006: Parameter 'dataManager' implicitly has an 'any' type.
src/core/state/GameStateDataFacade.ts(4,14): error TS2339: Property 'gameState' does not exist on type 'GameStateDataFacade'.
src/core/state/GameStateDataFacade.ts(5,14): error TS2339: Property 'dataManager' does not exist on type 'GameStateDataFacade'.
src/core/state/GameStateDataFacade.ts(9,21): error TS2339: Property 'dataManager' does not exist on type 'GameStateDataFacade'.
src/core/state/GameStateDataFacade.ts(12,20): error TS7006: Parameter 'data' implicitly has an 'any' type.
src/core/state/GameStateDataFacade.ts(13,14): error TS2339: Property 'dataManager' does not exist on type 'GameStateDataFacade'.
src/core/state/GameStateDataFacade.ts(14,14): error TS2339: Property 'gameState' does not exist on type 'GameStateDataFacade'.
src/core/state/GameStateDataFacade.ts(14,50): error TS2339: Property 'gameState' does not exist on type 'GameStateDataFacade'.
src/core/state/GameStateDataFacade.ts(15,14): error TS2339: Property 'gameState' does not exist on type 'GameStateDataFacade'.
src/core/state/GameStateDataFacade.ts(15,49): error TS2339: Property 'gameState' does not exist on type 'GameStateDataFacade'.
src/core/state/GameStateDataFacade.ts(16,14): error TS2339: Property 'gameState' does not exist on type 'GameStateDataFacade'.
src/core/state/GameStateDataFacade.ts(16,51): error TS2339: Property 'gameState' does not exist on type 'GameStateDataFacade'.
src/core/state/GameStateDataFacade.ts(17,14): error TS2339: Property 'gameState' does not exist on type 'GameStateDataFacade'.
src/core/state/GameStateDataFacade.ts(17,53): error TS2339: Property 'gameState' does not exist on type 'GameStateDataFacade'.
src/core/state/GameStateDataFacade.ts(18,14): error TS2339: Property 'gameState' does not exist on type 'GameStateDataFacade'.
src/core/state/GameStateDataFacade.ts(19,14): error TS2339: Property 'gameState' does not exist on type 'GameStateDataFacade'.
src/core/state/GameStateLifecycle.ts(3,17): error TS7006: Parameter 'gameState' implicitly has an 'any' type.
src/core/state/GameStateLifecycle.ts(3,28): error TS7006: Parameter 'screenManager' implicitly has an 'any' type.
src/core/state/GameStateLifecycle.ts(4,14): error TS2339: Property 'gameState' does not exist on type 'GameStateLifecycle'.
src/core/state/GameStateLifecycle.ts(5,14): error TS2339: Property 'screenManager' does not exist on type 'GameStateLifecycle'.
src/core/state/GameStateLifecycle.ts(6,14): error TS2339: Property 'pauseReasons' does not exist on type 'GameStateLifecycle'.
src/core/state/GameStateLifecycle.ts(7,14): error TS2339: Property 'timeToResetAfterGameOver' does not exist on type 'GameStateLifecycle'.
src/core/state/GameStateLifecycle.ts(7,65): error TS2339: Property 'timeToResetAfterGameOver' does not exist on type '{}'.
src/core/state/GameStateLifecycle.ts(8,35): error TS2339: Property 'timeToResetAfterGameOver' does not exist on type '{}'.
src/core/state/GameStateLifecycle.ts(14,14): error TS2339: Property 'pauseReasons' does not exist on type 'GameStateLifecycle'.
src/core/state/GameStateLifecycle.ts(20,18): error TS2339: Property 'pauseReasons' does not exist on type 'GameStateLifecycle'.
src/core/state/GameStateLifecycle.ts(22,18): error TS2339: Property 'pauseReasons' does not exist on type 'GameStateLifecycle'.
src/core/state/GameStateLifecycle.ts(28,14): error TS2339: Property 'gameState' does not exist on type 'GameStateLifecycle'.
src/core/state/GameStateLifecycle.ts(28,39): error TS2339: Property 'pauseReasons' does not exist on type 'GameStateLifecycle'.
src/core/state/GameStateLifecycle.ts(32,28): error TS2339: Property 'gameState' does not exist on type 'GameStateLifecycle'.
src/core/state/GameStateLifecycle.ts(36,18): error TS2339: Property 'screenManager' does not exist on type 'GameStateLifecycle'.
src/core/state/GameStateLifecycle.ts(36,59): error TS2339: Property 'timeToResetAfterGameOver' does not exist on type 'GameStateLifecycle'.
src/core/state/GameStateLifecycle.ts(43,29): error TS2339: Property 'gameState' does not exist on type 'GameStateLifecycle'.
src/core/state/GameStateLifecycle.ts(47,21): error TS2339: Property 'gameState' does not exist on type 'GameStateLifecycle'.
src/core/state/GameStatePlayerFacade.ts(3,17): error TS7006: Parameter 'gameState' implicitly has an 'any' type.
src/core/state/GameStatePlayerFacade.ts(3,28): error TS7006: Parameter 'playerManager' implicitly has an 'any' type.
src/core/state/GameStatePlayerFacade.ts(4,14): error TS2339: Property 'gameState' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(5,14): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(9,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(12,23): error TS7006: Parameter 'x' implicitly has an 'any' type.
src/core/state/GameStatePlayerFacade.ts(12,26): error TS7006: Parameter 'y' implicitly has an 'any' type.
src/core/state/GameStatePlayerFacade.ts(13,14): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(17,14): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(17,39): error TS2339: Property 'gameState' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(21,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(25,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(29,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(33,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(37,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(41,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(45,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(49,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(53,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(57,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(61,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(65,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(69,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(73,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(77,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(81,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(85,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(89,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(93,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStatePlayerFacade.ts(97,21): error TS2339: Property 'playerManager' does not exist on type 'GameStatePlayerFacade'.
src/core/state/GameStateScreenManager.ts(3,17): error TS7006: Parameter 'gameState' implicitly has an 'any' type.
src/core/state/GameStateScreenManager.ts(4,14): error TS2339: Property 'gameState' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateScreenManager.ts(5,14): error TS2339: Property 'canResetAfterGameOver' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateScreenManager.ts(6,14): error TS2339: Property 'lastEndingText' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateScreenManager.ts(7,14): error TS2339: Property 'gameOverResetTimer' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateScreenManager.ts(11,14): error TS2339: Property 'lastEndingText' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateScreenManager.ts(13,14): error TS2339: Property 'canResetAfterGameOver' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateScreenManager.ts(18,14): error TS2339: Property 'lastEndingText' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateScreenManager.ts(19,21): error TS2339: Property 'lastEndingText' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateScreenManager.ts(23,21): error TS2339: Property 'lastEndingText' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateScreenManager.ts(26,27): error TS7006: Parameter 'duration' implicitly has an 'any' type.
src/core/state/GameStateScreenManager.ts(27,14): error TS2339: Property 'canResetAfterGameOver' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateScreenManager.ts(30,14): error TS2339: Property 'gameOverResetTimer' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateScreenManager.ts(31,18): error TS2339: Property 'canResetAfterGameOver' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateScreenManager.ts(32,18): error TS2339: Property 'gameOverResetTimer' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateScreenManager.ts(37,18): error TS2339: Property 'gameOverResetTimer' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateScreenManager.ts(38,31): error TS2339: Property 'gameOverResetTimer' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateScreenManager.ts(39,18): error TS2339: Property 'gameOverResetTimer' does not exist on type 'GameStateScreenManager'.
src/core/state/GameStateWorldFacade.ts(3,17): error TS7006: Parameter 'gameState' implicitly has an 'any' type.
src/core/state/GameStateWorldFacade.ts(3,28): error TS7006: Parameter 'worldManager' implicitly has an 'any' type.
src/core/state/GameStateWorldFacade.ts(4,14): error TS2339: Property 'gameState' does not exist on type 'GameStateWorldFacade'.
src/core/state/GameStateWorldFacade.ts(5,14): error TS2339: Property 'worldManager' does not exist on type 'GameStateWorldFacade'.
src/core/state/GameStateWorldFacade.ts(8,21): error TS7006: Parameter 'size' implicitly has an 'any' type.
src/core/state/GameStateWorldFacade.ts(9,21): error TS2339: Property 'worldManager' does not exist on type 'GameStateWorldFacade'.
src/core/state/GameStateWorldFacade.ts(12,22): error TS7006: Parameter 'rows' implicitly has an 'any' type.
src/core/state/GameStateWorldFacade.ts(12,28): error TS7006: Parameter 'cols' implicitly has an 'any' type.
src/core/state/GameStateWorldFacade.ts(12,34): error TS7006: Parameter 'size' implicitly has an 'any' type.
src/core/state/GameStateWorldFacade.ts(13,21): error TS2339: Property 'worldManager' does not exist on type 'GameStateWorldFacade'.
src/core/state/GameStateWorldFacade.ts(16,24): error TS7006: Parameter 'size' implicitly has an 'any' type.
src/core/state/GameStateWorldFacade.ts(17,21): error TS2339: Property 'worldManager' does not exist on type 'GameStateWorldFacade'.
src/core/state/GameStateWorldFacade.ts(20,20): error TS7006: Parameter 'rooms' implicitly has an 'any' type.
src/core/state/GameStateWorldFacade.ts(20,27): error TS7006: Parameter 'totalRooms' implicitly has an 'any' type.
src/core/state/GameStateWorldFacade.ts(20,39): error TS7006: Parameter 'cols' implicitly has an 'any' type.
src/core/state/GameStateWorldFacade.ts(21,21): error TS2339: Property 'worldManager' does not exist on type 'GameStateWorldFacade'.
src/core/state/GameStateWorldFacade.ts(24,23): error TS7006: Parameter 'source' implicitly has an 'any' type.
src/core/state/GameStateWorldFacade.ts(24,31): error TS7006: Parameter 'totalRooms' implicitly has an 'any' type.
src/core/state/GameStateWorldFacade.ts(25,21): error TS2339: Property 'worldManager' does not exist on type 'GameStateWorldFacade'.
src/core/state/StateDataManager.ts(3,19): error TS7031: Binding element 'game' implicitly has an 'any' type.
src/core/state/StateDataManager.ts(3,25): error TS7031: Binding element 'worldManager' implicitly has an 'any' type.
src/core/state/StateDataManager.ts(3,39): error TS7031: Binding element 'objectManager' implicitly has an 'any' type.
src/core/state/StateDataManager.ts(3,54): error TS7031: Binding element 'variableManager' implicitly has an 'any' type.
src/core/state/StateDataManager.ts(4,14): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(5,14): error TS2551: Property 'worldManager' does not exist on type 'StateDataManager'. Did you mean 'setWorldManager'?
src/core/state/StateDataManager.ts(6,14): error TS2551: Property 'objectManager' does not exist on type 'StateDataManager'. Did you mean 'setObjectManager'?
src/core/state/StateDataManager.ts(7,14): error TS2551: Property 'variableManager' does not exist on type 'StateDataManager'. Did you mean 'setVariableManager'?
src/core/state/StateDataManager.ts(10,13): error TS7006: Parameter 'game' implicitly has an 'any' type.
src/core/state/StateDataManager.ts(11,14): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(14,21): error TS7006: Parameter 'worldManager' implicitly has an 'any' type.
src/core/state/StateDataManager.ts(15,14): error TS2551: Property 'worldManager' does not exist on type 'StateDataManager'. Did you mean 'setWorldManager'?
src/core/state/StateDataManager.ts(18,22): error TS7006: Parameter 'objectManager' implicitly has an 'any' type.
src/core/state/StateDataManager.ts(19,14): error TS2551: Property 'objectManager' does not exist on type 'StateDataManager'. Did you mean 'setObjectManager'?
src/core/state/StateDataManager.ts(22,24): error TS7006: Parameter 'variableManager' implicitly has an 'any' type.
src/core/state/StateDataManager.ts(23,14): error TS2551: Property 'variableManager' does not exist on type 'StateDataManager'. Did you mean 'setVariableManager'?
src/core/state/StateDataManager.ts(28,25): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(29,26): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(30,27): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(31,28): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(32,25): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(33,25): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(34,25): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(35,27): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(36,27): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(37,25): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(38,27): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(39,29): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(40,25): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(41,27): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(45,20): error TS7006: Parameter 'data' implicitly has an 'any' type.
src/core/state/StateDataManager.ts(52,94): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(53,38): error TS2551: Property 'worldManager' does not exist on type 'StateDataManager'. Did you mean 'setWorldManager'?
src/core/state/StateDataManager.ts(54,37): error TS2551: Property 'worldManager' does not exist on type 'StateDataManager'. Did you mean 'setWorldManager'?
src/core/state/StateDataManager.ts(58,40): error TS2551: Property 'objectManager' does not exist on type 'StateDataManager'. Did you mean 'setObjectManager'?
src/core/state/StateDataManager.ts(59,42): error TS2551: Property 'variableManager' does not exist on type 'StateDataManager'. Did you mean 'setVariableManager'?
src/core/state/StateDataManager.ts(61,28): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(81,14): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(81,38): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(84,21): error TS2551: Property 'worldManager' does not exist on type 'StateDataManager'. Did you mean 'setWorldManager'?
src/core/state/StateDataManager.ts(85,21): error TS2551: Property 'worldManager' does not exist on type 'StateDataManager'. Did you mean 'setWorldManager'?
src/core/state/StateDataManager.ts(86,29): error TS2551: Property 'worldManager' does not exist on type 'StateDataManager'. Did you mean 'setWorldManager'?
src/core/state/StateDataManager.ts(88,14): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(90,14): error TS2551: Property 'worldManager' does not exist on type 'StateDataManager'. Did you mean 'setWorldManager'?
src/core/state/StateDataManager.ts(90,40): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(91,14): error TS2551: Property 'objectManager' does not exist on type 'StateDataManager'. Did you mean 'setObjectManager'?
src/core/state/StateDataManager.ts(91,41): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDataManager.ts(92,14): error TS2551: Property 'variableManager' does not exist on type 'StateDataManager'. Did you mean 'setVariableManager'?
src/core/state/StateDataManager.ts(92,43): error TS2339: Property 'game' does not exist on type 'StateDataManager'.
src/core/state/StateDialogManager.ts(3,17): error TS7006: Parameter 'state' implicitly has an 'any' type.
src/core/state/StateDialogManager.ts(4,14): error TS2339: Property 'state' does not exist on type 'StateDialogManager'.
src/core/state/StateDialogManager.ts(7,14): error TS7006: Parameter 'state' implicitly has an 'any' type.
src/core/state/StateDialogManager.ts(8,14): error TS2339: Property 'state' does not exist on type 'StateDialogManager'.
src/core/state/StateDialogManager.ts(12,21): error TS2339: Property 'state' does not exist on type 'StateDialogManager'.
src/core/state/StateDialogManager.ts(19,15): error TS7006: Parameter 'active' implicitly has an 'any' type.
src/core/state/StateDialogManager.ts(37,13): error TS7006: Parameter 'page' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(4,17): error TS7006: Parameter 'game' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(4,23): error TS7006: Parameter 'state' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(4,30): error TS7006: Parameter 'worldManager' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(5,14): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(6,14): error TS2339: Property 'state' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(7,14): error TS2551: Property 'worldManager' does not exist on type 'StateEnemyManager'. Did you mean 'setWorldManager'?
src/core/state/StateEnemyManager.ts(10,13): error TS7006: Parameter 'game' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(11,14): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(14,14): error TS7006: Parameter 'state' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(15,14): error TS2339: Property 'state' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(18,21): error TS7006: Parameter 'worldManager' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(19,14): error TS2551: Property 'worldManager' does not exist on type 'StateEnemyManager'. Did you mean 'setWorldManager'?
src/core/state/StateEnemyManager.ts(22,18): error TS7006: Parameter 'enemies' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(23,15): error TS7034: Variable 'list' implicitly has type 'any[]' in some locations where its type cannot be determined.
src/core/state/StateEnemyManager.ts(24,34): error TS7006: Parameter 'enemy' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(27,29): error TS7005: Variable 'list' implicitly has an 'any[]' type.
src/core/state/StateEnemyManager.ts(29,21): error TS7005: Variable 'list' implicitly has an 'any[]' type.
src/core/state/StateEnemyManager.ts(35,33): error TS2551: Property 'worldManager' does not exist on type 'StateEnemyManager'. Did you mean 'setWorldManager'?
src/core/state/StateEnemyManager.ts(36,25): error TS2551: Property 'worldManager' does not exist on type 'StateEnemyManager'. Did you mean 'setWorldManager'?
src/core/state/StateEnemyManager.ts(37,25): error TS2551: Property 'worldManager' does not exist on type 'StateEnemyManager'. Did you mean 'setWorldManager'?
src/core/state/StateEnemyManager.ts(38,29): error TS2551: Property 'worldManager' does not exist on type 'StateEnemyManager'. Did you mean 'setWorldManager'?
src/core/state/StateEnemyManager.ts(43,16): error TS7005: Variable 'list' implicitly has an 'any[]' type.
src/core/state/StateEnemyManager.ts(47,19): error TS2339: Property 'state' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(48,14): error TS2339: Property 'state' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(48,53): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(49,21): error TS2339: Property 'state' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(53,21): error TS2339: Property 'state' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(57,21): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(60,14): error TS7006: Parameter 'enemy' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(61,19): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(61,33): error TS2339: Property 'state' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(64,18): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(64,39): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(64,67): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(65,18): error TS2339: Property 'state' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(65,40): error TS2339: Property 'state' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(65,69): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(68,33): error TS2551: Property 'worldManager' does not exist on type 'StateEnemyManager'. Did you mean 'setWorldManager'?
src/core/state/StateEnemyManager.ts(70,40): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(70,69): error TS7006: Parameter 'count' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(70,76): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(71,31): error TS2551: Property 'worldManager' does not exist on type 'StateEnemyManager'. Did you mean 'setWorldManager'?
src/core/state/StateEnemyManager.ts(82,21): error TS2551: Property 'worldManager' does not exist on type 'StateEnemyManager'. Did you mean 'setWorldManager'?
src/core/state/StateEnemyManager.ts(83,21): error TS2551: Property 'worldManager' does not exist on type 'StateEnemyManager'. Did you mean 'setWorldManager'?
src/core/state/StateEnemyManager.ts(84,25): error TS2551: Property 'worldManager' does not exist on type 'StateEnemyManager'. Did you mean 'setWorldManager'?
src/core/state/StateEnemyManager.ts(87,14): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(88,14): error TS2339: Property 'state' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(92,17): error TS7006: Parameter 'enemyId' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(93,19): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(93,33): error TS2339: Property 'state' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(94,14): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(94,34): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(94,55): error TS7006: Parameter 'enemy' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(95,14): error TS2339: Property 'state' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(95,35): error TS2339: Property 'state' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(95,57): error TS7006: Parameter 'enemy' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(98,22): error TS7006: Parameter 'enemyId' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(98,31): error TS7006: Parameter 'x' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(98,34): error TS7006: Parameter 'y' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(99,47): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(102,24): error TS2551: Property 'worldManager' does not exist on type 'StateEnemyManager'. Did you mean 'setWorldManager'?
src/core/state/StateEnemyManager.ts(103,24): error TS2551: Property 'worldManager' does not exist on type 'StateEnemyManager'. Did you mean 'setWorldManager'?
src/core/state/StateEnemyManager.ts(105,36): error TS2551: Property 'worldManager' does not exist on type 'StateEnemyManager'. Did you mean 'setWorldManager'?
src/core/state/StateEnemyManager.ts(109,22): error TS7006: Parameter 'enemyId' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(113,32): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(114,32): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(114,51): error TS7006: Parameter 'enemy' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(121,32): error TS2339: Property 'state' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(122,34): error TS2339: Property 'state' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(122,54): error TS7006: Parameter 'enemy' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(131,24): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(135,16): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(140,30): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/core/state/StateEnemyManager.ts(142,48): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(142,72): error TS2339: Property 'game' does not exist on type 'StateEnemyManager'.
src/core/state/StateEnemyManager.ts(143,34): error TS7006: Parameter 'variable' implicitly has an 'any' type.
src/core/state/StateItemManager.ts(3,17): error TS7006: Parameter 'game' implicitly has an 'any' type.
src/core/state/StateItemManager.ts(4,14): error TS2339: Property 'game' does not exist on type 'StateItemManager'.
src/core/state/StateItemManager.ts(7,13): error TS7006: Parameter 'game' implicitly has an 'any' type.
src/core/state/StateItemManager.ts(8,14): error TS2339: Property 'game' does not exist on type 'StateItemManager'.
src/core/state/StateItemManager.ts(12,33): error TS2339: Property 'game' does not exist on type 'StateItemManager'.
src/core/state/StateItemManager.ts(13,14): error TS2339: Property 'game' does not exist on type 'StateItemManager'.
src/core/state/StateItemManager.ts(13,34): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(47,19): error TS2339: Property '_collectibleSet' does not exist on type 'typeof StateObjectManager'.
src/core/state/StateObjectManager.ts(48,18): error TS2339: Property '_collectibleSet' does not exist on type 'typeof StateObjectManager'.
src/core/state/StateObjectManager.ts(50,21): error TS2339: Property '_collectibleSet' does not exist on type 'typeof StateObjectManager'.
src/core/state/StateObjectManager.ts(53,30): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(57,17): error TS7006: Parameter 'game' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(57,23): error TS7006: Parameter 'worldManager' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(57,37): error TS7006: Parameter 'variableManager' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(58,14): error TS2339: Property 'game' does not exist on type 'StateObjectManager'.
src/core/state/StateObjectManager.ts(59,14): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(60,14): error TS2551: Property 'variableManager' does not exist on type 'StateObjectManager'. Did you mean 'setVariableManager'?
src/core/state/StateObjectManager.ts(64,13): error TS7006: Parameter 'game' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(65,14): error TS2339: Property 'game' does not exist on type 'StateObjectManager'.
src/core/state/StateObjectManager.ts(69,21): error TS7006: Parameter 'worldManager' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(70,14): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(73,24): error TS7006: Parameter 'variableManager' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(74,14): error TS2551: Property 'variableManager' does not exist on type 'StateObjectManager'. Did you mean 'setVariableManager'?
src/core/state/StateObjectManager.ts(77,22): error TS7006: Parameter 'objects' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(88,40): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(97,32): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(98,32): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(102,49): error TS2551: Property 'variableManager' does not exist on type 'StateObjectManager'. Did you mean 'setVariableManager'?
src/core/state/StateObjectManager.ts(105,29): error TS2551: Property 'variableManager' does not exist on type 'StateObjectManager'. Did you mean 'setVariableManager'?
src/core/state/StateObjectManager.ts(119,26): error TS2339: Property 'on' does not exist on type '{ id: any; type: any; roomIndex: any; x: any; y: any; collected: boolean; opened: boolean; variableId: any; }'.
src/core/state/StateObjectManager.ts(122,26): error TS2339: Property 'endingText' does not exist on type '{ id: any; type: any; roomIndex: any; x: any; y: any; collected: boolean; opened: boolean; variableId: any; }'.
src/core/state/StateObjectManager.ts(129,28): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(138,26): error TS7006: Parameter 'object' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(153,22): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(153,28): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(161,19): error TS2339: Property 'game' does not exist on type 'StateObjectManager'.
src/core/state/StateObjectManager.ts(162,33): error TS2339: Property 'game' does not exist on type 'StateObjectManager'.
src/core/state/StateObjectManager.ts(163,18): error TS2339: Property 'game' does not exist on type 'StateObjectManager'.
src/core/state/StateObjectManager.ts(165,14): error TS2339: Property 'game' does not exist on type 'StateObjectManager'.
src/core/state/StateObjectManager.ts(165,36): error TS7006: Parameter 'object' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(166,21): error TS2339: Property 'game' does not exist on type 'StateObjectManager'.
src/core/state/StateObjectManager.ts(169,23): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(170,29): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(171,42): error TS7006: Parameter 'object' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(174,17): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(174,28): error TS7006: Parameter 'x' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(174,31): error TS7006: Parameter 'y' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(175,33): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(176,25): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(177,25): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(178,40): error TS7006: Parameter 'object' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(185,23): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(185,29): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(185,40): error TS7006: Parameter 'x' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(185,43): error TS7006: Parameter 'y' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(189,33): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(190,25): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(191,25): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(195,35): error TS7006: Parameter 'object' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(197,35): error TS7006: Parameter 'object' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(210,23): error TS2339: Property 'on' does not exist on type '{ id: string; type: any; roomIndex: any; x: any; y: any; }'.
src/core/state/StateObjectManager.ts(213,23): error TS2339: Property 'endingText' does not exist on type '{ id: string; type: any; roomIndex: any; x: any; y: any; }'.
src/core/state/StateObjectManager.ts(228,45): error TS2551: Property 'variableManager' does not exist on type 'StateObjectManager'. Did you mean 'setVariableManager'?
src/core/state/StateObjectManager.ts(229,37): error TS2551: Property 'variableManager' does not exist on type 'StateObjectManager'. Did you mean 'setVariableManager'?
src/core/state/StateObjectManager.ts(235,45): error TS2551: Property 'variableManager' does not exist on type 'StateObjectManager'. Did you mean 'setVariableManager'?
src/core/state/StateObjectManager.ts(236,37): error TS2551: Property 'variableManager' does not exist on type 'StateObjectManager'. Did you mean 'setVariableManager'?
src/core/state/StateObjectManager.ts(245,18): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(245,24): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(249,33): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(250,14): error TS2339: Property 'game' does not exist on type 'StateObjectManager'.
src/core/state/StateObjectManager.ts(250,55): error TS7006: Parameter 'object' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(255,23): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(255,29): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(255,40): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(258,33): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(259,47): error TS7006: Parameter 'object' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(264,41): error TS2551: Property 'variableManager' does not exist on type 'StateObjectManager'. Did you mean 'setVariableManager'?
src/core/state/StateObjectManager.ts(265,33): error TS2551: Property 'variableManager' does not exist on type 'StateObjectManager'. Did you mean 'setVariableManager'?
src/core/state/StateObjectManager.ts(270,21): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(270,33): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(273,33): error TS2551: Property 'variableManager' does not exist on type 'StateObjectManager'. Did you mean 'setVariableManager'?
src/core/state/StateObjectManager.ts(276,36): error TS7006: Parameter 'object' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(288,19): error TS2339: Property 'game' does not exist on type 'StateObjectManager'.
src/core/state/StateObjectManager.ts(288,33): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(290,28): error TS2339: Property 'game' does not exist on type 'StateObjectManager'.
src/core/state/StateObjectManager.ts(291,32): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(292,24): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(293,24): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(294,36): error TS7006: Parameter 'object' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(315,34): error TS7006: Parameter 'object' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(317,33): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(318,30): error TS7006: Parameter 'object' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(328,22): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(328,33): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(336,21): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(337,29): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(337,51): error TS2339: Property 'game' does not exist on type 'StateObjectManager'.
src/core/state/StateObjectManager.ts(338,24): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(339,24): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(340,32): error TS2551: Property 'worldManager' does not exist on type 'StateObjectManager'. Did you mean 'setWorldManager'?
src/core/state/StateObjectManager.ts(341,14): error TS2339: Property 'game' does not exist on type 'StateObjectManager'.
src/core/state/StateObjectManager.ts(347,25): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(363,26): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/core/state/StateObjectManager.ts(363,38): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/state/StatePlayerManager.ts(3,17): error TS7006: Parameter 'state' implicitly has an 'any' type.
src/core/state/StatePlayerManager.ts(3,24): error TS7006: Parameter 'worldManager' implicitly has an 'any' type.
src/core/state/StatePlayerManager.ts(4,14): error TS2339: Property 'state' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(5,14): error TS2551: Property 'worldManager' does not exist on type 'StatePlayerManager'. Did you mean 'setWorldManager'?
src/core/state/StatePlayerManager.ts(6,14): error TS2551: Property 'skillManager' does not exist on type 'StatePlayerManager'. Did you mean 'setSkillManager'?
src/core/state/StatePlayerManager.ts(7,14): error TS2339: Property 'maxLevel' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(8,14): error TS2339: Property 'baseMaxLives' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(9,14): error TS2339: Property 'experienceBase' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(10,14): error TS2339: Property 'experienceGrowth' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(11,14): error TS2339: Property 'maxKeys' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(12,14): error TS2339: Property 'roomChangeDamageCooldown' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(15,14): error TS7006: Parameter 'state' implicitly has an 'any' type.
src/core/state/StatePlayerManager.ts(16,14): error TS2339: Property 'state' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(19,21): error TS7006: Parameter 'worldManager' implicitly has an 'any' type.
src/core/state/StatePlayerManager.ts(20,14): error TS2551: Property 'worldManager' does not exist on type 'StatePlayerManager'. Did you mean 'setWorldManager'?
src/core/state/StatePlayerManager.ts(23,21): error TS7006: Parameter 'skillManager' implicitly has an 'any' type.
src/core/state/StatePlayerManager.ts(24,14): error TS2551: Property 'skillManager' does not exist on type 'StatePlayerManager'. Did you mean 'setSkillManager'?
src/core/state/StatePlayerManager.ts(28,21): error TS2339: Property 'state' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(35,17): error TS7006: Parameter 'x' implicitly has an 'any' type.
src/core/state/StatePlayerManager.ts(35,20): error TS7006: Parameter 'y' implicitly has an 'any' type.
src/core/state/StatePlayerManager.ts(38,30): error TS2551: Property 'worldManager' does not exist on type 'StatePlayerManager'. Did you mean 'setWorldManager'?
src/core/state/StatePlayerManager.ts(39,30): error TS2551: Property 'worldManager' does not exist on type 'StatePlayerManager'. Did you mean 'setWorldManager'?
src/core/state/StatePlayerManager.ts(41,42): error TS2551: Property 'worldManager' does not exist on type 'StatePlayerManager'. Did you mean 'setWorldManager'?
src/core/state/StatePlayerManager.ts(46,11): error TS7006: Parameter 'start' implicitly has an 'any' type.
src/core/state/StatePlayerManager.ts(95,42): error TS2339: Property 'maxKeys' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(111,21): error TS2339: Property 'maxKeys' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(118,18): error TS2551: Property 'skillManager' does not exist on type 'StatePlayerManager'. Did you mean 'setSkillManager'?
src/core/state/StatePlayerManager.ts(138,18): error TS2551: Property 'skillManager' does not exist on type 'StatePlayerManager'. Did you mean 'setSkillManager'?
src/core/state/StatePlayerManager.ts(146,94): error TS2339: Property 'roomChangeDamageCooldown' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(208,23): error TS7006: Parameter 'level' implicitly has an 'any' type.
src/core/state/StatePlayerManager.ts(210,28): error TS2551: Property 'skillManager' does not exist on type 'StatePlayerManager'. Did you mean 'setSkillManager'?
src/core/state/StatePlayerManager.ts(211,21): error TS2339: Property 'baseMaxLives' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(214,16): error TS7006: Parameter 'level' implicitly has an 'any' type.
src/core/state/StatePlayerManager.ts(216,42): error TS2339: Property 'maxLevel' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(233,27): error TS2339: Property 'maxLevel' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(274,31): error TS7006: Parameter 'level' implicitly has an 'any' type.
src/core/state/StatePlayerManager.ts(276,29): error TS2339: Property 'maxLevel' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(277,39): error TS2339: Property 'experienceBase' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(277,70): error TS2339: Property 'experienceGrowth' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(301,18): error TS2551: Property 'skillManager' does not exist on type 'StatePlayerManager'. Did you mean 'setSkillManager'?
src/core/state/StatePlayerManager.ts(302,32): error TS2551: Property 'skillManager' does not exist on type 'StatePlayerManager'. Did you mean 'setSkillManager'?
src/core/state/StatePlayerManager.ts(307,52): error TS2339: Property 'maxLevel' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(308,43): error TS2339: Property 'maxLevel' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(323,41): error TS2339: Property 'maxLevel' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(333,39): error TS2339: Property 'maxLevel' does not exist on type 'StatePlayerManager'.
src/core/state/StatePlayerManager.ts(334,38): error TS2339: Property 'maxLevel' does not exist on type 'StatePlayerManager'.
src/core/state/StateSkillManager.ts(4,17): error TS7006: Parameter 'state' implicitly has an 'any' type.
src/core/state/StateSkillManager.ts(5,14): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(9,14): error TS7006: Parameter 'state' implicitly has an 'any' type.
src/core/state/StateSkillManager.ts(10,14): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(16,19): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(30,19): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(31,18): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(33,30): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(35,56): error TS7006: Parameter 'id' implicitly has an 'any' type.
src/core/state/StateSkillManager.ts(50,66): error TS7006: Parameter 'id' implicitly has an 'any' type.
src/core/state/StateSkillManager.ts(53,68): error TS7006: Parameter 'id' implicitly has an 'any' type.
src/core/state/StateSkillManager.ts(57,25): error TS7006: Parameter 'lvl' implicitly has an 'any' type.
src/core/state/StateSkillManager.ts(58,28): error TS7006: Parameter 'lvl' implicitly has an 'any' type.
src/core/state/StateSkillManager.ts(65,19): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(68,19): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(69,18): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(71,30): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(104,14): error TS7006: Parameter 'skillId' implicitly has an 'any' type.
src/core/state/StateSkillManager.ts(110,14): error TS7006: Parameter 'skillId' implicitly has an 'any' type.
src/core/state/StateSkillManager.ts(122,27): error TS7006: Parameter 'definition' implicitly has an 'any' type.
src/core/state/StateSkillManager.ts(163,48): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(164,43): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(166,82): error TS2345: Argument of type 'null' is not assignable to parameter of type 'number'.
src/core/state/StateSkillManager.ts(209,39): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(209,91): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(230,38): error TS2345: Argument of type 'null' is not assignable to parameter of type 'number'.
src/core/state/StateSkillManager.ts(231,36): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(232,43): error TS2339: Property 'state' does not exist on type 'StateSkillManager'.
src/core/state/StateSkillManager.ts(265,117): error TS2345: Argument of type 'null' is not assignable to parameter of type 'number'.
src/core/state/StateSkillManager.ts(278,48): error TS7006: Parameter 'id' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(3,26): error TS7006: Parameter 'key' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(8,31): error TS7006: Parameter 'id' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(8,35): error TS7006: Parameter 'order' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(8,42): error TS7006: Parameter 'nameKey' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(8,51): error TS7006: Parameter 'fallbackName' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(8,65): error TS7006: Parameter 'color' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(24,17): error TS7006: Parameter 'game' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(24,23): error TS7006: Parameter 'state' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(25,14): error TS2339: Property 'game' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(26,14): error TS2339: Property 'state' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(27,14): error TS2339: Property 'presets' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(30,13): error TS7006: Parameter 'game' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(31,14): error TS2339: Property 'game' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(34,14): error TS7006: Parameter 'state' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(35,14): error TS2339: Property 'state' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(39,19): error TS2339: Property 'game' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(40,14): error TS2339: Property 'game' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(40,60): error TS2339: Property 'game' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(41,21): error TS2339: Property 'game' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(45,19): error TS2339: Property 'state' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(46,14): error TS2339: Property 'state' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(46,57): error TS2339: Property 'game' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(47,21): error TS2339: Property 'state' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(50,20): error TS7006: Parameter 'list' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(51,34): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(60,24): error TS7006: Parameter 'source' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(63,21): error TS2339: Property 'presets' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(63,34): error TS7006: Parameter 'preset' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(78,21): error TS2339: Property 'game' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(82,21): error TS2339: Property 'state' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(85,25): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(90,52): error TS7006: Parameter 'variable' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(93,17): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(95,42): error TS7006: Parameter 'variable' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(98,18): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(103,22): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(103,34): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(105,38): error TS7006: Parameter 'variable' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(115,52): error TS7006: Parameter 'variable' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(129,63): error TS2339: Property 'presets' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(132,26): error TS7006: Parameter 'preset' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(141,29): error TS7006: Parameter 'preset' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(144,27): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(151,59): error TS2304: Cannot find name 'TEXT_BUNDLES'.
src/core/state/StateVariableManager.ts(151,90): error TS2304: Cannot find name 'TEXT_BUNDLES'.
src/core/state/StateVariableManager.ts(155,26): error TS7053: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{ 'app.title': string; 'intro.byline': string; 'intro.startAdventure': string; 'tabs.game': string; 'tabs.editor': string; 'sections.tiles': string; 'sections.world': string; 'sections.objects': string; ... 260 more ...; 'tiles.summaryFallback': string; } | { ...; }'.
src/core/state/StateVariableManager.ts(163,42): error TS2339: Property 'presets' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(163,55): error TS7006: Parameter 'preset' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(164,24): error TS7006: Parameter 'list' implicitly has an 'any' type.
src/core/state/StateVariableManager.ts(178,20): error TS2339: Property 'game' does not exist on type 'StateVariableManager'.
src/core/state/StateVariableManager.ts(179,20): error TS2339: Property 'state' does not exist on type 'StateVariableManager'.
src/core/state/StateWorldManager.ts(3,17): error TS7006: Parameter 'game' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(4,14): error TS2339: Property 'game' does not exist on type 'StateWorldManager'.
src/core/state/StateWorldManager.ts(5,14): error TS2339: Property 'defaultRoomSize' does not exist on type 'StateWorldManager'.
src/core/state/StateWorldManager.ts(8,13): error TS7006: Parameter 'game' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(9,14): error TS2339: Property 'game' does not exist on type 'StateWorldManager'.
src/core/state/StateWorldManager.ts(13,21): error TS2339: Property 'game' does not exist on type 'StateWorldManager'.
src/core/state/StateWorldManager.ts(13,44): error TS2339: Property 'defaultRoomSize' does not exist on type 'StateWorldManager'.
src/core/state/StateWorldManager.ts(16,28): error TS7006: Parameter 'size' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(33,29): error TS7006: Parameter 'rows' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(33,35): error TS7006: Parameter 'cols' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(33,41): error TS7006: Parameter 'size' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(39,22): error TS7006: Parameter 'rows' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(39,28): error TS7006: Parameter 'cols' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(43,31): error TS7006: Parameter 'size' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(54,20): error TS7006: Parameter 'rooms' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(54,27): error TS7006: Parameter 'totalRooms' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(54,39): error TS7006: Parameter 'cols' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(66,35): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(66,40): error TS7006: Parameter 'y' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(73,35): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(73,40): error TS7006: Parameter '_y' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(81,23): error TS7006: Parameter 'source' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(81,31): error TS7006: Parameter 'totalRooms' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(86,28): error TS7006: Parameter 'target' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(86,36): error TS7006: Parameter 'map' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(111,20): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(112,28): error TS2339: Property 'game' does not exist on type 'StateWorldManager'.
src/core/state/StateWorldManager.ts(119,21): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(127,21): error TS2339: Property 'game' does not exist on type 'StateWorldManager'.
src/core/state/StateWorldManager.ts(131,21): error TS2339: Property 'game' does not exist on type 'StateWorldManager'.
src/core/state/StateWorldManager.ts(134,19): error TS7006: Parameter 'index' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(141,18): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/core/state/StateWorldManager.ts(141,23): error TS7006: Parameter 'col' implicitly has an 'any' type.
src/core/TextResources.ts(549,25): error TS2683: 'this' implicitly has type 'any' because it does not have a type annotation.
src/core/TextResources.ts(550,16): error TS7053: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{ 'pt-BR': { 'app.title': string; 'intro.byline': string; 'intro.startAdventure': string; 'tabs.game': string; 'tabs.editor': string; 'sections.tiles': string; 'sections.world': string; 'sections.objects': string; ... 260 more ...; 'tiles.summaryFallback': string; }; 'en-US': { ...; }; }'.
src/core/TextResources.ts(550,40): error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ 'pt-BR': { 'app.title': string; 'intro.byline': string; 'intro.startAdventure': string; 'tabs.game': string; 'tabs.editor': string; 'sections.tiles': string; 'sections.world': string; 'sections.objects': string; ... 260 more ...; 'tiles.summaryFallback': string; }; 'en-US': { ...; }; }'.
  No index signature with a parameter of type 'string' was found on type '{ 'pt-BR': { 'app.title': string; 'intro.byline': string; 'intro.startAdventure': string; 'tabs.game': string; 'tabs.editor': string; 'sections.tiles': string; 'sections.world': string; 'sections.objects': string; ... 260 more ...; 'tiles.summaryFallback': string; }; 'en-US': { ...; }; }'.
src/core/TextResources.ts(559,48): error TS2551: Property 'userLanguage' does not exist on type 'Navigator'. Did you mean 'language'?
src/core/TextResources.ts(561,25): error TS7053: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{ 'pt-BR': { 'app.title': string; 'intro.byline': string; 'intro.startAdventure': string; 'tabs.game': string; 'tabs.editor': string; 'sections.tiles': string; 'sections.world': string; 'sections.objects': string; ... 260 more ...; 'tiles.summaryFallback': string; }; 'en-US': { ...; }; }'.
src/core/TextResources.ts(573,15): error TS7006: Parameter 'locale' implicitly has an 'any' type.
src/core/TextResources.ts(573,41): error TS2339: Property 'root' does not exist on type '{ silent?: boolean | undefined; }'.
src/core/TextResources.ts(574,25): error TS7053: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{ 'pt-BR': { 'app.title': string; 'intro.byline': string; 'intro.startAdventure': string; 'tabs.game': string; 'tabs.editor': string; 'sections.tiles': string; 'sections.world': string; 'sections.objects': string; ... 260 more ...; 'tiles.summaryFallback': string; }; 'en-US': { ...; }; }'.
src/core/TextResources.ts(589,12): error TS7006: Parameter 'locale' implicitly has an 'any' type.
src/core/TextResources.ts(591,26): error TS7053: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{ 'pt-BR': { 'app.title': string; 'intro.byline': string; 'intro.startAdventure': string; 'tabs.game': string; 'tabs.editor': string; 'sections.tiles': string; 'sections.world': string; 'sections.objects': string; ... 260 more ...; 'tiles.summaryFallback': string; }; 'en-US': { ...; }; }'.
src/core/TextResources.ts(592,9): error TS7053: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{ 'pt-BR': { 'app.title': string; 'intro.byline': string; 'intro.startAdventure': string; 'tabs.game': string; 'tabs.editor': string; 'sections.tiles': string; 'sections.world': string; 'sections.objects': string; ... 260 more ...; 'tiles.summaryFallback': string; }; 'en-US': { ...; }; }'.
src/core/TextResources.ts(598,9): error TS7006: Parameter 'key' implicitly has an 'any' type.
src/core/TextResources.ts(613,12): error TS7006: Parameter 'key' implicitly has an 'any' type.
src/core/TextResources.ts(616,48): error TS7006: Parameter '_' implicitly has an 'any' type.
src/core/TextResources.ts(616,51): error TS7006: Parameter 'token' implicitly has an 'any' type.
src/core/TextResources.ts(618,24): error TS7053: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{}'.
src/core/TileDefinitions.ts(25,23): error TS7006: Parameter 'id' implicitly has an 'any' type.
src/core/TileDefinitions.ts(25,27): error TS7006: Parameter 'name' implicitly has an 'any' type.
src/core/TileDefinitions.ts(25,33): error TS7006: Parameter 'layouts' implicitly has an 'any' type.
src/core/TileDefinitions.ts(44,21): error TS7006: Parameter 'layout' implicitly has an 'any' type.
src/core/TileDefinitions.ts(45,28): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/core/TileDefinitions.ts(46,22): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/core/TileDefinitions.ts(50,17): error TS7006: Parameter 'index' implicitly has an 'any' type.
src/core/TileDefinitions.ts(50,24): error TS7006: Parameter 'name' implicitly has an 'any' type.
src/core/TileDefinitions.ts(50,30): error TS7006: Parameter 'layout' implicitly has an 'any' type.
src/core/TileDefinitions.ts(79,30): error TS2345: Argument of type 'number[][]' is not assignable to parameter of type 'null | undefined'.
src/core/TileDefinitions.ts(154,26): error TS2345: Argument of type 'number[][]' is not assignable to parameter of type 'null | undefined'.
src/core/TileDefinitions.ts(174,28): error TS2345: Argument of type 'number[][]' is not assignable to parameter of type 'null | undefined'.
src/core/TileManager.ts(101,12): error TS2339: Property 'animated' does not exist on type 'TileDefinition'.
src/core/TileManager.ts(104,12): error TS2339: Property 'animated' does not exist on type 'TileDefinition'.
src/core/TileManager.ts(186,36): error TS2345: Argument of type 'number | null' is not assignable to parameter of type 'number'.
  Type 'null' is not assignable to type 'number'.
src/editor/EditorManager.ts(19,17): error TS7006: Parameter 'gameEngine' implicitly has an 'any' type.
src/editor/EditorManager.ts(20,14): error TS2339: Property 'gameEngine' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(21,14): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(22,14): error TS2339: Property 'domCache' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(22,44): error TS2345: Argument of type 'Document | null' is not assignable to parameter of type 'Document | undefined'.
  Type 'null' is not assignable to type 'Document | undefined'.
src/editor/EditorManager.ts(24,14): error TS2339: Property 'editorCanvas' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(24,34): error TS2339: Property 'domCache' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(25,14): error TS2339: Property 'ectx' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(25,26): error TS2339: Property 'editorCanvas' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(26,18): error TS2339: Property 'ectx' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(27,18): error TS2339: Property 'ectx' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(30,14): error TS2339: Property 'history' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(31,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(32,14): error TS2339: Property 'tileService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(33,14): error TS2339: Property 'shareService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(34,14): error TS2339: Property 'npcService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(35,14): error TS2339: Property 'enemyService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(36,14): error TS2339: Property 'objectService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(37,14): error TS2339: Property 'variableService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(37,58): error TS2345: Argument of type 'this' is not assignable to parameter of type 'EditorVariableManagerLike'.
  Type 'EditorManager' is missing the following properties from type 'EditorVariableManagerLike': domCache, gameEngine, renderService, npcService, and 2 more.
src/editor/EditorManager.ts(38,14): error TS2339: Property 'worldService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(38,52): error TS2345: Argument of type 'this' is not assignable to parameter of type 'EditorManagerLike'.
  Type 'EditorManager' is missing the following properties from type 'EditorManagerLike': domCache, state, gameEngine, npcService, and 2 more.
src/editor/EditorManager.ts(39,14): error TS2339: Property 'uiController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(40,14): error TS2339: Property 'eventBinder' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(41,14): error TS2339: Property 'interactionController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(52,21): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(55,14): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(59,21): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(62,14): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(66,21): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(69,14): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(73,21): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(76,14): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(80,21): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(83,14): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(87,21): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(90,14): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(94,21): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(97,14): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(101,21): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(104,14): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(108,21): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(111,14): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(115,21): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(118,14): error TS2339: Property 'state' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(122,21): error TS2339: Property 'domCache' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(126,14): error TS2339: Property 'eventBinder' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(130,14): error TS2339: Property 'gameEngine' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(131,28): error TS2339: Property 'gameEngine' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(137,37): error TS2339: Property 'gameEngine' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(138,33): error TS2339: Property 'gameEngine' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(140,14): error TS2339: Property 'gameEngine' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(145,14): error TS2339: Property 'history' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(149,42): error TS2339: Property 'tileService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(150,41): error TS2339: Property 'npcService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(151,43): error TS2339: Property 'enemyService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(152,44): error TS2339: Property 'objectService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(155,18): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(156,18): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(159,18): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(162,18): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(165,18): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(172,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(173,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(174,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(175,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(176,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(177,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(178,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(179,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(180,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(185,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(189,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(193,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(197,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(201,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(205,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(209,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(213,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(217,14): error TS2339: Property 'renderService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(221,14): error TS2339: Property 'uiController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(225,14): error TS2339: Property 'uiController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(229,14): error TS2339: Property 'uiController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(232,23): error TS7006: Parameter 'level' implicitly has an 'any' type.
src/editor/EditorManager.ts(233,14): error TS2339: Property 'uiController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(236,19): error TS7006: Parameter 'skills' implicitly has an 'any' type.
src/editor/EditorManager.ts(237,14): error TS2339: Property 'uiController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(240,16): error TS7006: Parameter 'active' implicitly has an 'any' type.
src/editor/EditorManager.ts(241,14): error TS2339: Property 'uiController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(244,26): error TS7006: Parameter 'panel' implicitly has an 'any' type.
src/editor/EditorManager.ts(245,14): error TS2339: Property 'uiController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(249,14): error TS2339: Property 'uiController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(253,19): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/EditorManager.ts(254,14): error TS2339: Property 'tileService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(257,22): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/EditorManager.ts(258,14): error TS2339: Property 'tileService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(261,20): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/EditorManager.ts(262,14): error TS2339: Property 'tileService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(267,14): error TS2339: Property 'npcService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(271,14): error TS2339: Property 'npcService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(275,14): error TS2339: Property 'npcService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(280,14): error TS2339: Property 'npcService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(285,14): error TS2339: Property 'npcService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(291,14): error TS2339: Property 'npcService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(297,14): error TS2339: Property 'npcService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(303,14): error TS2339: Property 'npcService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(306,17): error TS7006: Parameter 'enemyId' implicitly has an 'any' type.
src/editor/EditorManager.ts(307,14): error TS2339: Property 'enemyService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(310,18): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/editor/EditorManager.ts(310,24): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/editor/EditorManager.ts(311,14): error TS2339: Property 'objectService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(314,27): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/editor/EditorManager.ts(315,14): error TS2339: Property 'variableService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(319,19): error TS7006: Parameter 'index' implicitly has an 'any' type.
src/editor/EditorManager.ts(320,14): error TS2339: Property 'worldService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(325,21): error TS2339: Property 'shareService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(329,14): error TS2339: Property 'shareService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(332,18): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/EditorManager.ts(333,14): error TS2339: Property 'shareService' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(338,14): error TS2339: Property 'history' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(342,14): error TS2339: Property 'history' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(346,14): error TS2339: Property 'history' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(351,14): error TS2339: Property 'uiController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(355,14): error TS2339: Property 'uiController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(359,14): error TS2339: Property 'uiController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(363,13): error TS7006: Parameter 'data' implicitly has an 'any' type.
src/editor/EditorManager.ts(364,17): error TS2339: Property 'skipHistory' does not exist on type '{}'.
src/editor/EditorManager.ts(365,14): error TS2339: Property 'gameEngine' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(366,14): error TS2339: Property 'gameEngine' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(368,28): error TS2339: Property 'gameEngine' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(369,42): error TS7006: Parameter 't' implicitly has an 'any' type.
src/editor/EditorManager.ts(373,27): error TS2339: Property 'gameEngine' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(374,25): error TS7006: Parameter 'npc' implicitly has an 'any' type.
src/editor/EditorManager.ts(384,39): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/editor/EditorManager.ts(389,14): error TS2339: Property 'gameEngine' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(392,18): error TS2339: Property 'history' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(398,14): error TS2339: Property 'interactionController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(402,14): error TS2339: Property 'uiController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(406,14): error TS2339: Property 'uiController' does not exist on type 'EditorManager'.
src/editor/EditorManager.ts(409,15): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/EditorManager.ts(410,14): error TS2339: Property 'interactionController' does not exist on type 'EditorManager'.
src/editor/manager/EditorEventBinder.ts(39,30): error TS2339: Property 'manager' does not exist on type 'EditorEventBinder'.
src/editor/manager/EditorEventBinder.ts(62,60): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(66,57): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(71,59): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(75,36): error TS18046: 'input' is of type 'unknown'.
src/editor/manager/EditorEventBinder.ts(76,33): error TS18046: 'input' is of type 'unknown'.
src/editor/manager/EditorEventBinder.ts(82,61): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(83,56): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(84,67): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(95,48): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(97,46): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(113,46): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(123,49): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(133,49): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(144,48): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(154,49): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(162,50): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(171,47): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(189,59): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorEventBinder.ts(190,59): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorInteractionController.ts(5,29): error TS2339: Property 'manager' does not exist on type 'EditorInteractionController'.
src/editor/manager/EditorInteractionController.ts(28,15): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/manager/EditorInteractionController.ts(31,47): error TS2339: Property 'manager' does not exist on type 'EditorInteractionController'.
src/editor/manager/EditorInteractionController.ts(31,77): error TS2339: Property 'manager' does not exist on type 'EditorInteractionController'.
src/editor/manager/EditorInteractionController.ts(32,22): error TS2339: Property 'manager' does not exist on type 'EditorInteractionController'.
src/editor/manager/EditorInteractionController.ts(37,22): error TS2339: Property 'manager' does not exist on type 'EditorInteractionController'.
src/editor/manager/EditorInteractionController.ts(42,22): error TS2339: Property 'manager' does not exist on type 'EditorInteractionController'.
src/editor/manager/EditorInteractionController.ts(51,22): error TS2339: Property 'manager' does not exist on type 'EditorInteractionController'.
src/editor/manager/EditorInteractionController.ts(53,22): error TS2339: Property 'manager' does not exist on type 'EditorInteractionController'.
src/editor/manager/EditorInteractionController.ts(59,18): error TS2339: Property 'manager' does not exist on type 'EditorInteractionController'.
src/editor/manager/EditorManagerModule.ts(3,17): error TS7006: Parameter 'manager' implicitly has an 'any' type.
src/editor/manager/EditorManagerModule.ts(4,14): error TS2339: Property 'manager' does not exist on type 'EditorManagerModule'.
src/editor/manager/EditorManagerModule.ts(8,21): error TS2339: Property 'manager' does not exist on type 'EditorManagerModule'.
src/editor/manager/EditorManagerModule.ts(12,21): error TS2339: Property 'manager' does not exist on type 'EditorManagerModule'.
src/editor/manager/EditorManagerModule.ts(16,21): error TS2339: Property 'manager' does not exist on type 'EditorManagerModule'.
src/editor/manager/EditorManagerModule.ts(20,21): error TS2339: Property 'manager' does not exist on type 'EditorManagerModule'.
src/editor/manager/EditorUIController.ts(40,23): error TS7006: Parameter 'level' implicitly has an 'any' type.
src/editor/manager/EditorUIController.ts(47,19): error TS7006: Parameter 'skills' implicitly has an 'any' type.
src/editor/manager/EditorUIController.ts(71,26): error TS7006: Parameter 'panel' implicitly has an 'any' type.
src/editor/manager/EditorUIController.ts(84,26): error TS7006: Parameter 'button' implicitly has an 'any' type.
src/editor/manager/EditorUIController.ts(92,25): error TS7006: Parameter 'section' implicitly has an 'any' type.
src/editor/manager/EditorUIController.ts(107,14): error TS2339: Property 'manager' does not exist on type 'EditorUIController'.
src/editor/manager/EditorUIController.ts(115,49): error TS7006: Parameter 'def' implicitly has an 'any' type.
src/editor/manager/EditorUIController.ts(118,22): error TS2339: Property 'nameKey' does not exist on type '{}'.
src/editor/manager/EditorUIController.ts(119,52): error TS2339: Property 'nameKey' does not exist on type '{}'.
src/editor/manager/EditorUIController.ts(119,65): error TS2339: Property 'name' does not exist on type '{}'.
src/editor/manager/EditorUIController.ts(127,20): error TS7006: Parameter 'raw' implicitly has an 'any' type.
src/editor/manager/EditorUIController.ts(132,21): error TS7006: Parameter 'raw' implicitly has an 'any' type.
src/editor/modules/EditorConstants.ts(7,19): error TS2551: Property '_objectDefinitions' does not exist on type 'typeof EditorConstants'. Did you mean 'OBJECT_DEFINITIONS'?
src/editor/modules/EditorConstants.ts(8,18): error TS2551: Property '_objectDefinitions' does not exist on type 'typeof EditorConstants'. Did you mean 'OBJECT_DEFINITIONS'?
src/editor/modules/EditorConstants.ts(10,21): error TS2551: Property '_objectDefinitions' does not exist on type 'typeof EditorConstants'. Did you mean 'OBJECT_DEFINITIONS'?
src/editor/modules/EditorConstants.ts(14,19): error TS2551: Property '_enemyDefinitions' does not exist on type 'typeof EditorConstants'. Did you mean 'ENEMY_DEFINITIONS'?
src/editor/modules/EditorConstants.ts(14,46): error TS2551: Property '_enemyDefinitions' does not exist on type 'typeof EditorConstants'. Did you mean 'ENEMY_DEFINITIONS'?
src/editor/modules/EditorConstants.ts(15,18): error TS2551: Property '_enemyDefinitions' does not exist on type 'typeof EditorConstants'. Did you mean 'ENEMY_DEFINITIONS'?
src/editor/modules/EditorConstants.ts(17,21): error TS2551: Property '_enemyDefinitions' does not exist on type 'typeof EditorConstants'. Did you mean 'ENEMY_DEFINITIONS'?
src/editor/modules/EditorDomCache.ts(4,14): error TS2339: Property 'root' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(5,14): error TS2339: Property 'editorCanvas' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(6,14): error TS2339: Property 'mapPosition' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(7,14): error TS2339: Property 'mapNavButtons' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(8,14): error TS2339: Property 'mobileNavButtons' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(9,14): error TS2339: Property 'mobilePanels' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(10,14): error TS2339: Property 'selectedTilePreview' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(11,14): error TS2339: Property 'tileSummary' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(12,14): error TS2339: Property 'tileList' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(13,14): error TS2339: Property 'npcsList' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(14,14): error TS2339: Property 'npcText' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(15,14): error TS2339: Property 'npcConditionalText' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(16,14): error TS2339: Property 'npcConditionalVariable' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(17,14): error TS2339: Property 'npcRewardVariable' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(18,14): error TS2339: Property 'npcConditionalRewardVariable' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(19,14): error TS2339: Property 'btnToggleNpcConditional' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(20,14): error TS2339: Property 'npcConditionalSection' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(21,14): error TS2339: Property 'npcVariantButtons' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(22,14): error TS2339: Property 'worldGrid' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(23,14): error TS2339: Property 'titleInput' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(24,14): error TS2339: Property 'authorInput' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(25,14): error TS2339: Property 'fileInput' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(26,14): error TS2339: Property 'objectTypes' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(27,14): error TS2339: Property 'objectsList' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(28,14): error TS2339: Property 'btnNpcDelete' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(29,14): error TS2339: Property 'npcEditor' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(30,14): error TS2339: Property 'btnGenerateUrl' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(31,14): error TS2339: Property 'shareUrlInput' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(32,14): error TS2339: Property 'btnUndo' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(33,14): error TS2339: Property 'btnRedo' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(34,14): error TS2339: Property 'enemyTypes' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(35,14): error TS2339: Property 'enemiesList' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(36,14): error TS2339: Property 'projectVariablesContainer' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(37,14): error TS2339: Property 'projectVariablesToggle' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(38,14): error TS2339: Property 'projectVariableList' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(39,14): error TS2339: Property 'projectVariableSummary' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(40,14): error TS2339: Property 'projectSkillsContainer' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(41,14): error TS2339: Property 'projectSkillsToggle' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(42,14): error TS2339: Property 'projectSkillsList' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(43,14): error TS2339: Property 'projectTestContainer' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(44,14): error TS2339: Property 'projectTestToggle' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(45,14): error TS2339: Property 'projectTestPanel' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(46,14): error TS2339: Property 'projectTestStartLevel' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(47,14): error TS2339: Property 'projectTestSkillList' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorDomCache.ts(48,14): error TS2339: Property 'projectTestGodMode' does not exist on type 'EditorDomCache'.
src/editor/modules/EditorEnemyService.ts(6,17): error TS7006: Parameter 'editorManager' implicitly has an 'any' type.
src/editor/modules/EditorEnemyService.ts(7,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(8,14): error TS2551: Property 'editorIndicator' does not exist on type 'EditorEnemyService'. Did you mean 'getEditorIndicator'?
src/editor/modules/EditorEnemyService.ts(9,14): error TS2339: Property 'editorIndicatorTimeout' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(13,21): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(17,21): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(21,21): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(25,57): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(29,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(31,18): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(51,18): error TS7006: Parameter 'coord' implicitly has an 'any' type.
src/editor/modules/EditorEnemyService.ts(53,80): error TS7006: Parameter 'enemy' implicitly has an 'any' type.
src/editor/modules/EditorEnemyService.ts(60,50): error TS7006: Parameter 'count' implicitly has an 'any' type.
src/editor/modules/EditorEnemyService.ts(60,57): error TS7006: Parameter 'enemy' implicitly has an 'any' type.
src/editor/modules/EditorEnemyService.ts(79,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(80,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(81,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(82,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(83,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(84,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(85,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(88,17): error TS7006: Parameter 'enemyId' implicitly has an 'any' type.
src/editor/modules/EditorEnemyService.ts(90,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(91,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(92,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(93,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(94,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(95,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(96,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(99,31): error TS7006: Parameter 'enemyId' implicitly has an 'any' type.
src/editor/modules/EditorEnemyService.ts(99,40): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/editor/modules/EditorEnemyService.ts(105,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(106,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(107,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(108,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(111,21): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/editor/modules/EditorEnemyService.ts(115,18): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(116,18): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(122,43): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(124,14): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(127,18): error TS2339: Property 'manager' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(133,18): error TS2551: Property 'editorIndicator' does not exist on type 'EditorEnemyService'. Did you mean 'getEditorIndicator'?
src/editor/modules/EditorEnemyService.ts(133,47): error TS2551: Property 'editorIndicator' does not exist on type 'EditorEnemyService'. Did you mean 'getEditorIndicator'?
src/editor/modules/EditorEnemyService.ts(141,14): error TS2551: Property 'editorIndicator' does not exist on type 'EditorEnemyService'. Did you mean 'getEditorIndicator'?
src/editor/modules/EditorEnemyService.ts(147,18): error TS2339: Property 'editorIndicatorTimeout' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(148,31): error TS2339: Property 'editorIndicatorTimeout' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(149,18): error TS2339: Property 'editorIndicatorTimeout' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(158,18): error TS2339: Property 'editorIndicatorTimeout' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(162,22): error TS2339: Property 'editorIndicatorTimeout' does not exist on type 'EditorEnemyService'.
src/editor/modules/EditorEnemyService.ts(176,57): error TS2339: Property 'length' does not exist on type 'never'.
src/editor/modules/EditorEnemyService.ts(184,34): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/editor/modules/EditorEnemyService.ts(185,31): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/editor/modules/EditorExportService.ts(7,14): error TS2339: Property 'btn' does not exist on type 'EditorExportService'.
src/editor/modules/EditorExportService.ts(8,18): error TS2339: Property 'btn' does not exist on type 'EditorExportService'.
src/editor/modules/EditorExportService.ts(9,18): error TS2339: Property 'btn' does not exist on type 'EditorExportService'.
src/editor/modules/EditorExportService.ts(9,49): error TS7006: Parameter '_ev' implicitly has an 'any' type.
src/editor/modules/EditorExportService.ts(33,46): error TS2345: Argument of type 'string | null' is not assignable to parameter of type 'URL | RequestInfo'.
  Type 'null' is not assignable to type 'URL | RequestInfo'.
src/editor/modules/EditorExportService.ts(54,21): error TS7053: Element implicitly has an 'any' type because expression of type '"export.bundle.js"' can't be used to index type '{}'.
  Property 'export.bundle.js' does not exist on type '{}'.
src/editor/modules/EditorExportService.ts(170,91): error TS18047: 'src' is possibly 'null'.
src/editor/modules/EditorExportService.ts(176,46): error TS2345: Argument of type 'string | null' is not assignable to parameter of type 'URL | RequestInfo'.
  Type 'null' is not assignable to type 'URL | RequestInfo'.
src/editor/modules/EditorExportService.ts(183,37): error TS2538: Type 'null' cannot be used as an index type.
src/editor/modules/EditorExportService.ts(226,34): error TS2339: Property 'outerHTML' does not exist on type 'Node'.
src/editor/modules/EditorExportService.ts(238,47): error TS2339: Property 'title' does not exist on type '{}'.
src/editor/modules/EditorExportService.ts(238,77): error TS2339: Property 'title' does not exist on type '{}'.
src/editor/modules/EditorExportService.ts(245,41): error TS2304: Cannot find name 'ShareConstants'.
src/editor/modules/EditorExportService.ts(245,75): error TS2304: Cannot find name 'ShareConstants'.
src/editor/modules/EditorExportService.ts(246,19): error TS2304: Cannot find name 'ShareConstants'.
src/editor/modules/EditorHistoryManager.ts(3,17): error TS7006: Parameter 'editorManager' implicitly has an 'any' type.
src/editor/modules/EditorHistoryManager.ts(4,14): error TS2339: Property 'editorManager' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(5,14): error TS2339: Property 'stack' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(6,14): error TS2339: Property 'index' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(9,18): error TS7006: Parameter 'snapshot' implicitly has an 'any' type.
src/editor/modules/EditorHistoryManager.ts(10,18): error TS2339: Property 'stack' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(10,29): error TS2339: Property 'index' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(11,14): error TS2339: Property 'stack' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(11,27): error TS2339: Property 'stack' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(11,47): error TS2339: Property 'index' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(12,14): error TS2339: Property 'stack' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(13,14): error TS2339: Property 'index' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(13,27): error TS2339: Property 'stack' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(17,46): error TS2339: Property 'editorManager' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(22,21): error TS2339: Property 'index' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(26,21): error TS2339: Property 'index' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(26,34): error TS2339: Property 'stack' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(31,14): error TS2339: Property 'index' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(37,14): error TS2339: Property 'index' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(42,31): error TS2339: Property 'stack' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(42,42): error TS2339: Property 'index' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorHistoryManager.ts(45,14): error TS2339: Property 'editorManager' does not exist on type 'EditorHistoryManager'.
src/editor/modules/EditorNpcService.ts(4,17): error TS7006: Parameter 'editorManager' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(5,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(12,7): error TS7006: Parameter 'key' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(21,21): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(25,21): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(29,21): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(37,19): error TS7006: Parameter 'def' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(39,36): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(41,20): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(63,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(64,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(65,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(66,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(67,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(68,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(78,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(80,18): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(111,18): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(122,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(123,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(124,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(125,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(126,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(127,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(130,24): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(130,30): error TS7006: Parameter 'id' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(137,56): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(144,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(148,16): error TS7006: Parameter 'coord' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(165,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(166,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(167,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(168,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(169,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(170,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(173,28): error TS7006: Parameter 'selectElement' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(176,50): error TS2339: Property 'includeBardSkill' does not exist on type '{}'.
src/editor/modules/EditorNpcService.ts(191,28): error TS7006: Parameter 'variable' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(201,19): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(203,56): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(208,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(209,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(213,30): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(215,56): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(218,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(219,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(228,18): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(232,35): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(234,56): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(237,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(238,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(239,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(240,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(243,32): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(245,56): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(248,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(249,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(250,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(251,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(254,43): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(256,56): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(259,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(260,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(261,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(262,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorNpcService.ts(265,22): error TS7006: Parameter 'variant' implicitly has an 'any' type.
src/editor/modules/EditorNpcService.ts(271,14): error TS2339: Property 'manager' does not exist on type 'EditorNpcService'.
src/editor/modules/EditorObjectService.ts(5,17): error TS7006: Parameter 'editorManager' implicitly has an 'any' type.
src/editor/modules/EditorObjectService.ts(6,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(10,21): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(14,21): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(18,21): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(21,21): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/editor/modules/EditorObjectService.ts(22,96): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(29,18): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(39,18): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(46,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(49,19): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/editor/modules/EditorObjectService.ts(49,25): error TS7006: Parameter 'coord' implicitly has an 'any' type.
src/editor/modules/EditorObjectService.ts(49,32): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/editor/modules/EditorObjectService.ts(52,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(53,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(54,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(55,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(56,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(57,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(58,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(61,18): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/editor/modules/EditorObjectService.ts(61,24): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/editor/modules/EditorObjectService.ts(66,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(67,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(68,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(69,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(70,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(71,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(72,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(75,22): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/editor/modules/EditorObjectService.ts(78,18): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(79,18): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(85,60): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(87,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(89,18): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(93,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(97,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(101,43): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(104,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(109,18): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(114,25): error TS7006: Parameter 'roomIndex' implicitly has an 'any' type.
src/editor/modules/EditorObjectService.ts(114,36): error TS7006: Parameter 'text' implicitly has an 'any' type.
src/editor/modules/EditorObjectService.ts(116,14): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(125,18): error TS2339: Property 'manager' does not exist on type 'EditorObjectService'.
src/editor/modules/EditorObjectService.ts(129,19): error TS7006: Parameter 'type' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(12,17): error TS7006: Parameter 'editorManager' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(13,14): error TS2339: Property 'manager' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(14,14): error TS2339: Property 'canvasRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(14,56): error TS2345: Argument of type 'this' is not assignable to parameter of type 'EditorRendererServiceLike'.
  Property 'manager' is missing in type 'EditorRenderService' but required in type 'EditorRendererServiceLike'.
src/editor/modules/EditorRenderService.ts(15,14): error TS2339: Property 'tilePanelRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(15,62): error TS2345: Argument of type 'this' is not assignable to parameter of type 'EditorRendererServiceLike'.
  Property 'manager' is missing in type 'EditorRenderService' but required in type 'EditorRendererServiceLike'.
src/editor/modules/EditorRenderService.ts(16,14): error TS2339: Property 'npcRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(16,50): error TS2345: Argument of type 'this' is not assignable to parameter of type 'EditorRendererServiceLike'.
  Property 'manager' is missing in type 'EditorRenderService' but required in type 'EditorRendererServiceLike'.
src/editor/modules/EditorRenderService.ts(17,14): error TS2339: Property 'enemyRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(17,54): error TS2345: Argument of type 'this' is not assignable to parameter of type 'EditorRendererServiceLike'.
  Property 'manager' is missing in type 'EditorRenderService' but required in type 'EditorRendererServiceLike'.
src/editor/modules/EditorRenderService.ts(18,14): error TS2339: Property 'worldRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(18,54): error TS2345: Argument of type 'this' is not assignable to parameter of type 'EditorRendererServiceLike'.
  Property 'manager' is missing in type 'EditorRenderService' but required in type 'EditorRendererServiceLike'.
src/editor/modules/EditorRenderService.ts(19,14): error TS2339: Property 'objectRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(19,56): error TS2345: Argument of type 'this' is not assignable to parameter of type 'EditorRendererServiceLike'.
  Property 'manager' is missing in type 'EditorRenderService' but required in type 'EditorRendererServiceLike'.
src/editor/modules/EditorRenderService.ts(20,14): error TS2339: Property 'handleTileAnimationFrame' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(24,68): error TS2339: Property 'handleTileAnimationFrame' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(31,7): error TS7006: Parameter 'key' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(39,8): error TS7006: Parameter 'key' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(46,48): error TS7006: Parameter '_' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(46,51): error TS7006: Parameter 'token' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(46,62): error TS7053: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{}'.
src/editor/modules/EditorRenderService.ts(50,21): error TS2339: Property 'manager' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(54,21): error TS2339: Property 'manager' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(58,21): error TS2339: Property 'manager' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(65,22): error TS7006: Parameter 'raw' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(72,28): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(80,14): error TS2339: Property 'canvasRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(81,14): error TS2339: Property 'worldRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(85,14): error TS2339: Property 'tilePanelRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(89,14): error TS2339: Property 'npcRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(93,14): error TS2339: Property 'npcRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(97,14): error TS2339: Property 'enemyRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(101,14): error TS2339: Property 'enemyRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(105,14): error TS2339: Property 'objectRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(109,14): error TS2339: Property 'objectRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(113,14): error TS2339: Property 'worldRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(117,14): error TS2339: Property 'worldRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(120,23): error TS7006: Parameter 'col' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(120,28): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(121,14): error TS2339: Property 'worldRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(125,14): error TS2339: Property 'tilePanelRenderer' does not exist on type 'EditorRenderService'.
src/editor/modules/EditorRenderService.ts(138,14): error TS7006: Parameter 'count' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(138,21): error TS7006: Parameter 'variable' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(169,28): error TS7006: Parameter 'variable' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(241,28): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(275,49): error TS7006: Parameter 'variable' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(276,29): error TS7006: Parameter 'id' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(285,26): error TS7006: Parameter 'npc' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(298,26): error TS7006: Parameter 'enemy' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(301,26): error TS7006: Parameter 'object' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(322,24): error TS7006: Parameter 'skills' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(322,32): error TS7006: Parameter 'levelMap' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(324,25): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/editor/modules/EditorRenderService.ts(421,51): error TS2339: Property 'name' does not exist on type '{ id: string; nameKey: string; descriptionKey: string; icon: string; }'.
src/editor/modules/EditorRenderService.ts(422,30): error TS2339: Property 'name' does not exist on type '{ id: string; nameKey: string; descriptionKey: string; icon: string; }'.
src/editor/modules/EditorShareService.ts(6,17): error TS7006: Parameter 'editorManager' implicitly has an 'any' type.
src/editor/modules/EditorShareService.ts(7,14): error TS2339: Property 'manager' does not exist on type 'EditorShareService'.
src/editor/modules/EditorShareService.ts(8,14): error TS2339: Property 'shareTracker' does not exist on type 'EditorShareService'.
src/editor/modules/EditorShareService.ts(15,7): error TS7006: Parameter 'key' implicitly has an 'any' type.
src/editor/modules/EditorShareService.ts(28,31): error TS2339: Property 'manager' does not exist on type 'EditorShareService'.
src/editor/modules/EditorShareService.ts(38,25): error TS7006: Parameter 'url' implicitly has an 'any' type.
src/editor/modules/EditorShareService.ts(39,28): error TS2339: Property 'manager' does not exist on type 'EditorShareService'.
src/editor/modules/EditorShareService.ts(68,35): error TS7017: Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.
src/editor/modules/EditorShareService.ts(69,39): error TS7017: Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.
src/editor/modules/EditorShareService.ts(74,25): error TS7006: Parameter 'url' implicitly has an 'any' type.
src/editor/modules/EditorShareService.ts(75,19): error TS2339: Property 'shareTracker' does not exist on type 'EditorShareService'.
src/editor/modules/EditorShareService.ts(77,31): error TS2339: Property 'shareTracker' does not exist on type 'EditorShareService'.
src/editor/modules/EditorShareService.ts(83,34): error TS2339: Property 'manager' does not exist on type 'EditorShareService'.
src/editor/modules/EditorShareService.ts(96,18): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/modules/EditorShareService.ts(102,41): error TS2345: Argument of type 'string | ArrayBuffer | null' is not assignable to parameter of type 'string'.
  Type 'null' is not assignable to type 'string'.
src/editor/modules/EditorShareService.ts(103,22): error TS2339: Property 'manager' does not exist on type 'EditorShareService'.
src/editor/modules/EditorShareService.ts(104,22): error TS2339: Property 'manager' does not exist on type 'EditorShareService'.
src/editor/modules/EditorState.ts(4,14): error TS2339: Property 'selectedTileId' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(5,14): error TS2339: Property 'selectedNpcId' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(6,14): error TS2339: Property 'selectedNpcType' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(7,14): error TS2339: Property 'activeRoomIndex' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(8,14): error TS2339: Property 'placingNpc' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(9,14): error TS2339: Property 'placingEnemy' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(10,14): error TS2339: Property 'placingObjectType' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(11,14): error TS2339: Property 'selectedObjectType' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(12,14): error TS2339: Property 'selectedEnemyType' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(13,14): error TS2339: Property 'mapPainting' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(14,14): error TS2339: Property 'skipMapHistory' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(15,14): error TS2339: Property 'npcTextUpdateTimer' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(16,14): error TS2339: Property 'suppressNpcFormUpdates' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(17,14): error TS2339: Property 'conditionalDialogueExpanded' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(18,14): error TS2339: Property 'activeMobilePanel' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(19,14): error TS2339: Property 'npcVariantFilter' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(20,14): error TS2339: Property 'playerEndTextUpdateTimer' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(21,14): error TS2339: Property 'variablePanelCollapsed' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(22,14): error TS2339: Property 'skillPanelCollapsed' does not exist on type 'EditorState'.
src/editor/modules/EditorState.ts(23,14): error TS2339: Property 'testPanelCollapsed' does not exist on type 'EditorState'.
src/editor/modules/EditorTileService.ts(3,17): error TS7006: Parameter 'editorManager' implicitly has an 'any' type.
src/editor/modules/EditorTileService.ts(4,14): error TS2339: Property 'manager' does not exist on type 'EditorTileService'.
src/editor/modules/EditorTileService.ts(8,21): error TS2339: Property 'manager' does not exist on type 'EditorTileService'.
src/editor/modules/EditorTileService.ts(12,21): error TS2339: Property 'manager' does not exist on type 'EditorTileService'.
src/editor/modules/EditorTileService.ts(15,16): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/modules/EditorTileService.ts(26,19): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/modules/EditorTileService.ts(31,17): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/modules/EditorTileService.ts(42,14): error TS2339: Property 'manager' does not exist on type 'EditorTileService'.
src/editor/modules/EditorTileService.ts(43,14): error TS2339: Property 'manager' does not exist on type 'EditorTileService'.
src/editor/modules/EditorTileService.ts(44,14): error TS2339: Property 'manager' does not exist on type 'EditorTileService'.
src/editor/modules/EditorTileService.ts(45,14): error TS2339: Property 'manager' does not exist on type 'EditorTileService'.
src/editor/modules/EditorTileService.ts(48,16): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/modules/EditorTileService.ts(54,18): error TS2339: Property 'manager' does not exist on type 'EditorTileService'.
src/editor/modules/EditorTileService.ts(59,18): error TS2339: Property 'manager' does not exist on type 'EditorTileService'.
src/editor/modules/EditorTileService.ts(64,18): error TS2339: Property 'manager' does not exist on type 'EditorTileService'.
src/editor/modules/EditorTileService.ts(70,14): error TS2339: Property 'manager' does not exist on type 'EditorTileService'.
src/editor/modules/EditorTileService.ts(71,14): error TS2339: Property 'manager' does not exist on type 'EditorTileService'.
src/editor/modules/EditorTileService.ts(72,14): error TS2339: Property 'manager' does not exist on type 'EditorTileService'.
src/editor/modules/EditorTileService.ts(80,18): error TS2339: Property 'manager' does not exist on type 'EditorTileService'.
src/editor/modules/EditorTileService.ts(81,18): error TS2339: Property 'manager' does not exist on type 'EditorTileService'.
src/editor/modules/EditorTileService.ts(86,22): error TS7006: Parameter 'ev' implicitly has an 'any' type.
src/editor/modules/EditorVariableService.ts(29,82): error TS7006: Parameter 'entry' implicitly has an 'any' type.
src/editor/modules/renderers/EditorEnemyRenderer.ts(40,58): error TS18047: 'definition' is possibly 'null'.
src/editor/modules/renderers/EditorNpcRenderer.ts(138,53): error TS2345: Argument of type 'EditorNpcLike | undefined' is not assignable to parameter of type 'EditorNpcLike | null'.
  Type 'undefined' is not assignable to type 'EditorNpcLike | null'.
src/editor/modules/renderers/EditorObjectRenderer.ts(41,56): error TS7006: Parameter 'object' implicitly has an 'any' type.
src/editor/modules/renderers/EditorObjectRenderer.ts(131,34): error TS2339: Property 'worldRenderer' does not exist on type 'EditorRendererServiceLike'.
src/main.ts(31,45): error TS7017: Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.
src/main.ts(47,24): error TS7006: Parameter 'data' implicitly has an 'any' type.
src/main.ts(51,20): error TS7006: Parameter 'tileId' implicitly has an 'any' type.
src/main.ts(51,28): error TS7006: Parameter 'data' implicitly has an 'any' type.
src/main.ts(52,20): error TS7006: Parameter 'x' implicitly has an 'any' type.
src/main.ts(52,23): error TS7006: Parameter 'y' implicitly has an 'any' type.
src/main.ts(52,26): error TS7006: Parameter 'tileId' implicitly has an 'any' type.
src/main.ts(57,28): error TS7006: Parameter 'variableId' implicitly has an 'any' type.
src/main.ts(57,40): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/main.ts(59,19): error TS7006: Parameter 'npc' implicitly has an 'any' type.
src/main.ts(61,46): error TS2339: Property 'resetNPCs' does not exist on type 'NpcManagerLike'.
