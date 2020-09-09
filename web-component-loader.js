import WebComponentWASMLoader       from "./web-component-wasm-loader.js"
import WebComponentJavaScriptLoader from "./web-component-javascript-loader.js"

export default class WebComponentLoader extends HTMLElement {
    getModulePath() {
        return this.getAttribute("path").replace(/-/g,"_") + ".js";
    }

    async connectedCallback() {
        this.load();
    }

    createLoader(module) {
        if (module["web_component_target_wasm"] || module.default.name == "init")
            return new WebComponentWASMLoader();
        else
            return new WebComponentJavaScriptLoader();
    }

    async load() {
        let path   = this.getModulePath();
        let module = await import(path);
        let loader = this.createLoader(module);
        await loader.load(module);
    }
}

// Define the new element
customElements.define('web-component', WebComponentLoader);