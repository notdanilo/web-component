pub mod macros;
/// pub mod traits;
/// pub use traits::WebView;
/// pub mod objects_register;
/// pub use objects_register::OBJECTS_REGISTER;

pub use serde::{Serialize, Deserialize};
pub use wasm_bindgen::prelude::*;
pub use wasm_bindgen::JsCast;
pub use serde_json as json;
pub use web_sys::NamedNodeMap;
pub use web_sys::ShadowRoot;

pub trait WebView {
    fn get_data(&self) -> String;
    fn on_loaded(&mut self,_shadow_root:ShadowRoot) {}
}


pub struct ObjectsRegister<T> {
    register : Option<Vec<T>>
}

impl<T> ObjectsRegister<T> {
    fn instance(&mut self) -> &mut Vec<T> {
        if self.register.is_none() {
            self.register = Some(Default::default());
        }
        self.register.as_mut().unwrap()
    }

    pub fn object(&mut self,object:usize) -> &mut T {
        let instance = self.instance();
        &mut instance[object]
    }

    pub fn register_object(&mut self,object:T) -> usize {
        let instance = self.instance();
        instance.push(object);
        instance.len() - 1
    }
}

pub static mut OBJECTS_REGISTER : ObjectsRegister<Box<dyn WebView>> = ObjectsRegister {
    register : None
};
