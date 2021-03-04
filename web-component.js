import "./web-component/vue.js"

export { default as WebComponent } from "./web-component/base.js"
export { default as WebComponentLoader } from "./web-component/loader.js"

export default class WebComponent {
    constructor(attributes) {
        this.data = {}
    }

    static async template() {
        return null;
    }

    onLoaded(shadowRoot) {
    }
}