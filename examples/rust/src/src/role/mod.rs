use crate::prelude::*;

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Role {
    name       : String,
    period     : String,
    location   : String,
    keywords   : Vec<String>,
    activities : String
}