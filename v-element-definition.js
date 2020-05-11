export default class VElement extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: 'open'});
    }

    getTemplate() {
        return this.template;
    }

    createNodeFromTemplate(template) {
        let node = document.importNode(template.content, true);
        let div  = document.createElement("div");
        div.setAttribute("id", "vue");
        div.appendChild(node);
        return div;
    }

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

    elementIsLoaded() {
        let module = this.module;
        let on_loaded_method = this.path + "_on_loaded";
            on_loaded_method = module[on_loaded_method];
        if (on_loaded_method) on_loaded_method(this.object,this.shadowRoot);
    }

    async connectedCallback() {
        this.object  = this.createObject();
        let data     = this.getData();
        let template = this.getTemplate();
        let node     = this.createNodeFromTemplate(template);
        this.shadowRoot.appendChild(node);
        this.createBindings(data);
        this.elementIsLoaded();
    }

    createBindings(data) {
        let el = this.shadowRoot.getElementById("vue");

        // We need to remove style elements from the template because Vue doesn't
        // compile it.
        let styles = [];
        let styles_in_el = el.getElementsByTagName("style");
        for (var i = 0; i < styles_in_el.length; i++) {
            styles.push(styles_in_el[i].parentNode.removeChild(styles_in_el[i]))
        }

        // Vue is also not working with standard <slot> tags when a new Vue instance is created.
        // We can replace it with a <div> placeholder and recover the original slots after the
        // instance is created.
        let slots = [];
        let slots_in_el = el.getElementsByTagName("slot");
        for (var i = 0; i < slots_in_el.length; i++) {
            let elem = slots_in_el[i];
            let id   = "placeholder#" + i;
            let placeholder = document.createElement("div");
            placeholder.id = id;
            elem.replaceWith(placeholder);
            slots.push({elem,id})
        }

        Vue.config.silent = true;
        this.vue = new Vue({el,data});

        // We then put the style elements back.
        for (var i = 0; i < styles.length; i++) {
            this.vue.$el.prepend(styles[i]);
        }

        // We can now get the slots back.
        for (var i = 0; i < slots.length; i++) {
            let slot = slots[i];
            this.shadowRoot.getElementById(slot.id).replaceWith(slot.elem)
        }
    }
}