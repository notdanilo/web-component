#[macro_export]
macro_rules! webview {
    ($name:ident) => {
        paste::item! {
            #[wasm_bindgen]
            pub fn [<components_v_ $name:lower _create>](attributes:NamedNodeMap) -> String {
                let object = $name::new_view(attributes);
                json::to_string(&object).unwrap()
            }

            #[wasm_bindgen]
            pub fn [<components_v_ $name:lower _initialize>](shadow_root:ShadowRoot) {
                $name::initialize(shadow_root);
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
