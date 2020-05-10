use crate::prelude::*;

#[derive(Serialize,Deserialize,Debug,Default)]
pub struct Contact {
    pub name     : String,
    pub title    : String,
    pub address  : String,
    pub phone    : String,
    pub email    : String,
    pub birthday : String
}

impl WebView for Contact {
    fn new_view(attributes:NamedNodeMap) -> Self {
        let attribute = attributes.get_named_item("json");
        if let Some(attribute) = attribute {
            let json = attribute.value();
            if let Ok(object) = serde_json::from_str(&json) {
                object
            } else {
                Default::default()
            }
        } else {
            Default::default()
        }
    }
}

webview!(Contact);
template!(Contact);
