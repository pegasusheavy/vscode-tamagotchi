import * as vscode from 'vscode';

export type PetMood = 'happy' | 'neutral' | 'sad' | 'sleeping' | 'sick' | 'dead';
export type PetStage = 'egg' | 'baby' | 'child' | 'teen' | 'adult';
export type PetAction = 'idle' | 'eating' | 'playing' | 'sleeping' | 'cleaning' | 'celebrating';

export interface TamagotchiStats {
  hunger: number;      // 0-100, 0 = starving
  happiness: number;   // 0-100, 0 = depressed
  energy: number;      // 0-100, 0 = exhausted
  health: number;      // 0-100, 0 = dead
  cleanliness: number; // 0-100, 0 = filthy
  age: number;         // in "ticks"
  stage: PetStage;
  isAlive: boolean;
}

export interface TamagotchiState {
  stats: TamagotchiStats;
  name: string;
  birthDate: number;
  lastUpdate: number;
  currentAction: PetAction;
  mood: PetMood;
}

const STAGE_THRESHOLDS: Record<PetStage, number> = {
  egg: 0,
  baby: 10,
  child: 50,
  teen: 150,
  adult: 300,
};

export class Tamagotchi {
  private state: TamagotchiState;
  private context: vscode.ExtensionContext;
  private onStateChangeCallbacks: ((state: TamagotchiState) => void)[] = [];

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.state = this.loadState() || this.createNewPet();
  }

  private createNewPet(): TamagotchiState {
    const config = vscode.workspace.getConfiguration('tamagotchi');
    const name = config.get<string>('petName', 'Tama');

    return {
      stats: {
        hunger: 80,
        happiness: 80,
        energy: 100,
        health: 100,
        cleanliness: 100,
        age: 0,
        stage: 'egg',
        isAlive: true,
      },
      name,
      birthDate: Date.now(),
      lastUpdate: Date.now(),
      currentAction: 'idle',
      mood: 'happy',
    };
  }

  private loadState(): TamagotchiState | null {
    const saved = this.context.globalState.get<TamagotchiState>('tamagotchiState');
    if (!saved) {
      return null;
    }

    // Apply time-based decay for time passed while VSCode was closed
    const timePassed = Date.now() - saved.lastUpdate;
    const ticksPassed = Math.floor(timePassed / 60000); // 1 tick per minute

    if (ticksPassed > 0 && saved.stats.isAlive) {
      saved.stats.hunger = Math.max(0, saved.stats.hunger - ticksPassed * 0.5);
      saved.stats.happiness = Math.max(0, saved.stats.happiness - ticksPassed * 0.3);
      saved.stats.energy = Math.min(100, saved.stats.energy + ticksPassed * 0.2);
      saved.stats.cleanliness = Math.max(0, saved.stats.cleanliness - ticksPassed * 0.2);
      saved.lastUpdate = Date.now();

      this.recalculateHealth(saved.stats);
      this.updateMood(saved);
    }

    return saved;
  }

  saveState(): void {
    this.state.lastUpdate = Date.now();
    this.context.globalState.update('tamagotchiState', this.state);
  }

  getState(): TamagotchiState {
    return { ...this.state };
  }

  onStateChange(callback: (state: TamagotchiState) => void): void {
    this.onStateChangeCallbacks.push(callback);
  }

  private notifyStateChange(): void {
    for (const callback of this.onStateChangeCallbacks) {
      callback(this.getState());
    }
  }

  private recalculateHealth(stats: TamagotchiStats): void {
    // Health degrades if other stats are very low
    let healthChange = 0;

    if (stats.hunger < 20) healthChange -= 2;
    if (stats.happiness < 20) healthChange -= 1;
    if (stats.cleanliness < 20) healthChange -= 1;
    if (stats.energy < 10) healthChange -= 1;

    // Health slowly recovers if stats are good
    if (stats.hunger > 60 && stats.happiness > 60 && stats.cleanliness > 60) {
      healthChange += 0.5;
    }

    stats.health = Math.max(0, Math.min(100, stats.health + healthChange));

    if (stats.health <= 0) {
      stats.isAlive = false;
    }
  }

  private updateMood(state: TamagotchiState): void {
    const { stats } = state;

    if (!stats.isAlive) {
      state.mood = 'dead';
      return;
    }

    if (state.currentAction === 'sleeping') {
      state.mood = 'sleeping';
      return;
    }

    if (stats.health < 30) {
      state.mood = 'sick';
      return;
    }

    const avgStats = (stats.hunger + stats.happiness + stats.energy + stats.cleanliness) / 4;

    if (avgStats >= 70) {
      state.mood = 'happy';
    } else if (avgStats >= 40) {
      state.mood = 'neutral';
    } else {
      state.mood = 'sad';
    }
  }

  private updateStage(): void {
    const { age } = this.state.stats;

    if (age >= STAGE_THRESHOLDS.adult) {
      this.state.stats.stage = 'adult';
    } else if (age >= STAGE_THRESHOLDS.teen) {
      this.state.stats.stage = 'teen';
    } else if (age >= STAGE_THRESHOLDS.child) {
      this.state.stats.stage = 'child';
    } else if (age >= STAGE_THRESHOLDS.baby) {
      this.state.stats.stage = 'baby';
    } else {
      this.state.stats.stage = 'egg';
    }
  }

  tick(): void {
    if (!this.state.stats.isAlive) return;

    const { stats } = this.state;

    // Natural stat decay
    stats.hunger = Math.max(0, stats.hunger - 1);
    stats.happiness = Math.max(0, stats.happiness - 0.5);
    stats.cleanliness = Math.max(0, stats.cleanliness - 0.3);

    // Energy changes based on current action
    if (this.state.currentAction === 'sleeping') {
      stats.energy = Math.min(100, stats.energy + 5);
      if (stats.energy >= 100) {
        this.state.currentAction = 'idle';
      }
    } else {
      stats.energy = Math.max(0, stats.energy - 0.5);
    }

    // Age the pet
    stats.age += 1;
    this.updateStage();

    // Recalculate derived stats
    this.recalculateHealth(stats);
    this.updateMood(this.state);

    // Reset action to idle if not sleeping
    if (this.state.currentAction !== 'sleeping' && this.state.currentAction !== 'idle') {
      this.state.currentAction = 'idle';
    }

    this.saveState();
    this.notifyStateChange();
  }

  feed(): { success: boolean; message: string } {
    if (!this.state.stats.isAlive) {
      return { success: false, message: `${this.state.name} has passed away...` };
    }

    if (this.state.currentAction === 'sleeping') {
      return { success: false, message: `${this.state.name} is sleeping!` };
    }

    if (this.state.stats.hunger >= 95) {
      return { success: false, message: `${this.state.name} is too full to eat!` };
    }

    this.state.stats.hunger = Math.min(100, this.state.stats.hunger + 25);
    this.state.stats.happiness = Math.min(100, this.state.stats.happiness + 5);
    this.state.currentAction = 'eating';

    this.updateMood(this.state);
    this.saveState();
    this.notifyStateChange();

    // Reset action after animation
    setTimeout(() => {
      if (this.state.currentAction === 'eating') {
        this.state.currentAction = 'idle';
        this.notifyStateChange();
      }
    }, 2000);

    return { success: true, message: `${this.state.name} enjoyed the meal! 🍖` };
  }

  play(): { success: boolean; message: string } {
    if (!this.state.stats.isAlive) {
      return { success: false, message: `${this.state.name} has passed away...` };
    }

    if (this.state.currentAction === 'sleeping') {
      return { success: false, message: `${this.state.name} is sleeping!` };
    }

    if (this.state.stats.energy < 20) {
      return { success: false, message: `${this.state.name} is too tired to play!` };
    }

    this.state.stats.happiness = Math.min(100, this.state.stats.happiness + 20);
    this.state.stats.energy = Math.max(0, this.state.stats.energy - 15);
    this.state.stats.hunger = Math.max(0, this.state.stats.hunger - 5);
    this.state.currentAction = 'playing';

    this.updateMood(this.state);
    this.saveState();
    this.notifyStateChange();

    setTimeout(() => {
      if (this.state.currentAction === 'playing') {
        this.state.currentAction = 'idle';
        this.notifyStateChange();
      }
    }, 2500);

    return { success: true, message: `${this.state.name} had fun playing! 🎾` };
  }

  sleep(): { success: boolean; message: string } {
    if (!this.state.stats.isAlive) {
      return { success: false, message: `${this.state.name} has passed away...` };
    }

    if (this.state.currentAction === 'sleeping') {
      // Wake up
      this.state.currentAction = 'idle';
      this.updateMood(this.state);
      this.saveState();
      this.notifyStateChange();
      return { success: true, message: `${this.state.name} woke up! ☀️` };
    }

    if (this.state.stats.energy >= 95) {
      return { success: false, message: `${this.state.name} isn't tired!` };
    }

    this.state.currentAction = 'sleeping';
    this.state.mood = 'sleeping';
    this.saveState();
    this.notifyStateChange();

    return { success: true, message: `${this.state.name} is now sleeping... 💤` };
  }

  clean(): { success: boolean; message: string } {
    if (!this.state.stats.isAlive) {
      return { success: false, message: `${this.state.name} has passed away...` };
    }

    if (this.state.currentAction === 'sleeping') {
      return { success: false, message: `${this.state.name} is sleeping!` };
    }

    if (this.state.stats.cleanliness >= 95) {
      return { success: false, message: `${this.state.name} is already clean!` };
    }

    this.state.stats.cleanliness = Math.min(100, this.state.stats.cleanliness + 30);
    this.state.stats.happiness = Math.min(100, this.state.stats.happiness + 5);
    this.state.currentAction = 'cleaning';

    this.updateMood(this.state);
    this.saveState();
    this.notifyStateChange();

    setTimeout(() => {
      if (this.state.currentAction === 'cleaning') {
        this.state.currentAction = 'idle';
        this.notifyStateChange();
      }
    }, 2000);

    return { success: true, message: `${this.state.name} is squeaky clean! 🛁` };
  }

  reset(): void {
    this.state = this.createNewPet();
    this.saveState();
    this.notifyStateChange();
  }

  rename(newName: string): void {
    this.state.name = newName;
    this.saveState();
    this.notifyStateChange();
  }
}

