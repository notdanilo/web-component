import WebComponent from "./definition.js"

export default class WebComponentJavaScript extends WebComponent {
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