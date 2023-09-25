use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct TodoItem {
    name: String,
    is_done: bool,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct TodoList {
    items: Vec<TodoItem>,
}

#[wasm_bindgen]
impl TodoList {
    pub fn new() -> Self {
        TodoList { items: vec![TodoItem { 
            name: "Pre-existing todo item! Try to delete me.".to_string(),
            is_done: false,
        }]}
    }

    pub fn add(&mut self, todo_item_name: String) {
        self.items.push(TodoItem {
            name: todo_item_name,
            is_done: false,
        });
    }

    pub fn remove(&mut self, todo_item_name: String) {
        let item_index = self.items.iter().position(|item| item.name == todo_item_name);

        if let Some(index) = item_index {
            self.items.remove(index);
        }
    }

    pub fn mark_done(&mut self, todo_item_name: String) {
        let item_index = self.items.iter().position(|item| item.name == todo_item_name);

        if let Some(index) = item_index {
            self.items[index].is_done = true;
        }
    }

    pub fn mark_undone(&mut self, todo_item_name: String) {
        let item_index = self.items.iter().position(|item| item.name == todo_item_name);

        if let Some(index) = item_index {
            self.items[index].is_done = false;
        }
    }

    pub fn items(&self) -> Result<JsValue, serde_wasm_bindgen::Error> {
        serde_wasm_bindgen::to_value(&self)
    }
}