import JavaScriptWebComponent from "./javascript.js"

export default class JavaScriptWebComponentLoader {
    constructor(logger) {
        this.logger = logger.sub("javascript");
        this.logger.info("Loader constructed.");
    }

    async load(module) {
        this.class = module.default;
        let elementName = "web-" + this.class.name.substring(3).toLowerCase();
        this.logger.info(`Loading <${elementName}>.`);
        await this.loadElement(module,elementName);
    }

    async loadElement(module,name) {
        if (!customElements.get(name)) {
            class CustomElement extends JavaScriptWebComponent {}
            CustomElement.prototype.class    = this.class;
            CustomElement.prototype.template = this.createTemplateFromString(await this.class.template());
            customElements.define(name, CustomElement);
            this.logger.info(`<${name}> element registered.`);
        } else {
            this.logger.warn(`<${name}> is already registered.`);
        }
    }

    //TODO: Generalize this logic for any loader.
    createTemplateFromString(template) {
        let innerDiv       = document.createElement("div");
        innerDiv.innerHTML = template;
        return innerDiv.firstChild;
    }
}
