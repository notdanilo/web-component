import Loader from "./loader.js"

export default class JavaScriptLoader extends Loader {
    load(module) {
        let name = module.path.getName();
        this._defineWebComponent(module, name, module.instance.default);
    }
}