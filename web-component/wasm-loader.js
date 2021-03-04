import WASMWebComponent from "./wasm.js"

export default class WASMWebComponentLoader {
    constructor(logger) {
        this.logger = logger.sub("wasm");
        this.logger.info("Loader constructed.");
    }

    async load(module) {
        if (module.default) await module.default();
        this.loadComponents(module);
    }

    loadComponents(module) {
        this.logger.info(`Loading components.`);
        for (let method in module) {
            var result = method.match(/components_web_(.*)_create/);
            if (result && result.length == 2) {
                let elementName = "web-" + result[1];
                this.loadElement(module,elementName);
            }
        }
    }

    loadElement(module,name) {
        if (!customElements.get(name)) {
            class CustomElement extends WebComponentWASM {}
            let path = ("components_" + name).replace(/-|\//g,"_");
            CustomElement.prototype.module   = module;
            CustomElement.prototype.path     = path;
            CustomElement.prototype.template = this.createTemplate(module,path);
            customElements.define(name, CustomElement);
            this.logger.info(`<${name}> element registered.`);
        } else {
            this.logger.warn(`<${name}> is already registered.`);
        }
    }

    createTemplate(module,path) {
        let template_method = path + "_template";
            template_method = module[template_method];
        let templateText    = "<template></template>";
        if (template_method) templateText = template_method();
        let inner_div       = document.createElement("div");
        inner_div.innerHTML = templateText;
        return inner_div.firstChild;
    }
}