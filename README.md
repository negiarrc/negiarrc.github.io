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

### 固定ページ（`content/pages/**/*.mdx`）

固定ページは `content/pages` 配下の MDX から自動生成されます。  
ルーティングは `src/app/[[...slug]]/page.tsx` が担当します。

#### URLマッピング規則（フォルダ構造 → URL）

- `content/pages/index.mdx` → `/`
- `content/pages/<dir>/index.mdx` → `/<dir>`
- `content/pages/<dir>/<file>.mdx` → `/<dir>/<file>`
- 例: `content/pages/company/team.mdx` → `/company/team`

#### 固定ページ frontmatter

必須:

- `title`（string）

任意:

- `description`（string）
- `navLabel`（string）
- `showInHeader`（boolean）
- `navOrder`（number）

```mdx
---
title: "記事"
description: "開発ログとロボコン記録の記事一覧。"
navLabel: "記事"
showInHeader: true
navOrder: 2
---
```

#### ヘッダーナビゲーションの挙動

`src/app/layout.tsx` は `listHeaderNavigationPages()` の結果でヘッダーを構築します。

- `showInHeader: true` のページだけ表示
- ラベルは `navLabel` があれば優先（未指定時は `title`）
- 並び順は `navOrder` 昇順、同値/未指定時は `pathname` → `title` 順

#### 固定ページの追加手順（ヘッダー表示まで）

1. `content/pages` 配下に `.mdx` を追加（URLは上記規則で決定）
2. frontmatter に `title` を設定
3. ヘッダーに出す場合は `showInHeader: true` を設定
4. 必要に応じて `navLabel`, `navOrder` で表示名/順序を調整

#### 固定ページMDXで使える一覧ブロック（import不要）

`src/mdx-components.tsx` に登録済みのため、`content/pages/**/*.mdx` でそのまま使えます。

- `ArticleListBlock`：記事一覧の汎用ブロック（新規利用はこれを推奨）
  - `category?: string`（省略時は全記事）
  - `variant?: "card" | "text"`（省略時は `"card"`）
  - `emptyMessage?: string`
- `SocialBannerBlock`：`src/content/socialLinks.ts` のSNSバナー一覧

```mdx
{/* roboconカテゴリの記事一覧（カード表示） */}
<ArticleListBlock category="robocon" />

{/* 全記事一覧（category省略 + テキスト表示） */}
<ArticleListBlock variant="text" emptyMessage="公開されている記事はまだありません。" />
```

`RoboconArticleCardsBlock` と `AllArticlesTextListBlock` は互換性維持のためのラッパーです。新しいMDXでは `ArticleListBlock` を優先してください。

### SNS / サイトバナー

`src/content/socialLinks.ts` を編集します。

- `name`: サービス名
- `url`: リンク先URL
- `handle`: 表示ラベル（`@...` やドメイン）
- `showInBanner`: `true` でバナー表示対象（メインのSNSバナーとフッターの`|`区切りリンクに共通適用）

> 初期値はプレースホルダURLなので、公開前に実アカウントへ置き換えてください。

### 記事（Markdown / MDX）管理

記事は `content/articles/<category>/<slug>.mdx` に置きます。  
記事詳細URLは **`/articles/<category>/<slug>`** です（`src/app/articles/[category]/[slug]/page.tsx`）。  
カテゴリ別記事一覧URLは **`/categories/<category>`** です（`src/app/categories/[category]/page.tsx`）。
`src/app/categories/[category]/page.tsx` の `generateStaticParams()` は、記事 frontmatter の `category` 値（`listAllArticlesMetadata()` で取得）をユニーク化して、既存カテゴリ分のみ `/categories/<category>` を静的生成します（存在しないカテゴリは 404）。

記事データの読み込みは `src/lib/articles/loader.ts` で行い、以下を使い分けます。

- `listAllArticlesMetadata()`：全記事一覧
- `listArticlesMetadataByCategory(category)`：カテゴリ絞り込み一覧

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

### ページタイトルとアイコン

- 共通タイトルテンプレートは `src/app/layout.tsx` の `metadata.title` で管理します。
- 固定ページのタイトル/descriptionは `content/pages/**/*.mdx` の frontmatter（`title`, `description`）で設定します。
- 記事詳細ページのタイトル/descriptionは記事 frontmatter から生成されます。
- サイトアイコンは `src/app/favicon.ico` と `src/app/apple-icon.png` を使用します。

## GitHub Pages 公開

`main` ブランチへ push すると、`.github/workflows/deploy-pages.yml` で自動デプロイします。

初回のみ、GitHubリポジトリ設定で以下を有効化してください。

- Settings → Pages → Build and deployment
- Source: **GitHub Actions**

このリポジトリは Next.js の静的出力（`output: 'export'`）で `out/` を公開しています。
