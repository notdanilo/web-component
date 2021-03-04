import Loader from "./loader.js"
import WASMWebComponent from "../wasm.js"

export default class WASMLoader extends Loader {
    async load(module) {
        if (module.instance.default) await module.instance.default();
        for (let method in module.instance) {
            console.log(method);
            var result = method.match(/components_web_(.*)_create/);
            if (result && result.length == 2) {
                let componentName = "web-" + result[1];
                this.#loadComponent(module, componentName);
            }
        }
    }

    #loadComponent(module, name) {
        class CustomWebComponent extends WASMWebComponent {}
        let path = ("components_" + name).replace(/-|\//g,"_");
        CustomWebComponent.prototype.module = module;
        CustomWebComponent.prototype.path   = path;
        this._defineWebComponent(module, name, CustomWebComponent);
    }
}