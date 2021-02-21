import WebComponentWASMLoader       from "./web-component-wasm-loader.js"
import WebComponentJavaScriptLoader from "./web-component-javascript-loader.js"

export default class WebComponentLoader extends HTMLElement {
    getModulePath() {
        let path = this.getAttribute("path").replace(/-/g,"_") + ".js";
        if (path[0] == '/') path = location.href.substring(0, location.href.length-1) + path;
        return path;
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
        console.log(path);
        let module = await import(path);
        let loader = this.createLoader(module);
        await loader.load(module);
    }
}

// Define the new element
customElements.define('web-component', WebComponentLoader);