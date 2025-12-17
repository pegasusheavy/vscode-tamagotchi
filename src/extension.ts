import * as vscode from 'vscode';
import { Tamagotchi } from './tamagotchi';
import { TamagotchiPanel } from './tamagotchiPanel';
import { TamagotchiSidebarProvider } from './sidebarProvider';

let tamagotchi: Tamagotchi;
let tickInterval: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('VSCode Tamagotchi is now active!');

  // Initialize the Tamagotchi
  tamagotchi = new Tamagotchi(context);

  // Register the sidebar webview provider
  const sidebarProvider = new TamagotchiSidebarProvider(context, tamagotchi);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'tamagotchi.sidebarView',
      sidebarProvider
    )
  );

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('tamagotchi.show', async () => {
      const config = vscode.workspace.getConfiguration('tamagotchi');
      const position = config.get<string>('position', 'sidebar-left');

      if (position === 'sidebar-left' || position === 'sidebar-right') {
        // Focus the sidebar view
        await vscode.commands.executeCommand('tamagotchi.sidebarView.focus');
        
        // Move to appropriate sidebar location
        if (position === 'sidebar-right') {
          // Move view to the auxiliary bar (right sidebar)
          await vscode.commands.executeCommand('workbench.action.moveViewToSecondarySideBar');
        } else {
          // Ensure it's in the primary sidebar (left)
          await vscode.commands.executeCommand('workbench.action.moveViewToPrimarySideBar');
        }
      } else {
        TamagotchiPanel.createOrShow(context, tamagotchi, position === 'editor');
      }
    })
  );
  
  // Command to move to left sidebar
  context.subscriptions.push(
    vscode.commands.registerCommand('tamagotchi.moveToLeft', async () => {
      await vscode.commands.executeCommand('tamagotchi.sidebarView.focus');
      await vscode.commands.executeCommand('workbench.action.moveViewToPrimarySideBar');
    })
  );
  
  // Command to move to right sidebar
  context.subscriptions.push(
    vscode.commands.registerCommand('tamagotchi.moveToRight', async () => {
      await vscode.commands.executeCommand('tamagotchi.sidebarView.focus');
      await vscode.commands.executeCommand('workbench.action.moveViewToSecondarySideBar');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('tamagotchi.feed', () => {
      const result = tamagotchi.feed();
      vscode.window.showInformationMessage(result.message);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('tamagotchi.play', () => {
      const result = tamagotchi.play();
      vscode.window.showInformationMessage(result.message);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('tamagotchi.sleep', () => {
      const result = tamagotchi.sleep();
      vscode.window.showInformationMessage(result.message);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('tamagotchi.clean', () => {
      const result = tamagotchi.clean();
      vscode.window.showInformationMessage(result.message);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('tamagotchi.reset', async () => {
      const answer = await vscode.window.showWarningMessage(
        'Are you sure you want to reset your Tamagotchi? This will create a new pet.',
        'Yes',
        'No'
      );

      if (answer === 'Yes') {
        tamagotchi.reset();
        vscode.window.showInformationMessage('A new Tamagotchi egg has appeared! 🥚');
      }
    })
  );

  // Start the game tick
  const config = vscode.workspace.getConfiguration('tamagotchi');
  const updateInterval = config.get<number>('updateInterval', 30000);

  tickInterval = setInterval(() => {
    tamagotchi.tick();
  }, updateInterval);

  // Auto-show if configured
  if (config.get<boolean>('autoStart', true)) {
    vscode.commands.executeCommand('tamagotchi.show');
  }

  // Listen for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('tamagotchi.updateInterval')) {
        const newInterval = vscode.workspace
          .getConfiguration('tamagotchi')
          .get<number>('updateInterval', 30000);

        if (tickInterval) {
          clearInterval(tickInterval);
        }
        tickInterval = setInterval(() => {
          tamagotchi.tick();
        }, newInterval);
      }

      if (e.affectsConfiguration('tamagotchi.petName')) {
        const newName = vscode.workspace
          .getConfiguration('tamagotchi')
          .get<string>('petName', 'Tama');
        tamagotchi.rename(newName);
      }
    })
  );
}

export function deactivate() {
  if (tickInterval) {
    clearInterval(tickInterval);
  }
  if (tamagotchi) {
    tamagotchi.saveState();
  }
}

