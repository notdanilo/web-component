import { default as VElement } from "./v-element-definition.js"

export default class VElementLoader extends HTMLElement {
    getModulePath() {
        return this.getAttribute("path").replace(/-/g,"_") + ".js";
    }

    async loadModule(path) {
        this.module = await import(path);
        if (this.module.default) await this.module.default();
        this.loadComponents();
    }

    async connectedCallback() {
        let path = this.getModulePath();
        this.loadModule(path).await;
    }

    loadComponents() {
        for (let method in this.module) {
            var result = method.match(/components_v_(.*)_create/);
            if (result && result.length == 2) {
                let elementName = "v-" + result[1];
                this.loadElement(elementName);
            }
        }
    }

    loadElement(name) {
        if (!customElements.get(name)) {
            class CustomElement extends VElement {}
            let path = ("components_" + name).replace(/-|\//g,"_");
            CustomElement.prototype.module = this.module;
            CustomElement.prototype.path = path;
            CustomElement.prototype.template = this.createTemplate(path);
            customElements.define(name, CustomElement)
        }
    }

    createTemplate(path) {
        let template_method = path + "_template";
            template_method = this.module[template_method];
        let templateText    = "<template></template>";
        if (template_method) templateText = template_method();
        let inner_div       = document.createElement("div");
        inner_div.innerHTML = templateText;
        return inner_div.firstChild;
    }
}

// Define the new element
customElements.define('v-element', VElementLoader);