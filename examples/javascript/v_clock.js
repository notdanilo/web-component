export function components_v_clock_create(attributes) {
    return {
        "data" : {
            "timezone" : attributes.getNamedItem("timezone").value
        }
    }
}

export function components_v_clock_get_data(object) {
    return JSON.stringify(object.data)
}

export function components_v_clock_on_loaded(object,shadowRoot) {
    let canvas  = shadowRoot.getElementById("canvas");
    let context = canvas.getContext("2d");
    let size = shadowRoot.host.getAttribute("size");
    canvas.setAttribute("width", size);
    canvas.setAttribute("height", size);

    function draw() {
        let width = canvas.width;
        let height = canvas.height;
        let center_x = width / 2.0;
        let center_y = height / 2.0;
        let radius = height / 2.0 - 1;
        context.clearRect(0,0,width,height);
        context.beginPath();
        context.arc(center_x, center_y, radius, 0, Math.PI * 2.0, false);
        for (let i = 0; i < 60; i++) {
            let angle = i / 60 * Math.PI * 2.0;
            let x = Math.cos(angle);
            let y = Math.sin(angle);
            let max_radius = radius * 0.95;
            context.moveTo(center_x + x * max_radius, center_y + y * max_radius);
            let min_radius = radius * (0.8 + (i % 5 ? 0.1 : 0.0));
            context.lineTo(center_x + x * min_radius, center_y + y * min_radius);
        }

        let now = new Date();
        let seconds = now.getSeconds() + now.getMilliseconds() / 1000.0;
        let angle = seconds / 60  * Math.PI * 2 - Math.PI / 2;
        let x = Math.cos(angle);
        let y = Math.sin(angle);
        let pointer_radius = radius * 0.9;
        context.moveTo(center_x,center_y);
        context.lineTo(center_x + x * pointer_radius,center_y + y * pointer_radius);

        let minutes = now.getMinutes() + seconds / 60.0;
        angle = minutes / 60 * Math.PI * 2 - Math.PI / 2;
        x = Math.cos(angle);
        y = Math.sin(angle);
        pointer_radius = radius * 0.7;
        context.moveTo(center_x,center_y);
        context.lineTo(center_x + x * pointer_radius,center_y + y * pointer_radius);

        let local_offset = -now.getTimezoneOffset() / 60;
        let offset = local_offset;
        if (shadowRoot.host.hasAttribute("timezone")) {
            let timezone = shadowRoot.host.getAttribute("timezone");
            offset = parseInt(timezone);
        }
        let relative_offset = offset - local_offset;
        let hours = now.getHours() + minutes / 60.0 + relative_offset;
        angle = hours / 12 * Math.PI * 2 - Math.PI / 2;
        x = Math.cos(angle);
        y = Math.sin(angle);
        pointer_radius = radius * 0.5;
        context.moveTo(center_x,center_y);
        context.lineTo(center_x + x * pointer_radius,center_y + y * pointer_radius);
        context.stroke();
    }

    draw();
    setInterval(draw, 16);
}

export function components_v_clock_template() {
    return '<template><center>Timezone: {{ timezone }}<br/><canvas id="canvas"></canvas></center></template>'
}
