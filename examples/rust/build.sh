#!/bin/bash
wasm-pack build --target web --no-typescript
cp ../../*.js pkg/
