export default class WebClock {
    constructor(attributes) {
        this.data = {
            "timezone" : attributes.getNamedItem("timezone").value
        }
    }

    static async template() {
        var response = await fetch(`${import.meta.url.substring(0,import.meta.url.lastIndexOf("/"))}/template.html`);
        return response.text();
    }

    onLoaded(shadowRoot) {
        this.shadowRoot = shadowRoot;
        this.canvas     = shadowRoot.getElementById("canvas");
        this.context    = this.canvas.getContext("2d");
        this.size       = shadowRoot.host.getAttribute("size");
        this.canvas.setAttribute("width" , this.size);
        this.canvas.setAttribute("height", this.size);
        this.interval   = setInterval((function(object) {
            return function() {
                object.draw()
            }
        })(this), 16);
    }

    draw() {
        let width    = this.canvas.width;
        let height   = this.canvas.height;
        let center_x = width / 2.0;
        let center_y = height / 2.0;
        let radius   = height / 2.0 - 1;
        this.context.clearRect(0,0,width,height);
        this.context.beginPath();
        this.context.arc(center_x, center_y, radius, 0, Math.PI * 2.0, false);
        for (let i = 0; i < 60; i++) {
            let angle      = i / 60 * Math.PI * 2.0;
            let x          = Math.cos(angle);
            let y          = Math.sin(angle);
            let max_radius = radius * 0.95;
            this.context.moveTo(center_x + x * max_radius, center_y + y * max_radius);
            let min_radius = radius * (0.8 + (i % 5 ? 0.1 : 0.0));
            this.context.lineTo(center_x + x * min_radius, center_y + y * min_radius);
        }

        let now = new Date();
        let seconds        = now.getSeconds() + now.getMilliseconds() / 1000.0;
        let angle          = seconds / 60  * Math.PI * 2 - Math.PI / 2;
        let x              = Math.cos(angle);
        let y              = Math.sin(angle);
        let pointer_radius = radius * 0.9;
        this.context.moveTo(center_x,center_y);
        this.context.lineTo(center_x + x * pointer_radius,center_y + y * pointer_radius);

        let minutes    = now.getMinutes() + seconds / 60.0;
        angle          = minutes / 60 * Math.PI * 2 - Math.PI / 2;
        x              = Math.cos(angle);
        y              = Math.sin(angle);
        pointer_radius = radius * 0.7;
        this.context.moveTo(center_x,center_y);
        this.context.lineTo(center_x + x * pointer_radius,center_y + y * pointer_radius);

        let local_offset = -now.getTimezoneOffset() / 60;
        let offset       = local_offset;
        if (this.shadowRoot.host.hasAttribute("timezone")) {
            let timezone = this.shadowRoot.host.getAttribute("timezone");
            offset       = parseInt(timezone);
        }
        let relative_offset = offset - local_offset;
        let hours           = now.getHours() + minutes / 60.0 + relative_offset;
        angle               = hours / 12 * Math.PI * 2 - Math.PI / 2;
        x                   = Math.cos(angle);
        y                   = Math.sin(angle);
        pointer_radius      = radius * 0.5;
        this.context.moveTo(center_x,center_y);
        this.context.lineTo(center_x + x * pointer_radius,center_y + y * pointer_radius);
        this.context.stroke();
    }
}
