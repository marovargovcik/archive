#!/usr/bin/env bash

echo "Launching WASM binary compiled to target wasm32-unknown-unknown:"
wasmtime dist/wasm-target-unknown

echo "Launching WASM binary compiled to target wasm32-wasi:"
wasmtime dist/wasm-target-wasi