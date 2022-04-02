use wasm_bindgen::prelude::*;
use wasm_bindgen::{JsCast, JsValue};

use web_sys::{HtmlElement, ShadowRootMode, ShadowRootInit, window, HtmlTemplateElement};
use crate::{WebComponent, Identity};
use crate::registry::REGISTRY;

pub struct Importer {
    element: HtmlElement
}

#[wasm_bindgen(module = "/js/importer.js")]
extern "C" {
    fn import_wc(path: String);
}

impl WebComponent for Importer {
    fn new(element: HtmlElement) -> Self {
        Self {element}
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

#[wasm_bindgen]
pub fn web_component_constructor(element: HtmlElement) -> Identity {
    unsafe {
        REGISTRY.register_object(Box::new(Importer::new(element)))
    }
}

#[wasm_bindgen]
pub fn web_component_observed_attributes() -> Vec<JsValue> {
    Importer::observed_attributes()
        .into_iter()
        .map(|value| value.into())
        .collect()
}
