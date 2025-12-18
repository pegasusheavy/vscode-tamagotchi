import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock vscode module
vi.mock('vscode', () => ({
  workspace: {
    getConfiguration: vi.fn(() => ({
      get: vi.fn((key: string, defaultValue: unknown) => defaultValue),
    })),
  },
}));

// Import after mocking
import { Tamagotchi } from './tamagotchi';

// Helper to create a mock ExtensionContext
function createMockContext() {
  const storage = new Map<string, unknown>();
  return {
    globalState: {
      get: vi.fn((key: string) => storage.get(key)),
      update: vi.fn((key: string, value: unknown) => {
        storage.set(key, value);
        return Promise.resolve();
      }),
    },
    subscriptions: [],
    extensionPath: '/mock/path',
    storagePath: '/mock/storage',
    globalStoragePath: '/mock/global-storage',
    logPath: '/mock/log',
    extensionUri: { fsPath: '/mock/path' },
    globalStorageUri: { fsPath: '/mock/global-storage' },
    logUri: { fsPath: '/mock/log' },
    storageUri: { fsPath: '/mock/storage' },
    extensionMode: 1,
    extension: { id: 'test.extension' },
    asAbsolutePath: (path: string) => `/mock/path/${path}`,
    environmentVariableCollection: {},
    secrets: { get: vi.fn(), store: vi.fn(), delete: vi.fn() },
    languageModelAccessInformation: {},
  } as unknown as import('vscode').ExtensionContext;
}

