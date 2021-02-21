use crate::prelude::*;

use web_sys::HtmlCanvasElement;
use web_sys::CanvasRenderingContext2d;
use wasm_bindgen::JsCast;

use js_sys::Math::*;
use js_sys::Date;
use js_sys::Function;
use std::f64::consts::PI;

#[derive(Serialize,Deserialize)]
pub struct Attributes {
    timezone: u32
}

#[derive(Serialize,Deserialize,WebComponent,Debug,Default)]
pub struct Clock {
    pub timezone : i32,
    #[serde(skip)]
    closure  : Option<Closure<dyn FnMut()>>
}

impl WebComponent for Clock {
    fn create_component(attributes: NamedNodeMap) -> Self {
        let timezone = if let Some(timezone) = attributes.get_named_item("timezone") {
            timezone.value().parse().unwrap()
        } else {
            0
        };
        let closure  = None;
        Self {timezone,closure}
    }

    fn on_loaded(&mut self, shadow_root: ShadowRoot) {
        let canvas  = shadow_root.get_element_by_id("canvas").expect("Couldn't get canvas.");
        let canvas  = canvas.dyn_into::<HtmlCanvasElement>().expect("Couldn't convert canvas.");
        let context = canvas.get_context("2d").expect("Couldn't get context.").expect("Context.");
        let context = context.dyn_into::<CanvasRenderingContext2d>().expect("Couldn't get context.");
        let size: String = shadow_root.host().get_attribute("size").map(|size| size.into()).unwrap_or("128".into());
        canvas.set_attribute("width", &size).ok();
        canvas.set_attribute("height", &size).ok();

        let draw = move || {
            let width = canvas.width() as f64;
            let height = canvas.height() as f64;
            let center_x = width / 2.0;
            let center_y = height.clone() / 2.0;
            let radius = height / 2.0 - 1.0;
            context.clear_rect(0.0,0.0,width.clone(),height.clone());
            context.begin_path();
            context.arc(center_x, center_y, radius, 0.0, PI * 2.0).ok();
            for i in 0..60 {
                let angle = i as f64 / 60.0 * PI * 2.0;
                let x = cos(angle);
                let y = sin(angle);
                let max_radius = radius * 0.95;
                context.move_to(center_x + x * max_radius, center_y + y * max_radius);
                let min_radius = radius * (0.8 + (if i % 5 != 0 { 0.1 } else { 0.0 }));
                context.line_to(center_x + x * min_radius, center_y + y * min_radius);
            }

            let now = Date::new_0();
            let seconds = now.get_seconds() as f64 + now.get_milliseconds() as f64 / 1000.0;
            let mut angle = seconds / 60.0  * PI * 2.0 - PI / 2.0;
            let mut x = cos(angle);
            let mut y = sin(angle);
            let mut pointer_radius = radius * 0.9;
            context.move_to(center_x,center_y);
            context.line_to(center_x + x * pointer_radius,center_y + y * pointer_radius);

            let minutes = now.get_minutes() as f64 + seconds / 60.0;
            angle = minutes / 60.0 * PI * 2.0 - PI / 2.0;
            x = cos(angle);
            y = sin(angle);
            pointer_radius = radius * 0.7;
            context.move_to(center_x,center_y);
            context.line_to(center_x + x * pointer_radius,center_y + y * pointer_radius);

            let local_offset = -now.get_timezone_offset() / 60.0;
            let mut offset = local_offset;
            if shadow_root.host().has_attribute("timezone") {
                let timezone = shadow_root.host().get_attribute("timezone").expect("Timezone.");
                offset = timezone.parse::<f64>().expect("Couldn't parse timezone.");
            }
            let relative_offset = offset - local_offset;
            let hours = now.get_hours() as f64 + minutes / 60.0 + relative_offset;
            angle = hours / 12.0 * PI * 2.0 - PI / 2.0;
            x = cos(angle);
            y = sin(angle);
            pointer_radius = radius * 0.5;
            context.move_to(center_x,center_y);
            context.line_to(center_x + x * pointer_radius,center_y + y * pointer_radius);
            context.stroke();
        };

        let closure = Closure::wrap(Box::new(draw) as Box<dyn FnMut()>);
        let function : &Function = closure.as_ref().unchecked_ref();

        let window = web_sys::window().expect("Window");
        window.set_interval_with_callback(&function).ok();
        self.closure = Some(closure);
    }
}

template!(Clock);
