use crate::prelude::*;

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Section {
    name : String
}

impl WebView for Section {
    fn new_view(attributes:NamedNodeMap) -> Self {
        let name = attributes.get_named_item("name").unwrap().value().into();
        Self {name}
    }
}

webview!(Section);
template!(Section);
