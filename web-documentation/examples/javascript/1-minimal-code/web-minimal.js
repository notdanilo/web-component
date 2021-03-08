import WebComponent from "/web-component.js"

export default class WebMinimal extends WebComponent {
    static async template() {
        var response = await fetch(`${import.meta.url.substring(0,import.meta.url.lastIndexOf("/"))}/web-minimal.html`);
        return response.text();
    }
}
