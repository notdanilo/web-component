import WebComponent from "./web-component-definition.js"

export default class WebComponentWASM extends WebComponent {
    createObject() {
        let module = this.module;
        let create_method = this.path + "_create";
            create_method = module[create_method];
        return create_method(this.shadowRoot.host.attributes);
    }

    getData() {
        let module = this.module;
        let get_data_method = this.path + "_get_data";
            get_data_method = module[get_data_method];
        let json = "{}";
        if (get_data_method) json = get_data_method(this.object);
        return JSON.parse(json);
    }

    onLoaded() {
        let module = this.module;
        let on_loaded_method = this.path + "_on_loaded";
            on_loaded_method = module[on_loaded_method];
        if (on_loaded_method) on_loaded_method(this.object,this.shadowRoot);
    }
}