export default class VElement extends HTMLElement {
    constructor() {
        super()
        this.shadow_root = this.attachShadow({mode: 'open'});
    }

    async connectedCallback() {
        let path = this.path;

        if (this.template === undefined) {
            let text;
            if (this.rustTemplate) {
                text = this.rustTemplate;
            } else {
                let response = await fetch(path + "/template.html");
                text         = await response.text();
            }
            let div       = document.createElement("div");
            div.innerHTML = text;
            this.template = div.firstChild;
        }

        let node = document.importNode(this.template.content, true);
        let div  = document.createElement("div");
        div.setAttribute("id", "vue");
        div.appendChild(node);
        this.shadow_root.appendChild(div);
    }

//    static get observedAttributes() {
//      return ['size'];
//    }

//    attributeChangedCallback(name, oldValue, newValue) {
//        let data = {name:name}
//        console.log(`${data.name} ${oldValue} ${newValue}`);
//    }

}