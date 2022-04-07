use async_trait::async_trait;
use web_sys::HtmlElement;

#[async_trait(?Send)]
pub trait WebComponent {
    fn new(element: HtmlElement) -> Self where Self: Sized;

    async fn connected(&mut self) {}

    async fn disconnected(&mut self) {}

    async fn adopted(&mut self) {}

    async fn attribute_changed(&mut self, _attribute_name: String, _old: Option<String>, _new: Option<String>) {}

    fn observed_attributes() -> Vec<String> where Self: Sized {
        vec![]
    }
}

pub type Identity = usize;