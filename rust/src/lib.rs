pub mod macros;

pub use serde::{Serialize, Deserialize};
pub use wasm_bindgen::prelude::*;
pub use wasm_bindgen::JsCast;
pub use serde_json as json;
pub use web_sys::NamedNodeMap;
pub use web_sys::ShadowRoot;

pub trait WebView {
    fn new_view(attributes:NamedNodeMap) -> Self;
    fn initialize(_shadow_root:ShadowRoot) {}
}
