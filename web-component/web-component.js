export default class WebComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    async getData() {
        // Inefficient method for deep-cloning.
        return JSON.parse(JSON.stringify(this.component.DATA));
    }

    async getTemplate() {
        return this.component.TEMPLATE;
    }

    async onload() {}

    async connectedCallback() {
        await this.#createTemplate();
        await this.#createBindings();
        this.onload(this.shadowRoot);
    }

    async #createTemplate() {
        let content  = await this.getTemplate();
        let template = this.#createTemplateFromString(content);
        let node     = this.#createNodeFromTemplate(template);
        this.shadowRoot.appendChild(node);
    }

    // Bindings

    static ATTRIBUTE_PREFIX = "component-bind:";

    parentComponent() {
        return this.shadowRoot.host.getRootNode().host;
    }

    getValue(data, index) {
        let split = index.split(".");
        for (let i = 0; i < split.length; i++) {
            data = data[split[i]];
        }
        return data;
    }

    async #createAttributesBindings() {
        let attributes = this.shadowRoot.host.attributes;
        this.data["attributes"] = {};
        for (var i = 0; i < attributes.length; i++) {
            let attribute = attributes[i];
            this.data["attributes"][attribute.name] = attribute.value;
            if (attribute.name.indexOf(WebComponent.ATTRIBUTE_PREFIX) == 0) {
                let name = attribute.name.substring(WebComponent.ATTRIBUTE_PREFIX.length);
                let value = attribute.value;
                let parent = this.parentComponent();
                console.log(parent.data);
                this.data[name] = this.getValue(parent.data, value);
            }
        }
    }

    async #createTemplateBindings() {
        // TODO
    }

    async #createBindings() {
        this.data = await this.getData();
        let el = this.shadowRoot.getElementById("vue");
        await this.#createAttributesBindings();

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

        // Watch changes.
        let watch = {};
        let data = this.data;
        this.vue = new Vue({el,data,watch});
        this.vue.web_component = this;

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

    // Template creation.
    #createTemplateFromString(string) {
        let innerDiv       = document.createElement("div");
        innerDiv.innerHTML = string;
        return innerDiv.firstChild;
    }

    #createNodeFromTemplate(template) {
        let node = document.importNode(template.content, true);
        let div  = document.createElement("div");
        div.setAttribute("id", "vue");
        div.appendChild(node);
        return div;
    }
}