import * as vscode from 'vscode';
import LibUtils from './supportFunctions';
import { extractTemplateAndScript } from './extractTemplateAndScript';
import { extractComponentsFromTemplate, extractImportedComponents } from './extractComponents';
import MermaidCodeGenerator from './generateMermaidCode';

export async function processFiles(document:vscode.TextDocument){
    let mermaidCode = 'graph LR\n';

    const idSet = new Map<string,string>();

    let doc:vscode.TextDocument[] = [document]; 
    while(doc.length > 0){
        let processed = await processFile(doc[0],idSet);
        doc.shift(); // remove index 0
        if(processed){
            mermaidCode += processed.code;
            doc = doc.concat(processed.imports);
        }
    }
    
    return mermaidCode;

}

async function processFile(document:vscode.TextDocument, idSet:Map<string,string>){
    const fileName =  LibUtils.getFileName(document.uri).toLowerCase().replace('.vue','');
	// Read the contents of the document
	const text = document.getText();
    const { templateAST, scriptContent,api } = extractTemplateAndScript(text);

    if(api == 'options'){
        const templateComponents = extractComponentsFromTemplate(templateAST!);
		const scriptImports = extractImportedComponents(scriptContent!);
		const templateFlowChart = MermaidCodeGenerator.generateTemplateCode(fileName,
            templateComponents,scriptImports,idSet);
		
        // only imports that are loaded with relative paths
        const cleanedImports = scriptImports.filter(imprt => 
            (templateComponents.includes(imprt.component) && !imprt.path.startsWith('@')));

        const importDocuments =await Promise.all(cleanedImports.map(async imprt => {
            const basePath = (document.uri.path.split('/')).slice(0, -1).join('/');
            const filePath = imprt.path.toLowerCase().endsWith('.vue') ? imprt.path : imprt.path + '.vue';
            return await vscode.workspace.openTextDocument(vscode.Uri.file(basePath + '/' + filePath));
        }));
        
        return {
            code: templateFlowChart,
            imports: importDocuments,
            components:templateComponents
        }
        
    }else{
        return null;
    }

}