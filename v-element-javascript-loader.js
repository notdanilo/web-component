import VElementJavaScript from "./v-element-javascript.js"

export default class VJavaScriptLoader {
    async load(module) {
        this.class = module.default;
        let elementName = "v-" + this.class.name.substring(1).toLowerCase();
        this.loadElement(module,elementName)
    }

    loadElement(module,name) {
        if (!customElements.get(name)) {
            class CustomElement extends VElementJavaScript {}
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
