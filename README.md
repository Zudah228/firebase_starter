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

# ディレクトリ構成
各ディレクトリの解説のリンク
- [スクリプト](#スクリプト)
- [テスト](#ユニットテスト)
```md
- functions/            ## Cloud Functions 関連
  - __script__/         ### 単体で実行するスクリプトファイル。
  - __test__/           ### ユニットテスト
  - domain/             ### プロダクトのドメイン知識
    - entities/         #### データモデル
    - repositories/     #### 外部API(もしくは GCP)との連携
  - presentation/       ### Cloud Functions に export する関数
  - utils/              ### Helper 関数など

- export/               # firebase emulator で使用する export

- rules/                # firebase セキュリティルールなどのの設定ファイル

- sh/                   # シェルスクリプト
  - deploy_rule_file/
  - firebase_emulator/
  - import_rule_file/
```

## スクリプト
単発で実行するスクリプト。

admin ユーザーの追加や、マスターデータの追加などに使用する。

### 手順
サービスアカウントキーを、`functions/src/__scripts__/service_account_keys/` に、 Project ID をファイル名として追加する。

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

### ディレクトリ構造
```md
functions/src/__test__
├── assets                   # Storage のテストなどに利用するファイル
│   └── sample_image.png
├── tests                    # テスト実行ファイル
│   └── template             # 本テンプレート機能に関するテスト
├── config.ts
└── index.ts
```
### 実装
`functions/src/__test__/tests/template/` にある実装方法を参考にする。

`functions/src/__test__/index.ts` にある、`FirebaseUnitTest class` を利用する。
```ts
describe("xxx に関するテスト", () => {
  let firebaseUnitTest: FirebaseUnitTest;

  const documentPath = TestEntity.documentPath;

  beforeAll(async () => {
    firebaseUnitTest = await FirebaseUnitTest.setUp();
  });

  afterEach(async () => {
    await firebaseUnitTest.dispose();
  });

  test("xxxの成功", async () => {
    // test
    // ...
    expect(data).toEqual(true);
  })
)
```
