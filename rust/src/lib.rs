pub use serde::{Serialize, Deserialize};
pub use wasm_bindgen::prelude::*;
pub use wasm_bindgen::JsCast;
pub use serde_json as json;
pub use web_sys::NamedNodeMap;

pub trait WebView {
    fn new_view(attributes:NamedNodeMap) -> Self;
}

#[macro_export]
macro_rules! webview {
    ($name:ident) => {
        paste::item! {
            #[wasm_bindgen]
            pub fn [<components_v_ $name:lower _create>](attributes:NamedNodeMap) -> String {
                let object = $name::new_view(attributes);
                json::to_string(&object).unwrap()
            }
        }
    }
}

#[macro_export]
macro_rules! template {
    ($name:ident) => {
        paste::item! {
            #[wasm_bindgen]
            pub fn [<components_v_ $name:lower _template>]() -> String {
                include_str!("template.html").to_string()
            }
        }
    }
}
