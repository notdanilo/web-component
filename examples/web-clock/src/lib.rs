use wasm_bindgen::JsCast;

use web_sys::{HtmlElement, ShadowRootMode, ShadowRootInit, window, HtmlTemplateElement};
use web_component::WebComponent;

pub struct Clock {
    pub element: HtmlElement
}

impl WebComponent for Clock {
    fn new(element: HtmlElement) -> Self {
        element.attach_shadow(&ShadowRootInit::new(ShadowRootMode::Open)).ok();
        Self {element}
    }

    // TODO: Gotta make this async.
    fn connected(&mut self) {
        if let Some(shadow_root) = self.element.shadow_root() {
            let window = window().unwrap();
            let document = window.document().unwrap();
            let template = document.create_element("div").unwrap();
            let promise = window.fetch_with_str("index.html");
            wasm_bindgen_futures::spawn_local(async {
                let future = wasm_bindgen_futures::JsFuture::from(promise);
                let content = future.await.unwrap();
                let response = content.dyn_into::<web_sys::Response>().unwrap();
                wasm_bindgen_futures::spawn_local(async move {
                    let promise = response.text().unwrap();
                    let future = wasm_bindgen_futures::JsFuture::from(promise);
                    let text = future.await.unwrap().as_string().unwrap();
                    web_sys::console::log_1(&format!("{:?}", text).into());
                });
            });
            template.set_inner_html("<template>Eita</template>");
            let template = template.first_child().unwrap().dyn_into::<HtmlTemplateElement>().unwrap();
            let node = document.import_node_with_deep(&template.content(), true).unwrap();
            shadow_root.append_child(&node).ok();
        }
    }

    fn attribute_changed(&mut self, attribute_name: String, old_value: Option<String>, new_value: Option<String>) {
        web_sys::console::log_1(&format!("{}: {:?} -> {:?}", attribute_name, old_value, new_value).into());
    }

    fn observed_attributes() -> Vec<String> {
        vec!["a".into(), "b".into()]
    }
}

web_component::define!(Clock, web_clock);