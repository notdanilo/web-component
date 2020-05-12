import VElement from "./v-element-definition.js"

export default class VElementJavaScript extends VElement {
    static template() { return "<template></template>" }

    createObject(attributes) {
        return new this.class(attributes);
    }

    getData() {
        return this.object.data;
    }

    onLoaded(shadowRoot) {
        this.object.onLoaded(shadowRoot);
    }
}