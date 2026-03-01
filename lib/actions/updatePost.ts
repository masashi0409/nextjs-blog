'use server';
import { prisma } from '@/lib/prisma';
import { postSchema } from '@/validations/post';
import { saveImage } from '@/utils/image';
import { redirect } from 'next/navigation';

export type ActionState = {
  success: boolean;
  errors: Record<string, string[]>;
};

/**
 * 投稿更新 / Update a post
 *
 * @param prevState
 * @param formData
 * @returns
 */
export async function updatePost(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // フォームの情報を取得
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  // 画像はファイルか、アップされていないか判定
  const topImageINput = formData.get('topImage');
  const topImage = topImageINput instanceof File ? topImageINput : null;
  const postId = formData.get('postId') as string;
  const published = formData.get('published') === 'true';
  const oldImageUrl = formData.get('oldImageUrl') as string;

  // バリデーション
  const validationResult = postSchema.safeParse({ title, content, topImage });
  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  // 新しい画像がアップされていた時は、新しい画像を保存し、新しい画像パスを取得
  let imageUrl = oldImageUrl;
  if (
    topImage instanceof File &&
    topImage.size > 0 &&
    topImage.name !== 'undefined'
  ) {
    const newImageUrl = await saveImage(topImage);
    if (!newImageUrl) {
      return {
        success: false,
        errors: { topImage: ['画像の保存に失敗しました。'] },
      };
    }
    imageUrl = newImageUrl;
  }

  // DB更新
  await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      content,
      published,
      topImage: imageUrl,
    },
  });

  redirect('/dashboard');
}
