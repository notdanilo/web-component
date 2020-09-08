use crate::prelude::*;

pub struct ObjectsRegister<T> {
    register : Vec<T>
}

impl<T> ObjectsRegister<T> {
    pub fn object(&mut self,object:usize) -> &mut T {
        &mut self.register[object]
    }

    pub fn register_object(&mut self,object:T) -> usize {
        self.register.push(object);
        self.register.len() - 1
    }
}

pub static mut OBJECTS_REGISTER : ObjectsRegister<Box<dyn WebComponent>> = ObjectsRegister {
    register : Vec::new()
};