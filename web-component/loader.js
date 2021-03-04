import WASMWebComponentLoader       from "./wasm-loader.js"
import JavaScriptWebComponentLoader from "./javascript-loader.js"
import { logger }                   from "./logger.js"
import WebComponent                 from "./base.js"

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
        console.log(path);
        this.logger.info(`Loading from ${path}`);
        return path;
    }

    async connectedCallback() {
        this.logger.info("Connected to DOM.")
        this.load();
    }

    async createLoader(module) {
        if (module) {
            if (module["web_component_target_wasm"] || module.default.name == "init") {
                this.logger.info("Loading as WASM.");
                return new WASMWebComponentLoader(this.logger);
            } else {
                this.logger.info("Loading as JavaScript.");
                return new JavaScriptWebComponentLoader(this.logger);
            }
        } else {
            var name = "web-minimal";
            if (!customElements.get(name)) {
                class CustomElement extends WebComponent {}
                CustomElement.prototype.template = this.createTemplateFromString("<template>ah</template>");
                customElements.define(name, CustomElement);
                this.logger.info(`<${name}> element registered.`);
            } else {
                this.logger.warn(`<${name}> is already registered.`);
            }
        }
    }

    async load() {
        let path   = this.getModulePath();
        let module;
        try {
            module = await import(path);
        } catch(e) {
            module = null;
        }
        let loader = await this.createLoader(module);
        if (loader)
        await loader.load(module);
        this.logger.info("Loaded.");
    }

    createTemplateFromString(template) {
        let innerDiv       = document.createElement("div");
        innerDiv.innerHTML = template;
        return innerDiv.firstChild;
    }
}

// Define the new element
customElements.define('web-component', WebComponentLoader);
subLogger.info("<web-component> element registered.");