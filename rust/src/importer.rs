use wasm_bindgen::prelude::*;

use web_sys::HtmlElement;
use crate::WebComponent;

pub struct Importer;

#[wasm_bindgen(module = "/js/importer.js")]
extern "C" {
    fn import_wc(path: String);
}

impl WebComponent for Importer {
    fn new(_element: HtmlElement) -> Self {
        Self
    }

    fn attribute_changed(&mut self, name: String, _: Option<String>, new: Option<String>) {
        match (name.as_str(), new.as_ref()) {
            ("path", Some(new)) => {
                import_wc(new.clone())
            },
            _ => ()
        }
    }

    fn observed_attributes() -> Vec<String> {
        vec!["path".into()]
    }
}

crate::define!(Importer, web_component);
