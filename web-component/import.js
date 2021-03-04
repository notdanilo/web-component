import Path             from "./loader/path.js"
import JavaScriptLoader from "./loader/javascript.js"
import TemplateLoader   from "./loader/template.js"
import WASMLoader       from "./loader/wasm.js"

class Importer {
    constructor() {
        this.javascript = new JavaScriptLoader();
        this.wasm       = new WASMLoader();
        this.template   = new TemplateLoader();
    }

    async #importModule(path) {
        let module = {};
        try {
            module.instance = await import(path.getResolvedPath() + ".js");
            module.found    = true;
            if (module.instance["web_component_target_wasm"] || module.instance.default.name == "init") {
                module.type = "WASM";
            } else module.type = "JAVASCRIPT";
        } catch(e) {
            console.error(`[web-component] ${e}`);
            module.type = "TEMPLATE";
            module.found = false;
        }
        module.path = path;
        return module;
    }

    async import(path) {
        path = new Path(path);
        let module = await this.#importModule(path);
             if (module.type == "JAVASCRIPT") this.javascript.load(module);
        else if (module.type == "WASM")       this.wasm.load(module);
        else if (module.type == "TEMPLATE")   this.template.load(module);
    }
}

let importer = new Importer();

export default async function ImportWebComponent(path) {
    await importer.import(path);
}

class ImporterWebComponent extends HTMLElement {
    async connectedCallback() {
        await ImportWebComponent(this.getAttribute("path"));
    }
}

customElements.define('web-component', ImporterWebComponent);