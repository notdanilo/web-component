export default class VElement extends HTMLElement {
    constructor() {
        super()
        this.shadow_root = this.attachShadow({mode: 'open'});
    }

    get_template() {
        let text = "";
        if (this.templateText) {
            text = this.templateText;
        }
        let inner_div       = document.createElement("div");
        inner_div.innerHTML = text;
        return inner_div.firstChild;
    }

    new_node_from_template(template) {
        let node = document.importNode(template.content, true);
        let div  = document.createElement("div");
        div.setAttribute("id", "vue");
        div.appendChild(node);
        return div;
    }

    async connectedCallback() {
        let template = this.get_template();
        let node     = this.new_node_from_template(template);
        this.shadow_root.appendChild(node);
    }
}