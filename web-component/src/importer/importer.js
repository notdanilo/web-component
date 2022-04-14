function Load(module, name, path) {
    let exported_name       = name.replaceAll("-", "_");
    let constructor_        = exported_name + "_constructor";
    let observed_attributes = exported_name + "_observed_attributes";
    class WebComponent extends HTMLElement {
        constructor() {
            super();
            this.path = path;
            this.name = name;
            this.identity = module[constructor_](this);
        }

        async connectedCallback() {
            await module.connected(this.identity);
        }

        async disconnectedCallback() {
            await module.disconnected(this.identity);
        }

        async adoptedCallback() {
            await module.adopted(this.identity);
        }

        async attributeChangedCallback(name, oldValue, newValue) {
            await module.attribute_changed(this.identity, name, oldValue, newValue);
        }

        static get observedAttributes() {
            return module[observed_attributes]();
        }
    }

    customElements.define(name, WebComponent);
}

export function LoadAll(module, module_path) {
    for (let key in module) {
        if (key.endsWith("_constructor")) {
            let component_name = key.substring(0, key.length - "_constructor".length).replaceAll("_", "-");
            let component_path = module_path + "/" + component_name;
            Load(module, component_name, component_path);
        }
    }
}

export function Import(path) {
    let name = path.substring(path.lastIndexOf("/") + 1);
    let module = import(path + "/" + name + ".js");
    module.then(module => {
        module
            .default()
            .then(initialized => LoadAll(module, path));
    })
}
