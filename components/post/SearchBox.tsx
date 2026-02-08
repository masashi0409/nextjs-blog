'use client';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * SearchBox component for searching posts.
 * 検索ボックスコンポーネント
 */
export default function SearchBox() {
  const [search, setSearch] = useState('');
  // デバウンス（特定の操作が連続して発生した場合に、その操作の実行を遅延させる）/ debounce is used to limit the rate of search input processing
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const router = useRouter();

  // デバウンス
  useEffect(() => {
    //
    // 0.5秒待ってから検索語を更新 / update debouncedSearch after 0.5 seconds
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // debouncedSearchが更新されたら
  useEffect(() => {
    if (debouncedSearch.trim()) {
      // 検索語が空でなければ、クエリパラメータとして設定 / if not empty, set as query parameter
      router.push(`/?search=${encodeURIComponent(debouncedSearch.trim())}`);
    } else {
      // 空ならクエリパラメータを削除 / if empty, remove query parameter
      router.push(`/`);
    }
  }, [debouncedSearch, router]);

  return (
    <>
      <Input
        placeholder='記事を検索...'
        className='w-[200px] lg:w-[300px]'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </>
  );
}
