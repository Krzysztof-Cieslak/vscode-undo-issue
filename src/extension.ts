
import * as vscode from 'vscode';

function sleep(ms: number) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vscode-undo" is now active!');


	let disposable = vscode.commands.registerCommand('vscode-undo.helloWorld', async () => {
		let editor = vscode.window.activeTextEditor
		if(editor) {
			var selection = editor.selection

			//First insert
			await editor.edit(editBuilder => {
				editBuilder.replace(selection.anchor, "\n\n\n\n\n")
			}, {
				// Make a new undo stop
				undoStopBefore: true,
				// Keep the stop open so we merge with the subsequent insertion or
				// deletion
				undoStopAfter: false
			}).then((r) => {
				//Do it only if the selection has changed
				if (editor && editor.selection !== selection) {
					//Make sure the active selection stays at the same place
					editor.selection = selection
				}
				return r;
			 })

			await sleep(500)
			await vscode.commands.executeCommand("cursorMove",
                {
                    to: "down", by:'wrappedLine', value:1
                });
			selection = editor.selection

			//Second insert
			await editor.edit(editBuilder => {
				editBuilder.replace(new vscode.Position(1,0), "\n")
			}, {
				// Make a new undo stop
				undoStopBefore: false, //true, - doesn't matter
				// Keep the stop open so we merge with the subsequent insertion or
				// deletion
				undoStopAfter: false
			}).then((r) => {
				//Do it only if the selection has changed
				if (editor && editor.selection !== selection) {
					//Make sure the active selection stays at the same place
					editor.selection = selection
				}
				return r;
			 })

			await sleep(500)
			await vscode.commands.executeCommand("cursorMove",
			{
				to: "down", by:'wrappedLine', value:1
			});
			selection = editor.selection

			//Third insert
			await editor.edit(editBuilder => {
				editBuilder.replace(new vscode.Position(2,0), "\n")
			}, {
				// Make a new undo stop
				undoStopBefore: false, //true, - doesn't matter
				// Keep the stop open so we merge with the subsequent insertion or
				// deletion
				undoStopAfter: false
			}).then((r) => {
				//Do it only if the selection has changed
				if (editor && editor.selection !== selection) {
					//Make sure the active selection stays at the same place
					editor.selection = selection
				}
				return r;
			 })

			await sleep(500)


			//Delete
			await editor.edit(editBuilder => {
				editBuilder.delete(new vscode.Range(new vscode.Position(2,0), new vscode.Position(6,1)))
			}, {
                // Merge with the insertion stop
                undoStopBefore: false,
                // Finish this undo stop.
                // FIXME: Ideally the insertion and this deletion
                // would be an empty stop and be skipped but vscode does not
                // do that.
                undoStopAfter: true
            });
		}
		vscode.window.showInformationMessage('Hello World from vscode-undo!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
