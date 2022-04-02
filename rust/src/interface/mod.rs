pub mod registry;

use wasm_bindgen::prelude::*;

use crate::web_component::Identity;
use crate::interface::registry::REGISTRY;

#[wasm_bindgen(module = "/js/importer.js")]
extern "C" {
    fn get_current_module() -> JsValue;
}

#[wasm_bindgen]
pub fn connected(identity: Identity) {
    unsafe {
        REGISTRY.object(identity).connected()
    }
}

#[wasm_bindgen]
pub fn disconnected(identity: Identity) {
    unsafe {
        REGISTRY.object(identity).disconnected()
    }
}

#[wasm_bindgen]
pub fn adopted(identity: Identity) {
    unsafe {
        REGISTRY.object(identity).adopted()
    }
}

#[wasm_bindgen]
pub fn attribute_changed(identity: Identity, name: String, old_value: Option<String>, new_value: Option<String>) {
    unsafe {
        REGISTRY.object(identity).attribute_changed(name, old_value, new_value)
    }
}
