import WASMWebComponentLoader       from "./wasm-loader.js"
import JavaScriptWebComponentLoader from "./javascript-loader.js"
import { logger }                   from "./logger.js"

let subLogger = logger.sub("loader");

export default class WebComponentLoader extends HTMLElement {
    constructor() {
        super();
        this.logger = subLogger.sub(`"${this.getAttribute("path")}"`);
        this.logger.info("Constructed.");
    }

    getModulePath() {
        let path = this.getAttribute("path") + ".js";
        if (path[0] == '/') path = location.href.substring(0, location.href.length-1) + path;
        this.logger.info(`Loading from ${path}`);
        return path;
    }

    async connectedCallback() {
        this.logger.info("Connected to DOM.")
        this.load();
    }

    createLoader(module) {
        if (module["web_component_target_wasm"] || module.default.name == "init") {
            this.logger.info("Loading as WASM.");
            return new WASMWebComponentLoader(this.logger);
        } else {
            this.logger.info("Loading as JavaScript.");
            return new JavaScriptWebComponentLoader(this.logger);
        }
    }

    async load() {
        let path   = this.getModulePath();
        let module = await import(path);
        let loader = this.createLoader(module);
        await loader.load(module);
        this.logger.info("Loaded.");
    }
}

// Define the new element
customElements.define('web-component', WebComponentLoader);
subLogger.info("<web-component> element registered.");