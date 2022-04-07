use web_sys::HtmlElement;
pub trait WebComponent {
    fn new(element: HtmlElement) -> Self where Self: Sized;

    fn connected(&mut self) {}

    fn disconnected(&mut self) {}

    fn adopted(&mut self) {}

    fn attribute_changed(&mut self, _attribute_name: String, _old: Option<String>, _new: Option<String>) {}

    fn observed_attributes() -> Vec<String> where Self: Sized {
        vec![]
    }
}

pub type Identity = usize;