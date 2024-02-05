import { ImportDetails } from "../types/importDetails.type";

export default class MermaidCodeGenerator {
    static generateTemplateCode(parent:string,components: string[], 
        importedComponents:ImportDetails[],idSet:Map<string,string>){
        let code ='';

        const transformedObject = importedComponents.reduce((acc, { component, path }) => {
            acc[component] = path;
            return acc;
        }, {} as Record<string, string>);

        if(components.length > 0){
            components.forEach((component)=>{
                const parentId = parent.toLowerCase();
                const componentId = component.toLowerCase();

                let componentText = '';
                let parentText = idSet.has(parentId) ? idSet.get(parentId)! : parent;
                if(idSet.has(componentId) == true){
                    componentText = idSet.get(componentId)!;
                }else{
                    componentText = component;
                    if(transformedObject[component]){
                        componentText = `${component} <br> <span class='import-path'>${transformedObject[component]}</span>`;
                    }
                    idSet.set(componentId,componentText);
                }
                
                code += `${parentId}[${parentText}] --> ${componentId}[${componentText}] \n`;
            });          
        }

        return code;
    }
}