use wasm_bindgen::prelude::*;
use async_trait::async_trait;

use web_sys::HtmlElement;
use crate::CustomElement;

pub struct Importer {
    element: HtmlElement
}

mod js {
    use wasm_bindgen::prelude::*;
    #[wasm_bindgen(module = "/src/importer/importer.js")]
    extern "C" {
        #[wasm_bindgen(js_name = Import)]
        pub fn import(path: String);

        #[wasm_bindgen(js_name = LoadAll)]
        pub fn load_all(module: JsValue);
    }
}

#[wasm_bindgen(js_name = Import)]
pub fn import(path: String) {
    js::import(path);
}

#[wasm_bindgen(js_name = LoadAll)]
pub fn load_all(module: JsValue) {
    js::load_all(module);
}

#[async_trait(?Send)]
impl CustomElement for Importer {
    fn new(element: HtmlElement) -> Self {
        Self { element }
    }

    fn element(&'static self) -> &HtmlElement {
        &self.element
    }

    async fn attribute_changed(&'static mut self, name: String, _: Option<String>, new: Option<String>) {
        match (name.as_str(), new.as_ref()) {
            ("path", Some(new)) => {
                import(new.clone())
            },
            _ => ()
        }
    }

    fn observed_attributes() -> Vec<String> {
        vec!["path".into()]
    }
}

crate::define!(Importer, web_component);
