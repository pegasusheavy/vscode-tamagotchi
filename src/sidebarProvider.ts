import * as vscode from 'vscode';
import { Tamagotchi, TamagotchiState } from './tamagotchi';
import { getWebviewContent, PetColors, COLOR_PRESETS } from './webviewContent';

export class TamagotchiSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'tamagotchi.sidebarView';
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _context: vscode.ExtensionContext,
    private readonly _tamagotchi: Tamagotchi
  ) {
    // Listen for state changes
    this._tamagotchi.onStateChange((state) => {
      this._sendStateUpdate(state);
    });
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._context.extensionUri, 'media'),
      ],
    };

    const config = vscode.workspace.getConfiguration('tamagotchi');
    const theme = config.get<string>('theme', 'classic');
    const useCustomSprites = config.get<boolean>('useCustomSprites', true);
    const colorPreset = config.get<string>('colorPreset', 'custom');

    let petColors: PetColors;
    if (colorPreset !== 'custom' && COLOR_PRESETS[colorPreset]) {
      petColors = COLOR_PRESETS[colorPreset];
    } else {
      petColors = {
        primary: config.get<string>('petColors.primary', '#ff6b9d'),
        secondary: config.get<string>('petColors.secondary', '#c44cff'),
        accent: config.get<string>('petColors.accent', '#ffe14c'),
        blush: config.get<string>('petColors.blush', '#ffb3d9'),
      };
    }

    webviewView.webview.html = getWebviewContent(
      webviewView.webview,
      this._context.extensionUri,
      this._tamagotchi.getState(),
      theme,
      useCustomSprites,
      petColors
    );

    webviewView.webview.onDidReceiveMessage((message) => {
      this._handleMessage(message);
    });
  }

  private _handleMessage(message: { command: string; [key: string]: unknown }): void {
    switch (message.command) {
      case 'feed':
        const feedResult = this._tamagotchi.feed();
        this._sendMessage({ command: 'actionResult', ...feedResult });
        break;
      case 'play':
        const playResult = this._tamagotchi.play();
        this._sendMessage({ command: 'actionResult', ...playResult });
        break;
      case 'sleep':
        const sleepResult = this._tamagotchi.sleep();
        this._sendMessage({ command: 'actionResult', ...sleepResult });
        break;
      case 'clean':
        const cleanResult = this._tamagotchi.clean();
        this._sendMessage({ command: 'actionResult', ...cleanResult });
        break;
      case 'restart':
        this._tamagotchi.reset();
        this._sendMessage({ command: 'actionResult', message: '🐣 A new Tamagotchi has been born!' });
        this._sendStateUpdate(this._tamagotchi.getState());
        break;
      case 'getState':
        this._sendStateUpdate(this._tamagotchi.getState());
        break;
    }
  }

  private _sendMessage(message: object): void {
    if (this._view) {
      this._view.webview.postMessage(message);
    }
  }

  private _sendStateUpdate(state: TamagotchiState): void {
    this._sendMessage({ command: 'stateUpdate', state });
  }
}

