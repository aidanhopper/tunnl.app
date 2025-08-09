#!/usr/bin/env bash
docker build -t tunnl.app --platform linux/amd64,linux/arm64 .
docker tag tunnl.app aidanhopper/tunnl.app:latest
docker push aidanhopper/tunnl.app:latest
