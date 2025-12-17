import * as vscode from 'vscode';
import { Tamagotchi, TamagotchiState } from './tamagotchi';
import { getWebviewContent } from './webviewContent';

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

    webviewView.webview.html = getWebviewContent(
      webviewView.webview,
      this._context.extensionUri,
      this._tamagotchi.getState(),
      theme
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

