import * as wc from "/rust/pkg/web_component.js"
await wc.default();

export default class WebComponent extends HTMLElement {
    constructor() {
        super();
        wc.constructor(this);
    }

    connectedCallback() {
        wc.connected(this);
    }

    disconnectedCallback() {
        wc.disconnected(this);
    }

    adoptedCallback() {
        wc.adopted(this);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        wc.attribute_changed(this, name, oldValue, newValue);
    }

    static get observedAttributes() {
        return wc.observed_attributes();
    }
}

customElements.define('test-component', WebComponent);