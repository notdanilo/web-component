use wasm_bindgen::prelude::*;
use async_trait::async_trait;
use url::Url;

use web_sys::{HtmlElement, window};
use crate::CustomElement;

mod default_web_component;
pub use default_web_component::*;

pub struct Importer {
    element: HtmlElement
}

mod js {
    use js_sys::Function;
    use wasm_bindgen::prelude::*;
    #[wasm_bindgen(module = "/src/importer/importer.js")]
    extern "C" {
        #[wasm_bindgen(js_name = Import)]
        pub async fn import(path: &str) -> JsValue;

        #[wasm_bindgen(js_name = LoadAll)]
        pub fn load_all(module: &JsValue, path: JsValue);

        #[wasm_bindgen(js_name = Initialize)]
        pub async fn initialize(module: &JsValue);

        #[wasm_bindgen(js_name = CreateWebComponent)]
        pub fn create_web_component(module: &JsValue, component_name: &str, component_path: &str) -> Function;
    }
}

#[wasm_bindgen(js_name = LoadAll)]
pub fn load_all(module: &JsValue, path: JsValue) {
    let path = path.as_string().unwrap_or_default();
    if let Ok(keys) = js_sys::Reflect::own_keys(&module) {
        let component_names = keys
            .iter()
            .filter(|key| key.is_string())
            .map(|key| key.as_string().unwrap())
            .filter(|key| key.ends_with("_constructor"))
            .map(|key| key[0..key.len() - "_constructor".len()].to_string())
            .map(|component| component.replace("_", "-"));
        for component_name in component_names {
            web_sys::console::log_1(&format!("Loading {}", component_name).into());
            let component_path = format!("{}/{}", path, component_name);
            let web_component = js::create_web_component(module, &component_name, &component_path);
            let custom_elements = window().unwrap().custom_elements();
            custom_elements.define(&component_name, &web_component).unwrap();
        }
    }
}

pub async fn import(path: &str) -> Option<JsValue> {
    let module = js::import(path).await;
    if module.is_object() {
        Some(module)
    } else {
        None
    }
}

#[async_trait(?Send)]
impl CustomElement for Importer {
    fn new(element: HtmlElement) -> Self {
        Self { element }
    }

    fn element(&'static self) -> &HtmlElement {
        &self.element
    }

    async fn attribute_changed(&'static mut self, name: String, _: Option<String>, path: Option<String>) {
        match (name.as_str(), path) {
            ("path", Some(path)) => {
                let path = Self::absolute_url(path);
                if let Some(path) = path {
                    self.import(path).await;
                }
            },
            _ => ()
        }
    }

    fn observed_attributes() -> Vec<String> {
        vec!["path".into()]
    }
}

impl Importer {
    fn absolute_url(path: String) -> Option<Url> {
        match Url::parse(&path) {
            Ok(path) => Some(path),
            Err(url::ParseError::RelativeUrlWithoutBase) => {
                window()
                    .and_then(|window| window
                        .location()
                        .href()
                        .ok()
                        .and_then(|href| {
                            Url::parse(&href)
                                .and_then(|url| url.join(&path))
                                .ok()
                        })
                    )
            },
            _ => None
        }
    }

    async fn import_module(&self, path: Url) -> Result<(), String> {
        let name = path
            .path_segments()
            .unwrap()
            .last()
            .unwrap()
            .to_string();
        let mut js_path = path.clone();
        {
            let mut segments = js_path.path_segments_mut().unwrap();
            segments.push(&format!("{}.js", name));
        }
        if let Some(module) = import(js_path.as_str()).await {
            js::initialize(&module).await;
            load_all(&module, path.as_str().into());
            Ok(())
        } else {
            Err("Failed to load module.".into())
        }
    }

    async fn import(&self, path: Url) {
        self.import_module(path).await.unwrap();
    }
}

crate::define!(Importer, web_component);
