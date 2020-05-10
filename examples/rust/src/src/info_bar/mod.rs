use crate::prelude::*;

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct InfoBar {
    black : String,
    white : String
}

impl WebView for InfoBar {
    fn new_view(attributes:NamedNodeMap) -> Self {
        let black = attributes.get_named_item("black").map(|v| v.value()).unwrap_or("".into());
        let white = attributes.get_named_item("white").map(|v| v.value()).unwrap_or("".into());
        Self {black,white}
    }
}

webview!(InfoBar);
template!(InfoBar);
