import * as vscode from 'vscode';
import { Tamagotchi, TamagotchiState } from './tamagotchi';
import { getWebviewContent } from './webviewContent';

export class TamagotchiPanel {
  public static currentPanel: TamagotchiPanel | undefined;
  public static readonly viewType = 'tamagotchiPanel';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _context: vscode.ExtensionContext;
  private readonly _tamagotchi: Tamagotchi;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(
    context: vscode.ExtensionContext,
    tamagotchi: Tamagotchi,
    asEditor: boolean = false
  ): void {
    const column = asEditor
      ? vscode.ViewColumn.One
      : vscode.ViewColumn.Beside;

    // If we already have a panel, show it
    if (TamagotchiPanel.currentPanel) {
      TamagotchiPanel.currentPanel._panel.reveal(column);
      return;
    }

    // Otherwise, create a new panel
    const panel = vscode.window.createWebviewPanel(
      TamagotchiPanel.viewType,
      'Tamagotchi',
      {
        viewColumn: asEditor ? vscode.ViewColumn.Active : vscode.ViewColumn.Two,
        preserveFocus: true,
      },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, 'media'),
        ],
      }
    );

    TamagotchiPanel.currentPanel = new TamagotchiPanel(panel, context, tamagotchi);
  }

  private constructor(
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext,
    tamagotchi: Tamagotchi
  ) {
    this._panel = panel;
    this._context = context;
    this._tamagotchi = tamagotchi;

    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle state changes
    this._tamagotchi.onStateChange((state) => {
      this._sendStateUpdate(state);
    });

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        this._handleMessage(message);
      },
      null,
      this._disposables
    );
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
    this._panel.webview.postMessage(message);
  }

  private _sendStateUpdate(state: TamagotchiState): void {
    this._sendMessage({ command: 'stateUpdate', state });
  }

  private _update(): void {
    const config = vscode.workspace.getConfiguration('tamagotchi');
    const theme = config.get<string>('theme', 'classic');

    this._panel.webview.html = getWebviewContent(
      this._panel.webview,
      this._context.extensionUri,
      this._tamagotchi.getState(),
      theme
    );
  }

  public dispose(): void {
    TamagotchiPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}

