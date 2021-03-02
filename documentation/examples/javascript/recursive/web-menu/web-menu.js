export default class WebMenu {
    constructor(attributes) {
        this.path = attributes.getNamedItem("path");
        this.json = attributes.getNamedItem("json");
        this.data = {
            "name": "Oi"
        }
    }

    updateField() {}

    static async template() {
        var response = await fetch(`${import.meta.url.substring(0,import.meta.url.lastIndexOf("/"))}/template.html`);
        return response.text();
    }

    async onLoaded() {
        if (this.path) {
            var response = await fetch(`${import.meta.url.substring(0,import.meta.url.lastIndexOf("/"))}/${this.path.value}`);
            let json = await response.json();
            for (var key in json) {
                this.data[key] = json[key];
            }
        } else {
            this.data = JSON.parse(this.json.value);

        }
    }
}
