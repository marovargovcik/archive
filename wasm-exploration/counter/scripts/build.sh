#!/usr/bin/env bash

rustc --target wasm32-unknown-unknown -o public/counter.wasm src/lib.rs