import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import Setting from './Setting';
import { auth } from '@/auth'; // 認証情報

/**
 * 認証されたユーザー向けのヘッダーコンポーネント
 */
export default async function PrivateHeader() {
  const session = await auth(); // サーバーサイドでセッション情報を取得

  if (!session?.user?.email) throw new Error('不正なリクエストです');

  return (
    <header className='border-b bg-blue-200'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href='/dashboard'>管理ページ</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Setting session={session} />
      </div>
    </header>
  );
}
