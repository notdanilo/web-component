import WebComponent from "../web-component.js"
import Loader from "./loader.js"

class TemplateWebComponent extends WebComponent {}

export default class TemplateLoader extends Loader {
    load(module) {
        let name = module.path.getName();
        this._defineWebComponent(module, name, TemplateWebComponent);
    }
}