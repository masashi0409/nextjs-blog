import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import SearchBox from '@/components/post/SearchBox';

export default function PublicHeader() {
  return (
    <header className='sticky top-0 z-50 w-full border-b  bg-muted/50 backdrop-blur'>
      <div className='container mx-auto flex items-center justify-between px-4 py-4'>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href='/' className='font-bold text-xl'>
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className='flex items-center gap-4'>
          <SearchBox />
          <Button variant='outline' asChild>
            <Link href='/login'>ログイン</Link>
          </Button>
          <Button variant='default' asChild>
            <Link href='/register'>新規登録</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
