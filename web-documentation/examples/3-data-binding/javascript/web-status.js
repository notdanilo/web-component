import WebComponent from "/web-component.js"

export default class WebStatus extends WebComponent {
    constructor() {
        super();
        this.data = {
            status: true
        };
    }

    async getData() { return this.data; }

    async onload(root) {
        let button = root.getElementById("button");
        let component = this;
        button.onclick = function() {
            component.data.status = !component.data.status;
        };
    }
}