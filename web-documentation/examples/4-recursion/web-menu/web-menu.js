import WebComponent from "/web-component.js"

export default class WebMenu extends WebComponent {
    async getDataFromStaticFile() {
        return super.getData();
    }

    getDataFromAttribute() {
        let menu = JSON.parse(this.attributes["menu"].value);
        return { menu };
    }

    async getData() {
        if (this.attributes["menu"])
            return this.getDataFromAttribute();
        else
            return this.getDataFromStaticFile();
    }
}