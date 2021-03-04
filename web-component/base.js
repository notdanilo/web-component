import { logger } from "./logger.js";
let subLogger = logger.sub("definition");

export default class WebComponent extends HTMLElement {
    createObject(attributes) {
        return new WebComponent();
    }

    getData() {}

    onLoaded() {}

    updateField(name, value) {}

    constructor() {
        super()
        this.data = {};
        this.attachShadow({mode: 'open'});
        this.logger = subLogger.sub(this.localName);
        this.logger.info(`Constructed.`)
    }

    static template() { return "<template></template>" }

    getTemplate() {
        return this.template;
    }

    createNodeFromTemplate(template) {
        let node = document.importNode(template.content, true);
        let div  = document.createElement("div");
        div.setAttribute("id", "vue");
        div.appendChild(node);
        this.logger.info(`Node created from template.`);
        return div;
    }

    async connectedCallback() {
        this.object  = this.createObject(this.shadowRoot.host.attributes);
        let data     = this.getData();
        let template = this.getTemplate();
        let node     = this.createNodeFromTemplate(template);
        this.shadowRoot.appendChild(node);
        this.createBindings(data);
        this.onLoaded(this.shadowRoot);
        this.logger.info(`Connected to DOM.`);
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

        // Watch changes.
        let watch = {};
        for (var name in data) {
            watch[name] = (function(name) {
                return function(new_val,_) {
                    let data = JSON.stringify(new_val);
                    this.web_component.updateField(name, data);
                }
            })(name)
        }
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
        this.logger.info(`Bindings created.`)
    }
}