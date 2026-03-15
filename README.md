# \_\_negi\_\_ Site
[Site](https://negiarrc.github.io)

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
- `showInBanner`: `true` でバナー表示対象（メインのSNSバナーとフッターの`|`区切りリンクに共通適用）

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

### 記事（Markdown / MDX）管理

記事は `content/articles/<category>/<slug>.mdx` に置きます。  
**記事の追加・更新は MDX ファイル編集だけで完結**し、コンポーネント側の追記は不要です。

#### フォルダ/ファイル規約

1. `content/articles/` 直下にカテゴリディレクトリを作成（例: `robocon`, `devlog`）
2. 各記事は `<slug>.mdx` で作成
3. frontmatter の `category` はフォルダ名と一致させる
4. frontmatter の `slug` はファイル名（拡張子なし）と一致させる

#### 必須 frontmatter

```mdx
---
title: "記事タイトル"
thumbnail: "/images/robots/2024-nhk.jpg"
publishedAt: "2025-01-01"
excerpt: "記事の概要"
category: "devlog"
slug: "my-article-slug"
---
```

- `title`, `thumbnail`, `publishedAt`, `excerpt`, `category`, `slug` は必須です。
- `publishedAt` は日付として解釈可能な文字列を指定してください。

## GitHub Pages 公開

`main` ブランチへ push すると、`.github/workflows/deploy-pages.yml` で自動デプロイします。

初回のみ、GitHubリポジトリ設定で以下を有効化してください。

- Settings → Pages → Build and deployment
- Source: **GitHub Actions**

このリポジトリは Next.js の静的出力（`output: 'export'`）で `out/` を公開しています。
