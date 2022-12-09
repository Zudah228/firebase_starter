# firebase starter

Firebase のテンプレート

### 環境
```md
# Cloud Functions:
  - NodeJS: 16.13.1
  - TypeScript: 4.8.3
```
# 環境の構築
## グローバルの npm に firebase_tools の追加
```sh
npm install -g firebase_tools@latest
```
## .firebaserc の設定
これを設定しないと、firebase_tools 
```json
{
  "projects": {
    "dev": "${DEV_PROJECT_ID}",
    "stg": "${STG_PROJECT_ID}",
    "prod": "${PROD_PROJECT_ID}"
  }
}
```

## firebase 環境の設定
```sh
firebase use dev
# or
firebase use stg
# or
firebase use prod
```
## .env ファイルの設定
```
# 実行するテストの Project ID
TEST_PROJECT_ID=

# Script で使用する環境変数
PROJECT_ID=
AUTH_DOMAIN=${PROJECT_ID}.firebaseapp.com
DATABASE_URL=https://${PROJECT_ID}-default-rtdb.firebaseio.com
STORAGE_BUCKET=${PROJECT_ID}.appspot.com
```

## スクリプト
単発で実行するスクリプト。
サービスアカウントキーを、`functions/src/__scripts__/service_account_keys/` に、 Project ID の名前で追加する。

```md
functions/src/__scripts__
├── InitializeFirebaseApp.ts
├── config.ts
└── service_account_keys
    └── ${PROJECT_ID}.json
```


## ユニットテスト
ディレクトリ: `functions/src/__test__`

### 環境
```md
# jest
^29.3.1

# ts-jest
^29.0.3

# firebase-functions-test
^2.4.0
```
### 手順
1. Firebase Emulator を起動

    jest を実行すると、Emulator のデータを全て消すので、注意。
    ```sh
    sh sh/firebase_emulator/start.sh
    ```
    もしくは
    ```
    firebase emulators:start
    ```
2. jest を実行

    vscode の拡張機能、もしくはスクリプトで実行。
    ts-jest を導入しているので、ts ファイル直接指定で実行可能。
    ```
    npm run test ${実行ファイルのパス}
    ```

## tree
### rules
```
rules
├── cors.json
├── firestore.indexes.json
├── firestore.rules
└── storage.rules
```
### sh
```
sh
├── deploy_rule
│   ├── deploy_all_rules.sh
│   ├── deploy_firestore_index.sh
│   ├── deploy_firestore_rule.sh
│   ├── deploy_storage_rule.sh
│   └── set_storage_cors.sh
├── firebase_emulator
│   ├── start.sh
│   ├── start_with_data_not_export.sh
│   └── start_with_export.sh
└── import_rules
    └── import_firestore_index.sh
```
### functions
```
functions
├── src
│   ├── __scripts__
│   ├── __test__
│   ├── domain
│   ├── presentation
│   │   ├── auth_trigger
│   │   ├── firestore_trigger
│   │   │   └── index.ts
│   │   ├── http
│   │   │   └── index.ts
│   │   ├── pub_sub
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── utils
│   ├── config.ts
│   └── index.ts
│
├── babel.config.js
├── jest.config.js
├── package-lock.json
├── package.json
├── tsconfig.dev.json
└── tsconfig.json
```