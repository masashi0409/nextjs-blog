import { prisma } from '@/lib/prisma';

/**
 * 記事一覧を取得する
 *
 * @returns
 */
export async function getPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * 特定の記事を取得する
 *
 * @param id 記事ID
 * @returns
 */
export async function getPost(id: string) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
}

/**
 *  記事をキーワードで検索する
 *
 * @param search 検索キーワード
 * @returns
 */
export async function searchPosts(search: string) {
  const decodedSearch = decodeURIComponent(search);
  const normalizedSearch = decodedSearch.replace(/[\s　]+/g, ' ').trim(); // 全角スペースを半角スペースに変換
  const searchWords = normalizedSearch.split(' ').filter(Boolean); // 検索キーワードを分割

  const filters = searchWords.map((word) => ({
    OR: [{ title: { contains: word } }, { content: { contains: word } }],
  }));

  return await prisma.post.findMany({
    where: {
      published: true,
      AND: filters,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
