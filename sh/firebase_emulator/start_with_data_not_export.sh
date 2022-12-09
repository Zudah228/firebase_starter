#!/bin/sh
# export/ のデータを利用して Firebase Emulator の実行するが、
# 終了後に export/ を更新しない。

cd functions
npm run build
cd ..
firebase emulators:start --import=./export