# Remix リフレーミング & 自己肯定感アップ (Remix Reframing)

ネガティブな言葉や出来事をポジティブな視点へ変換（リフレーミング）し、自己肯定感を高めるメンタルケア Web アプリケーションです。

## 主な機能

- **AI リフレーミング**: Gemini API を活用し、短所やネガティブに思える表現を強みや魅力に瞬時に変換。状況別の活躍シーンや自己受容メッセージ、アファメーションを提案します。
- **ユーザー認証 & クラウド保存**: Google アカウントでログインし、ユーザーごとにリフレーミング記録やパートナーデータを安全に PostgreSQL データベースへ永続化。
- **リフレーミング辞書**: 日常でよくある性格や行動の言い換え一覧（検索・カテゴリ絞り込み対応）。
- **ジャーナル / 記録**: リフレーミングした言葉や日々の気づきを保存・お気に入り管理。
- **今日のカード & 音声読み上げ**: Web Speech API によるアファメーションの読み上げ機能。
- **パートナー育成（ココロん）**: ログインやリフレーミングの記録で経験値やポイントを獲得し、アイテムで着せ替えが楽しめる継続モチベーションシステム。
- **カレンダー / 振り返り**: 取り組んだ日と感情の変化（ビフォー / アフター）を可視化。

## 技術スタック

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Lucide React
- **Backend**: Express (Node.js)
- **Database / ORM**: PostgreSQL (Cloud SQL), Drizzle ORM
- **Authentication**: Firebase Authentication (Google OAuth)
- **AI**: Google Gen AI SDK (`@google/genai`)

## セットアップ手順

### 1. リポジトリのクローン & 依存関係のインストール

```bash
git clone <YOUR_REPOSITORY_URL>
cd <REPOSITORY_NAME>
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env` を作成し、Gemini API キーを設定します:

```bash
cp .env.example .env
```

`.env` に以下を入力:

```env
GEMINI_API_KEY="あなたのGemini APIキー"
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

### 4. 本番ビルド

```bash
npm run build
npm start
```

---

## Vercel デプロイ時の設定手順

Vercel で AIリフレーミングや Google ログインを正常に動作させるには、以下の **3点の設定** が必要です。

### 1. Vercel の環境変数（Environment Variables）の設定
Vercel ダッシュボード（プロジェクト → **Settings** → **Environment Variables**）にて、以下を追加してください:
- **`GEMINI_API_KEY`**: あなたの Gemini API キー（Google AI Studio で取得可能）

*(任意: PostgreSQL を利用する場合)*
- `SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, `SQL_DB_NAME`: Supabase / Neon などの接続情報（未設定の場合はブラウザのローカル保存モードで安全に動作します）

### 2. Firebase の「承認済みドメイン（Authorized domains）」の追加（※Googleログインに必須）
Firebase はセキュリティ上、許可されたドメイン以外からの OAuth ポップアップログインを拒否します。
1. [Firebase Console](https://console.firebase.google.com/) を開きます。
2. 対象プロジェクト（`silken-drummer-w53bd`）を選択します。
3. 左メニュー **「Authentication」** → **「Settings（設定）」** タブ → **「Authorized domains（承認済みドメイン）」** をクリック。
4. **「ドメインを追加」** を押し、Vercel で割り当てられたドメイン（例: `your-app.vercel.app`）を登録します。
*(登録後、数分で反映され Google ログインが可能になります)*

### 3. Vercel Serverless 設定 (`vercel.json` & `api/index.ts`)
本リポジトリには Vercel 用に `/api/*` をサーバーレス関数としてルーティングする `vercel.json` および `api/index.ts` が同梱されています。GitHub から Vercel にインポートするだけで自動的にバックエンド API が動作します。
