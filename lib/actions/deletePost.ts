'use server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export type ActionState = {
  success: boolean;
  errors: Record<string, string[]>;
};

/**
 * 記事を削除する / Delete a post
 */
export async function deletePost(postId: string): Promise<ActionState> {
  await prisma.post.delete({ where: { id: postId } });
  redirect('/dashboard');
}
