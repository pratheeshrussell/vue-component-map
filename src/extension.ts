import * as vscode from 'vscode';
import {extractTemplateAndScript}  from './lib/extractTemplateAndScript';
import { ErrorStrings } from './constants/string.ext';
import LibUtils from './lib/supportFunctions';
import { processFiles } from './lib/processFiles';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('vue-component-map.showVueMap', async () => {
		// Get the currently active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			// Get the document associated with the active text editor
			const document = editor.document;
	
			// Get the file extension
			const fileExtension = LibUtils.getFileExtension(document.uri);
			const fileName =  LibUtils.getFileName(document.uri).toLowerCase().replace('.vue','');
			// Read the contents of the document
			const text = document.getText();

			if(fileExtension.toLowerCase() == 'vue' && text !== ''){
				const { api } = extractTemplateAndScript(text);
				if(api == 'options'){
					const mermaidCode = await processFiles(document);
					showWebPanel(mermaidCode, fileName);
				}else{
					vscode.window.showErrorMessage(ErrorStrings.CompositionNotSupported);
				}

			}else{
				vscode.window.showErrorMessage(ErrorStrings.UnableToAccessFile);
			}		

		}else{
			vscode.window.showErrorMessage(ErrorStrings.UnableToAccessFile);
		}
	});

	context.subscriptions.push(disposable);
}

function showWebPanel(mermaidCode: string,filename? : string){
	// Create a new webview panel
	const panel = vscode.window.createWebviewPanel(
		'vueComponentMapWindow', // Unique identifier for the panel
		'Vue Component Map', // Title displayed in the panel
		vscode.ViewColumn.One, // The column in which to show the panel
		{
		  enableScripts:true,
		  enableForms: true
		}
	  );
	  let title = filename ? filename : 'Anonymous';
	  panel.title = `${filename} - Vue Code Map`;
	  // Set the HTML content in the webview panel
	  panel.webview.html = LibUtils.getMermaidTemplateHTML(mermaidCode,title);
}


// This method is called when your extension is deactivated
export function deactivate() {}
