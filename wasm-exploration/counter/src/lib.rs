static mut COUNTER: i32 = 0;

#[no_mangle]
pub extern fn increment() -> () {
    unsafe {
        COUNTER += 1;
        ()
    }
}

#[no_mangle]
pub extern fn decrement() -> () {
    unsafe {
        COUNTER -= 1;
        ()
    }
}

#[no_mangle]
pub extern fn get() -> i32 {
    unsafe {
        COUNTER
    }
}

fn main() {}