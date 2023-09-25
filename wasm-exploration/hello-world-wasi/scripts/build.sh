#!/usr/bin/env bash

rm -rf dist
mkdir dist
rustc --target wasm32-unknown-unknown -o dist/wasm-target-unknown src/lib.rs
rustc --target wasm32-wasi -o dist/wasm-target-wasi src/lib.rs