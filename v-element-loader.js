import VRustLoader       from "./v-element-rust-loader.js"
import VJavaScriptLoader from "./v-element-javascript-loader.js"

export default class VElementLoader extends HTMLElement {
    getModulePath() {
        return this.getAttribute("path").replace(/-/g,"_") + ".js";
    }

    async connectedCallback() {
        this.load();
    }

    createLoader(module) {
        if (module["v_component_target_language_rust"])
            return new VRustLoader();
        else
            return new VJavaScriptLoader();
    }

    async load() {
        let path   = this.getModulePath();
        let module = await import(path);
        let loader = this.createLoader(module);
        await loader.load(module);
    }
}

// Define the new element
customElements.define('v-element', VElementLoader);