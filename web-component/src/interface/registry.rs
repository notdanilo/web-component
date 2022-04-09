use crate::{CustomElement, Identity};

pub struct Registry<T> {
    register : Vec<T>
}

impl<T> Registry<T> {
    pub fn object(&mut self, object: Identity) -> &mut T {
        &mut self.register[object]
    }

    pub fn register_object(&mut self, object: T) -> Identity {
        self.register.push(object);
        self.register.len() - 1
    }
}

pub static mut REGISTRY: Registry<Box<dyn CustomElement>> = Registry {
    register : Vec::new()
};
