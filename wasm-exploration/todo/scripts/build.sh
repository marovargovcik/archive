#!/usr/bin/env bash

wasm-pack build --target web --out-dir public --no-pack --no-typescript
rm public/.gitignore