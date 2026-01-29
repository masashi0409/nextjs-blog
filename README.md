## Next.js Blog

Next.jsで開発したブログアプリ  
prisma6 と sqlite を使用しています。

This is a Next.js project
bootstrapped with create-next-app

## 技術スタック

- **Framework:** Next.js 16 (App Router)
- **Database:** SQLite
- **ORM:** Prisma 6

## Getting Started

### 依存関係インストール

```
npm install
```

### Prisma設定

環境変数の設定 .env.exampleを .env にコピーし、DATABASE_URL を設定します。

```
DATABASE_URL="file:./dev.db"
```

データベース作成

```
npx prisma migrate dev
```

クライアント作成

```bash
npx prisma generate
```

初期データの投入

```bash
npx prisma db seed
```

### 開発サーバ起動

run the development server:

```bash
npm run dev
```

Open localhost:3000 with your browser to see the result.
