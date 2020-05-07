import { default as VElement } from "./v-element-definition.js"

export default class VElementLoader extends HTMLElement {
    resolvePath() {
        let path = this.getAttribute("path");
        if (path[0] == '/') {
          path = path.substr(1);
        } else if (this.getRootNode().host) {
            path = this.getRootNode().host.path + "/" + path;
        }
        return path;
    }

  async connectedCallback() {
    let path = this.resolvePath();
    let name = path.substr(path.lastIndexOf("/") + 1)
    if (!customElements.get(name)) {
        let CustomElement;
        try {
            throw "scripting loading not implemented";
            let module = await import("/" + path + "/script.js");
            CustomElement = module.CustomElement;
        } catch (e) {
            let template;
            class Element extends VElement {
                constructor() {
                    super(name)
                }

                async connectedCallback() {
                    let module = await import("/finances_core.js");
                    await module.default();

                    let prefix = this.path.replace(/-|\//g,"_");
                    if (module[prefix + "_template"])
                        this.rustTemplate = module[prefix + "_template"]();
                    let json = "{}";
                    if (module[prefix + "_create"])
                        json = module[prefix + "_create"](this.shadow_root.host.attributes)
                    let data = JSON.parse(json);

                    await super.connectedCallback();

                    let el     = this.shadow_root.getElementById("vue");

                    // We need to remove style elements from the template because Vue doesn't
                    // compile it.
                    let styles = [];
                    let styles_in_el = el.getElementsByTagName("style");
                    for (var i = 0; i < styles_in_el.length; i++) {
                        styles.push(styles_in_el[i].parentNode.removeChild(styles_in_el[i]))
                    }

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

                    this.vue   = new Vue({el,data});

                    // We then put the style elements back.
                    for (var i = 0; i < styles.length; i++) {
                        this.vue.$el.prepend(styles[i]);
                    }

                    for (var i = 0; i < slots.length; i++) {
                        let slot = slots[i];
                        this.shadow_root.getElementById(slot.id).replaceWith(slot.elem)
                    }
//                    module.connected_callback(this);
                }
            }


            CustomElement = Element;
            CustomElement.prototype.template = template;
        }
        CustomElement.prototype.path = path;
        customElements.define(name, CustomElement)
    }
  }
}

// Define the new element
customElements.define('v-element', VElementLoader);