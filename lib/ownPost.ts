import { prisma } from '@/lib/prisma';

/**
 * ログインしているユーザーの記事一覧を取得
 */
export async function getOwnPosts(userId: string) {
  return await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    select: {
      id: true,
      title: true,
      published: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * 特定の記事を取得
 *
 * @param id 記事ID
 * @returns
 */
export async function getOwnPost(userId: string, postId: string) {
  return await prisma.post.findFirst({
    where: {
      AND: [{ authorId: userId }, { id: postId }],
    },
    select: {
      id: true,
      title: true,
      content: true,
      topImage: true,
      author: true,
      published: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
