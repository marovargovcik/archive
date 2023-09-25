(module
  (func $helloworld (result i32)
    (i32.const 0)
  )
  
  (memory 1)
  (export "memory" (memory 0))
  (data (i32.const 0) "Hello, world")
  
  (export "helloworld" (func $helloworld))
)