describe('Tamagotchi', () => {
  let tamagotchi: Tamagotchi;
  let mockContext: import('vscode').ExtensionContext;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = createMockContext();
    tamagotchi = new Tamagotchi(mockContext);
  });

  describe('initialization', () => {
    it('should create a new pet with default stats', () => {
      const state = tamagotchi.getState();

      expect(state.name).toBe('Tama');
      expect(state.stats.hunger).toBe(80);
      expect(state.stats.happiness).toBe(80);
      expect(state.stats.energy).toBe(100);
      expect(state.stats.health).toBe(100);
      expect(state.stats.cleanliness).toBe(100);
      expect(state.stats.age).toBe(0);
      expect(state.stats.stage).toBe('egg');
      expect(state.stats.isAlive).toBe(true);
      expect(state.mood).toBe('happy');
      expect(state.currentAction).toBe('idle');
    });

    it('should have a birth date', () => {
      const state = tamagotchi.getState();
      expect(state.birthDate).toBeDefined();
      expect(state.birthDate).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('feed()', () => {
    it('should increase hunger when fed', () => {
      const initialHunger = tamagotchi.getState().stats.hunger;
      const result = tamagotchi.feed();

      expect(result.success).toBe(true);
      expect(result.message).toContain('enjoyed the meal');
      expect(tamagotchi.getState().stats.hunger).toBe(
        Math.min(100, initialHunger + 25)
      );
    });

    it('should increase happiness slightly when fed', () => {
      const initialHappiness = tamagotchi.getState().stats.happiness;
      tamagotchi.feed();

      expect(tamagotchi.getState().stats.happiness).toBe(
        Math.min(100, initialHappiness + 5)
      );
    });

    it('should set action to eating', () => {
      tamagotchi.feed();
      expect(tamagotchi.getState().currentAction).toBe('eating');
    });

    it('should not feed when already full', () => {
      // Feed until full
      for (let i = 0; i < 10; i++) {
        tamagotchi.feed();
      }

      const result = tamagotchi.feed();
      expect(result.success).toBe(false);
      expect(result.message).toContain('too full');
    });

    it('should not feed when sleeping', () => {
      // Drain energy so pet can sleep
      tamagotchi.play();
      tamagotchi.play();
      tamagotchi.sleep();
      const result = tamagotchi.feed();

      expect(result.success).toBe(false);
      expect(result.message).toContain('sleeping');
    });
  });

  describe('play()', () => {
    it('should increase happiness when playing', () => {
      const initialHappiness = tamagotchi.getState().stats.happiness;
      const result = tamagotchi.play();

      expect(result.success).toBe(true);
      expect(result.message).toContain('fun playing');
      expect(tamagotchi.getState().stats.happiness).toBe(
        Math.min(100, initialHappiness + 20)
      );
    });

    it('should decrease energy when playing', () => {
      const initialEnergy = tamagotchi.getState().stats.energy;
      tamagotchi.play();

      expect(tamagotchi.getState().stats.energy).toBe(
        Math.max(0, initialEnergy - 15)
      );
    });

    it('should decrease hunger when playing', () => {
      const initialHunger = tamagotchi.getState().stats.hunger;
      tamagotchi.play();

      expect(tamagotchi.getState().stats.hunger).toBe(
        Math.max(0, initialHunger - 5)
      );
    });

    it('should not play when too tired', () => {
      // Drain energy
      for (let i = 0; i < 10; i++) {
        tamagotchi.play();
      }

      const result = tamagotchi.play();
      expect(result.success).toBe(false);
      expect(result.message).toContain('too tired');
    });

    it('should not play when sleeping', () => {
      // Drain energy so pet can sleep
      tamagotchi.play();
      tamagotchi.play();
      tamagotchi.sleep();
      const result = tamagotchi.play();

      expect(result.success).toBe(false);
      expect(result.message).toContain('sleeping');
    });
  });

  describe('sleep()', () => {
    it('should put pet to sleep', () => {
      // Drain some energy first
      tamagotchi.play();
      tamagotchi.play();

      const result = tamagotchi.sleep();

      expect(result.success).toBe(true);
      expect(result.message).toContain('sleeping');
      expect(tamagotchi.getState().currentAction).toBe('sleeping');
      expect(tamagotchi.getState().mood).toBe('sleeping');
    });

    it('should wake up when called while sleeping', () => {
      tamagotchi.play();
      tamagotchi.sleep();

      const result = tamagotchi.sleep();

      expect(result.success).toBe(true);
      expect(result.message).toContain('woke up');
      expect(tamagotchi.getState().currentAction).toBe('idle');
    });

    it('should not sleep when energy is full', () => {
      const result = tamagotchi.sleep();

      expect(result.success).toBe(false);
      expect(result.message).toContain("isn't tired");
    });
  });

  describe('clean()', () => {
    it('should increase cleanliness', () => {
      // First decrease cleanliness significantly (0.3 per tick, need >17 ticks to go below 95)
      for (let i = 0; i < 20; i++) {
        tamagotchi.tick();
      }

      const initialCleanliness = tamagotchi.getState().stats.cleanliness;
      expect(initialCleanliness).toBeLessThan(95);
      
      const result = tamagotchi.clean();

      expect(result.success).toBe(true);
      expect(result.message).toContain('squeaky clean');
      expect(tamagotchi.getState().stats.cleanliness).toBe(
        Math.min(100, initialCleanliness + 30)
      );
    });

    it('should not clean when already clean', () => {
      const result = tamagotchi.clean();

      expect(result.success).toBe(false);
      expect(result.message).toContain('already clean');
    });

    it('should not clean when sleeping', () => {
      tamagotchi.play();
      tamagotchi.sleep();
      const result = tamagotchi.clean();

      expect(result.success).toBe(false);
      expect(result.message).toContain('sleeping');
    });
  });

  describe('tick()', () => {
    it('should decrease hunger over time', () => {
      const initialHunger = tamagotchi.getState().stats.hunger;
      tamagotchi.tick();

      expect(tamagotchi.getState().stats.hunger).toBe(initialHunger - 1);
    });

    it('should decrease happiness over time', () => {
      const initialHappiness = tamagotchi.getState().stats.happiness;
      tamagotchi.tick();

      expect(tamagotchi.getState().stats.happiness).toBe(initialHappiness - 0.5);
    });

    it('should decrease cleanliness over time', () => {
      const initialCleanliness = tamagotchi.getState().stats.cleanliness;
      tamagotchi.tick();

      expect(tamagotchi.getState().stats.cleanliness).toBe(
        initialCleanliness - 0.3
      );
    });

    it('should increase age on tick', () => {
      const initialAge = tamagotchi.getState().stats.age;
      tamagotchi.tick();

      expect(tamagotchi.getState().stats.age).toBe(initialAge + 1);
    });

    it('should restore energy while sleeping', () => {
      // Put to sleep
      tamagotchi.play();
      tamagotchi.play();
      tamagotchi.sleep();

      const initialEnergy = tamagotchi.getState().stats.energy;
      tamagotchi.tick();

      expect(tamagotchi.getState().stats.energy).toBe(
        Math.min(100, initialEnergy + 5)
      );
    });
  });

  describe('evolution', () => {
    it('should start as egg', () => {
      expect(tamagotchi.getState().stats.stage).toBe('egg');
    });

    it('should evolve to baby at age 10', () => {
      for (let i = 0; i < 10; i++) {
        tamagotchi.tick();
      }
      expect(tamagotchi.getState().stats.stage).toBe('baby');
    });

    it('should evolve to child at age 50', () => {
      for (let i = 0; i < 50; i++) {
        tamagotchi.tick();
        // Keep stats up to prevent death
        if (i % 10 === 0) {
          tamagotchi.feed();
        }
      }
      expect(tamagotchi.getState().stats.stage).toBe('child');
    });

    it('should evolve to teen at age 150', () => {
      for (let i = 0; i < 150; i++) {
        tamagotchi.tick();
        if (i % 5 === 0) {
          tamagotchi.feed();
          tamagotchi.clean();
        }
      }
      expect(tamagotchi.getState().stats.stage).toBe('teen');
    });

    it('should evolve to adult at age 300', () => {
      for (let i = 0; i < 300; i++) {
        tamagotchi.tick();
        if (i % 3 === 0) {
          tamagotchi.feed();
        }
        if (i % 5 === 0) {
          tamagotchi.clean();
        }
      }
      expect(tamagotchi.getState().stats.stage).toBe('adult');
    });
  });

  describe('health and death', () => {
    it('should decrease health when stats are low', () => {
      // Starve the pet
      for (let i = 0; i < 100; i++) {
        tamagotchi.tick();
      }

      expect(tamagotchi.getState().stats.health).toBeLessThan(100);
    });

    it('should die when health reaches 0', () => {
      // Severely neglect the pet
      for (let i = 0; i < 200; i++) {
        tamagotchi.tick();
      }

      expect(tamagotchi.getState().stats.isAlive).toBe(false);
      expect(tamagotchi.getState().mood).toBe('dead');
    });

    it('should not perform actions when dead', () => {
      // Kill the pet
      for (let i = 0; i < 200; i++) {
        tamagotchi.tick();
      }

      expect(tamagotchi.feed().success).toBe(false);
      expect(tamagotchi.play().success).toBe(false);
      expect(tamagotchi.sleep().success).toBe(false);
      expect(tamagotchi.clean().success).toBe(false);
    });
  });

  describe('mood', () => {
    it('should be happy when stats are high', () => {
      expect(tamagotchi.getState().mood).toBe('happy');
    });

    it('should be sleeping when asleep', () => {
      tamagotchi.play();
      tamagotchi.sleep();

      expect(tamagotchi.getState().mood).toBe('sleeping');
    });

    it('should become sad when stats are low', () => {
      for (let i = 0; i < 80; i++) {
        tamagotchi.tick();
      }

      const mood = tamagotchi.getState().mood;
      expect(['sad', 'sick', 'neutral']).toContain(mood);
    });
  });

  describe('reset()', () => {
    it('should reset pet to initial state', () => {
      // Modify the pet
      tamagotchi.feed();
      tamagotchi.play();
      for (let i = 0; i < 20; i++) {
        tamagotchi.tick();
      }

      tamagotchi.reset();
      const state = tamagotchi.getState();

      expect(state.stats.hunger).toBe(80);
      expect(state.stats.happiness).toBe(80);
      expect(state.stats.energy).toBe(100);
      expect(state.stats.health).toBe(100);
      expect(state.stats.cleanliness).toBe(100);
      expect(state.stats.age).toBe(0);
      expect(state.stats.stage).toBe('egg');
      expect(state.stats.isAlive).toBe(true);
    });

    it('should allow reset after death', () => {
      // Kill the pet
      for (let i = 0; i < 200; i++) {
        tamagotchi.tick();
      }
      expect(tamagotchi.getState().stats.isAlive).toBe(false);

      tamagotchi.reset();
      expect(tamagotchi.getState().stats.isAlive).toBe(true);
    });
  });

  describe('rename()', () => {
    it('should change the pet name', () => {
      tamagotchi.rename('Buddy');
      expect(tamagotchi.getState().name).toBe('Buddy');
    });
  });

  describe('state change callbacks', () => {
    it('should call callbacks on state change', () => {
      const callback = vi.fn();
      tamagotchi.onStateChange(callback);

      tamagotchi.feed();

      expect(callback).toHaveBeenCalled();
    });

    it('should call multiple callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      tamagotchi.onStateChange(callback1);
      tamagotchi.onStateChange(callback2);

      tamagotchi.tick();

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('state persistence', () => {
    it('should save state to context', () => {
      tamagotchi.feed();

      expect(mockContext.globalState.update).toHaveBeenCalledWith(
        'tamagotchiState',
        expect.any(Object)
      );
    });
  });
});

