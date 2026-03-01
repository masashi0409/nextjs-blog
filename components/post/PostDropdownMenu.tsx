'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import DeletePostDialog from '@/components/post/DeletePostDialog';

export default function PostDropdownMenu({ postId }: { postId: string }) {
  const [isOpen, setIsOpen] = useState(false); // ドロップダウンメニューの開閉
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // 削除確認ダイアログの開閉

  // ドロップダウンメニューの開閉
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  // 削除確認ダイアログの開閉
  const handleDeleteDialogChange = (open: boolean) => {
    setShowDeleteDialog(open);
    if (!open) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger className='px-2 py-1 border rounded-md'>
          ⋯
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href={`/manage/posts/${postId}`} className='cursor-pointer'>
              詳細
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/manage/posts/${postId}/edit/`}
              className='cursor-pointer'
            >
              編集
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='text-red-600 cursor-pointer'
            onSelect={() => {
              setIsOpen(false);
              setShowDeleteDialog(true);
            }}
          >
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showDeleteDialog && (
        <DeletePostDialog
          postId={postId}
          isOpen={showDeleteDialog}
          onOpenChange={handleDeleteDialogChange}
        />
      )}
    </>
  );
}
