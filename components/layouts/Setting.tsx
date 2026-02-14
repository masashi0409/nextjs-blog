import { signOut } from '@/auth'; // ログアウト処理
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Session } from 'next-auth'; // Session 型をインポート

/**
 * 設定ドロップダウンメニューコンポーネント
 *
 * @param session - ユーザーのセッション情報
 */
export default function Setting({ session }: { session: Session }) {
  const handleLogout = async () => {
    'use server';
    await signOut(); // CSRF対応済み
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>{session.user?.name}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
