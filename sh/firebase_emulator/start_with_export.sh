#!/bin/sh
# export/ のデータを利用して、 Firebase Emulator の実行
# 終了後に export/ を更新する
cd functions
npm run build
cd ..
firebase emulators:start --import=./export --export-on-exit=./export 