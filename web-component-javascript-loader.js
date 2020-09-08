import WebComponentJavaScript from "./web-component-javascript.js"

export default class WebComponentJavaScriptLoader {
    async load(module) {
        this.class = module.default;
        let elementName = "web-" + this.class.name.substring(3).toLowerCase();
        this.loadElement(module,elementName)
    }

    loadElement(module,name) {
        if (!customElements.get(name)) {
            class CustomElement extends WebComponentJavaScript {}
            CustomElement.prototype.class    = this.class;
            CustomElement.prototype.template = this.createTemplateFromString(this.class.template());
            customElements.define(name, CustomElement)
        }
    }

    //TODO: Generalize this logic for any loader.
    createTemplateFromString(template) {
        let innerDiv       = document.createElement("div");
        innerDiv.innerHTML = template;
        return innerDiv.firstChild;
    }
}
