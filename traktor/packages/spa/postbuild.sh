#!/bin/sh

DIST=../server/public/spa
rm -r $DIST
mkdir $DIST
cp -r ./build/. $DIST
