use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::{HtmlElement, HtmlTemplateElement, ShadowRootInit, ShadowRootMode, window};

pub trait WebComponent {
    fn new(element: HtmlElement) -> Self;

    fn connected(&mut self) {}

    fn disconnected(&mut self) {}

    fn adopted(&mut self) {}

    fn attribute_changed(&mut self, _attribute_name: String, _old: Option<String>, _new: Option<String>) {}

    fn observed_attributes() -> Vec<String> {
        vec![]
    }
}

pub struct Clock {
    element: HtmlElement
}

// #[web_component(name = "web-clock")]
impl WebComponent for Clock {
    fn new(element: HtmlElement) -> Self {
        Self {element}
    }
}

#[wasm_bindgen(module = "/js/foo.js")]
extern "C" {
    fn add(a: u32, b: u32) -> u32;
}

#[wasm_bindgen]
pub fn constructor(element: HtmlElement) {
    println!("{}", add(1, 2));
    element.attach_shadow(&ShadowRootInit::new(ShadowRootMode::Open)).ok();
}

#[wasm_bindgen]
pub fn connected(element: HtmlElement) {
    if let Some(shadow_root) = element.shadow_root() {
        let document = window()
            .and_then(|window| window.document())
            .unwrap();
        let template = document.create_element("div").unwrap();
        template.set_inner_html("<template>Eita</template>");
        let template = template.first_child().unwrap().dyn_into::<HtmlTemplateElement>().unwrap();
        let node = document.import_node_with_deep(&template.content(), true).unwrap();
        shadow_root.append_child(&node).ok();
    }
}

#[wasm_bindgen]
pub fn disconnected(_element: HtmlElement) {}

#[wasm_bindgen]
pub fn adopted(_element: HtmlElement) {}

#[wasm_bindgen]
pub fn attribute_changed(_element: HtmlElement, name: String, old_value: JsValue, new_value: JsValue) {
    web_sys::console::log_1(&format!("{}: {:?} -> {:?}", name, old_value, new_value).into());
}

#[wasm_bindgen]
pub fn observed_attributes() -> Vec<JsValue> {
    vec!["a".into(), "b".into()]
}
