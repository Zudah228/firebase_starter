#!/bin/sh
# import も export もせずに Firebase Emulator の実行

cd functions
npm run build
cd ..
firebase emulators:start