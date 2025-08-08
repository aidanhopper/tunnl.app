#!/usr/bin/env bash

if [ -f "quickstart.tar.xz" ]; then rm quickstart.tar.xz ; fi
cd quickstart || exit 1
tar -cJvf quickstart.tar.xz compose.yml configs
mv quickstart.tar.xz ..
cd ..
