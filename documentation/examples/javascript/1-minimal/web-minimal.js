export default class WebMinimal {
    constructor(attributes) {
        this.data = {}
    }

    static async template() {
        var response = await fetch(`${import.meta.url.substring(0,import.meta.url.lastIndexOf("/"))}/web-minimal.html`);
        return response.text();
    }

    onLoaded(shadowRoot) {
    }
}
