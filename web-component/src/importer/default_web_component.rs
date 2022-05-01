use web_sys::HtmlElement;
use async_trait::async_trait;
use crate::WebComponent;

pub struct DefaultWebComponent {
    element: HtmlElement
}

#[async_trait(?Send)]
impl WebComponent for DefaultWebComponent {
    fn new(element: HtmlElement) -> Self {
        Self { element }
    }

    fn element(&self) -> &HtmlElement {
        &self.element
    }

    async fn connected(&mut self) {
        web_sys::console::log_1(&"Default connected".into());
    }
}

crate::define!(DefaultWebComponent, default_web_component);
