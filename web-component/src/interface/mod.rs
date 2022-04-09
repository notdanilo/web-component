pub mod registry;

use wasm_bindgen::prelude::*;

use crate::custom_element::Identity;
use crate::interface::registry::REGISTRY;

#[wasm_bindgen]
pub async fn connected(identity: Identity) {
    unsafe {
        REGISTRY.object(identity).connected().await
    }
}

#[wasm_bindgen]
pub async fn disconnected(identity: Identity) {
    unsafe {
        REGISTRY.object(identity).disconnected().await
    }
}

#[wasm_bindgen]
pub async fn adopted(identity: Identity) {
    unsafe {
        REGISTRY.object(identity).adopted().await
    }
}

#[wasm_bindgen]
pub async fn attribute_changed(identity: Identity, name: String, old_value: Option<String>, new_value: Option<String>) {
    unsafe {
        REGISTRY.object(identity).attribute_changed(name, old_value, new_value).await
    }
}
