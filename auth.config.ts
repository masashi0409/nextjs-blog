import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard =
        nextUrl.pathname.startsWith('/dashboard') || // ダッシュボードのパス / Dashboard path
        nextUrl.pathname.startsWith('/admin'); // 管理画面のパスを追加 / Added admin path
      if (isOnDashboard) {
        // ダッシュボードや管理画面へのアクセスはログイン必須 / Login required for dashboard and admin access
        if (isLoggedIn) return true;
        // 未ログインの場合はログインページにリダイレクト / Redirect unauthenticated users to login page
        return Response.redirect(new URL('/login', nextUrl));
      } else if (isLoggedIn && nextUrl.pathname === '/login') {
        // ログイン済みでログインページにアクセスした場合はダッシュボードにリダイレクト
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
