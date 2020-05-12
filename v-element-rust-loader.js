import VElementRust from "./v-element-rust.js"

export default class VRustLoader {
    async load(module) {
        if (module.default) await module.default();
        this.loadComponents(module);
    }

    loadComponents(module) {
        for (let method in module) {
            var result = method.match(/components_v_(.*)_create/);
            if (result && result.length == 2) {
                let elementName = "v-" + result[1];
                this.loadElement(module,elementName);
            }
        }
    }

    loadElement(module,name) {
        if (!customElements.get(name)) {
            class CustomElement extends VElementRust {}
            let path = ("components_" + name).replace(/-|\//g,"_");
            CustomElement.prototype.module   = module;
            CustomElement.prototype.path     = path;
            CustomElement.prototype.template = this.createTemplate(module,path);
            customElements.define(name, CustomElement)
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