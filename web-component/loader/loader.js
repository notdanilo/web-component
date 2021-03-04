import WebComponent from "../web-component.js"

export default class Loader {
    async load(module) {}

    _defineWebComponent(module, name, webComponent) {
        // Store path in its prototype so all its instance can access it.
        webComponent.prototype.component = {
            "path": module.path
        };
        if (!customElements.get(name)) {
            customElements.define(name, webComponent);
        }
    }
}
