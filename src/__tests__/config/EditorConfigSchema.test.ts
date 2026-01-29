import { describe, it, expect } from 'vitest';
import { EditorConfigSchema } from '../../config/EditorConfigSchema';

describe('EditorConfigSchema', () => {
  describe('Valid configuration', () => {
    it('should create a valid configuration instance', () => {
      const config = new EditorConfigSchema({
        canvas: {
          width: 384,
          height: 384,
        },
        preview: {
          npcSize: 48,
          enemySize: 48,
          objectSize: 48,
          tileSize: 64,
        },
        grid: {
          cellSize: 48,
          lineColor: '#cccccc',
          lineWidth: 1,
        },
        history: {
          maxStates: 50,
        },
        export: {
          defaultFileName: 'my-rpg-game.html',
          mimeType: 'text/html',
        },
      });

      expect(config.canvas.width).toBe(384);
      expect(config.canvas.height).toBe(384);
      expect(config.preview.npcSize).toBe(48);
      expect(config.grid.cellSize).toBe(48);
      expect(config.history.maxStates).toBe(50);
      expect(config.export.defaultFileName).toBe('my-rpg-game.html');
    });

    it('should return immutable copies from getters', () => {
      const config = new EditorConfigSchema({
        canvas: { width: 384, height: 384 },
        preview: { npcSize: 48, enemySize: 48, objectSize: 48, tileSize: 64 },
        grid: { cellSize: 48, lineColor: '#cccccc', lineWidth: 1 },
        history: { maxStates: 50 },
        export: { defaultFileName: 'test.html', mimeType: 'text/html' },
      });

      const canvas1 = config.canvas;
      const canvas2 = config.canvas;

      // Should return different objects (not the same reference)
      expect(canvas1).not.toBe(canvas2);
      // But with the same values
      expect(canvas1).toEqual(canvas2);
    });

    it('should export to JSON correctly', () => {
      const config = new EditorConfigSchema({
        canvas: { width: 384, height: 384 },
        preview: { npcSize: 48, enemySize: 48, objectSize: 48, tileSize: 64 },
        grid: { cellSize: 48, lineColor: '#cccccc', lineWidth: 1 },
        history: { maxStates: 50 },
        export: { defaultFileName: 'test.html', mimeType: 'text/html' },
      });

      const json = config.toJSON();

      expect(json).toEqual({
        canvas: { width: 384, height: 384 },
        preview: { npcSize: 48, enemySize: 48, objectSize: 48, tileSize: 64 },
        grid: { cellSize: 48, lineColor: '#cccccc', lineWidth: 1 },
        history: { maxStates: 50 },
        export: { defaultFileName: 'test.html', mimeType: 'text/html' },
      });
    });
  });

  describe('Canvas validation', () => {
    it('should reject negative canvas width', () => {
      expect(() => {
        new EditorConfigSchema({
          canvas: { width: -100, height: 384 },
          preview: { npcSize: 48, enemySize: 48, objectSize: 48, tileSize: 64 },
          grid: { cellSize: 48, lineColor: '#cccccc', lineWidth: 1 },
          history: { maxStates: 50 },
          export: { defaultFileName: 'test.html', mimeType: 'text/html' },
        });
      }).toThrow('Invalid canvas width');
    });

    it('should reject zero canvas height', () => {
      expect(() => {
        new EditorConfigSchema({
          canvas: { width: 384, height: 0 },
          preview: { npcSize: 48, enemySize: 48, objectSize: 48, tileSize: 64 },
          grid: { cellSize: 48, lineColor: '#cccccc', lineWidth: 1 },
          history: { maxStates: 50 },
          export: { defaultFileName: 'test.html', mimeType: 'text/html' },
        });
      }).toThrow('Invalid canvas height');
    });

    it('should reject non-integer canvas dimensions', () => {
      expect(() => {
        new EditorConfigSchema({
          canvas: { width: 384.5, height: 384 },
          preview: { npcSize: 48, enemySize: 48, objectSize: 48, tileSize: 64 },
          grid: { cellSize: 48, lineColor: '#cccccc', lineWidth: 1 },
          history: { maxStates: 50 },
          export: { defaultFileName: 'test.html', mimeType: 'text/html' },
        });
      }).toThrow('Invalid canvas width');
    });
  });

  describe('Preview validation', () => {
    it('should reject negative preview sizes', () => {
      expect(() => {
        new EditorConfigSchema({
          canvas: { width: 384, height: 384 },
          preview: { npcSize: -48, enemySize: 48, objectSize: 48, tileSize: 64 },
          grid: { cellSize: 48, lineColor: '#cccccc', lineWidth: 1 },
          history: { maxStates: 50 },
          export: { defaultFileName: 'test.html', mimeType: 'text/html' },
        });
      }).toThrow('Invalid NPC preview size');
    });

    it('should reject non-integer preview sizes', () => {
      expect(() => {
        new EditorConfigSchema({
          canvas: { width: 384, height: 384 },
          preview: { npcSize: 48, enemySize: 48.7, objectSize: 48, tileSize: 64 },
          grid: { cellSize: 48, lineColor: '#cccccc', lineWidth: 1 },
          history: { maxStates: 50 },
          export: { defaultFileName: 'test.html', mimeType: 'text/html' },
        });
      }).toThrow('Invalid enemy preview size');
    });
  });

  describe('Grid validation', () => {
    it('should reject invalid grid line color', () => {
      expect(() => {
        new EditorConfigSchema({
          canvas: { width: 384, height: 384 },
          preview: { npcSize: 48, enemySize: 48, objectSize: 48, tileSize: 64 },
          grid: { cellSize: 48, lineColor: 'not-a-color', lineWidth: 1 },
          history: { maxStates: 50 },
          export: { defaultFileName: 'test.html', mimeType: 'text/html' },
        });
      }).toThrow('Invalid grid line color');
    });

    it('should accept valid hex colors', () => {
      const config = new EditorConfigSchema({
        canvas: { width: 384, height: 384 },
        preview: { npcSize: 48, enemySize: 48, objectSize: 48, tileSize: 64 },
        grid: { cellSize: 48, lineColor: '#abc', lineWidth: 1 },
        history: { maxStates: 50 },
        export: { defaultFileName: 'test.html', mimeType: 'text/html' },
      });

      expect(config.grid.lineColor).toBe('#abc');
    });

    it('should reject negative line width', () => {
      expect(() => {
        new EditorConfigSchema({
          canvas: { width: 384, height: 384 },
          preview: { npcSize: 48, enemySize: 48, objectSize: 48, tileSize: 64 },
          grid: { cellSize: 48, lineColor: '#cccccc', lineWidth: -1 },
          history: { maxStates: 50 },
          export: { defaultFileName: 'test.html', mimeType: 'text/html' },
        });
      }).toThrow('Invalid grid line width');
    });
  });

  describe('History validation', () => {
    it('should reject zero max states', () => {
      expect(() => {
        new EditorConfigSchema({
          canvas: { width: 384, height: 384 },
          preview: { npcSize: 48, enemySize: 48, objectSize: 48, tileSize: 64 },
          grid: { cellSize: 48, lineColor: '#cccccc', lineWidth: 1 },
          history: { maxStates: 0 },
          export: { defaultFileName: 'test.html', mimeType: 'text/html' },
        });
      }).toThrow('Invalid max history states');
    });
  });

  describe('Export validation', () => {
    it('should reject empty file name', () => {
      expect(() => {
        new EditorConfigSchema({
          canvas: { width: 384, height: 384 },
          preview: { npcSize: 48, enemySize: 48, objectSize: 48, tileSize: 64 },
          grid: { cellSize: 48, lineColor: '#cccccc', lineWidth: 1 },
          history: { maxStates: 50 },
          export: { defaultFileName: '', mimeType: 'text/html' },
        });
      }).toThrow('Invalid default file name');
    });

    it('should reject empty MIME type', () => {
      expect(() => {
        new EditorConfigSchema({
          canvas: { width: 384, height: 384 },
          preview: { npcSize: 48, enemySize: 48, objectSize: 48, tileSize: 64 },
          grid: { cellSize: 48, lineColor: '#cccccc', lineWidth: 1 },
          history: { maxStates: 50 },
          export: { defaultFileName: 'test.html', mimeType: '' },
        });
      }).toThrow('Invalid MIME type');
    });
  });
});
