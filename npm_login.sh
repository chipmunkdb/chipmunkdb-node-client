#!/bin/bash

echo "registry=https://registry.npmjs.org/" >> .npmrc
echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" >> .npmrc

