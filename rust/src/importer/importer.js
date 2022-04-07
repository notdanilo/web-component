function Load(module, name) {
    let exported_name       = name.replaceAll("-", "_");
    let constructor_        = exported_name + "_constructor";
    let observed_attributes = exported_name + "_observed_attributes";
    class WebComponent extends HTMLElement {
        constructor() {
            super();
            self.identity = module[constructor_](this);
        }

        async connectedCallback() {
            await module.connected(self.identity);
        }

        async disconnectedCallback() {
            await module.disconnected(self.identity);
        }

        async adoptedCallback() {
            await module.adopted(self.identity);
        }

        async attributeChangedCallback(name, oldValue, newValue) {
            await module.attribute_changed(self.identity, name, oldValue, newValue);
        }

        static get observedAttributes() {
            return module[observed_attributes]();
        }
    }

    customElements.define(name, WebComponent);
}

export function LoadAll(module) {
    for (let key in module) {
        if (key.endsWith("_constructor")) {
            let name = key.substring(0, key.length - "_constructor".length).replaceAll("_", "-");
            Load(module, name);
        }
    }
}

export function Import(path) {
    let module = import(path);
    module.then(module => {
        module
            .default()
            .then(initialized => LoadAll(module));
    })
}
