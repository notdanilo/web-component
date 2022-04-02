function Load(module, name) {
    let exported_name       = name.replaceAll("-", "_");
    let constructor_        = exported_name + "_constructor";
    let observed_attributes = exported_name + "_observed_attributes";
    class WebComponent extends HTMLElement {
        constructor() {
            super();
            self.identity = module[constructor_](this);
        }

        connectedCallback() {
            module.connected(self.identity);
        }

        disconnectedCallback() {
            module.disconnected(self.identity);
        }

        adoptedCallback() {
            module.adopted(self.identity);
        }

        attributeChangedCallback(name, oldValue, newValue) {
            module.attribute_changed(self.identity, name, oldValue, newValue);
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
