# \_\_negi\_\_ Site

## 技術スタック

- Next.js + React + TypeScript
- Tailwind CSS
- GitHub Pages（GitHub Actionsデプロイ）

## ローカル開発

```bash
npm install
npm run dev
```

品質確認:

```bash
npm run check
```

## コンテンツ追加方法

### SNS / サイトバナー

`src/content/socialLinks.ts` を編集します。

- `name`: サービス名
- `url`: リンク先URL
- `handle`: 表示ラベル（`@...` やドメイン）

> 初期値はプレースホルダURLなので、公開前に実アカウントへ置き換えてください。

### レイアウト共通化（ヘッダー/フッター）

Next.js App Router の `src/app/layout.tsx` で共通ヘッダー/フッターを管理しています。  
ページを追加する場合は `src/app/<route>/page.tsx` を作成してください。`layout.tsx` の内容は自動で共通適用されます。

### ページタイトルとアイコン

- 共通タイトルテンプレートは `src/app/layout.tsx` の `metadata.title` で管理します。
- ルート以外でページ固有タイトルを付ける場合は、サーバーコンポーネントの `src/app/<route>/page.tsx` で `export const metadata` を定義します。
- サイトアイコンは `src/app/favicon.ico` と `src/app/apple-icon.png` を使用します。

### ロボット画像と説明

1. 画像を `public/images/robots/` に配置
2. `src/content/robots.ts` に1件追加

項目:

- `name`, `year`, `role`, `description`
- `imagePath`（例: `/images/robots/my-robot.jpg`）
- `imageAlt`

カードをクリックするとモーダルで拡大表示されます。

## GitHub Pages 公開

`main` ブランチへ push すると、`.github/workflows/deploy-pages.yml` で自動デプロイします。

初回のみ、GitHubリポジトリ設定で以下を有効化してください。

- Settings → Pages → Build and deployment
- Source: **GitHub Actions**

このリポジトリは Next.js の静的出力（`output: 'export'`）で `out/` を公開しています。
