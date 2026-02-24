'use server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/validations/user';
import bcryptjs from 'bcryptjs';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';

export type ActionState = {
  success: boolean;
  errors: Record<string, string[]>;
};

/**
 * バリデーションエラー処理
 * zodの仕様でパスワード一致確認のエラーは formErrorsで渡ってくるため
 * formErrorsがある場合は、confirmPasswordフィールドにエラーを追加する
 * @param error
 * @returns
 */
function handleValidationError(error: any): ActionState {
  const { fieldErrors, formErrors } = error.flatten();
  if (formErrors.length > 0) {
    return {
      success: false,
      errors: { ...fieldErrors, confirmPassword: formErrors },
    };
  }
  return { success: false, errors: fieldErrors };
}
// カスタムエラー処理
function handleError(customErrors: Record<string, string[]>): ActionState {
  return { success: false, errors: customErrors };
}

/**
 * ユーザーを作成する / Create a user
 *
 * @param prevState
 * @param formData
 * @returns
 */
export async function createUser(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // フォームから送信されたデータを取得 / Get data submitted from the form
  const rawFormData = Object.fromEntries(
    ['name', 'email', 'password', 'confirmPassword'].map((field) => [
      field,
      formData.get(field) as string,
    ]),
  ) as Record<string, string>;

  // バリデーション / Validation
  const validationResult = registerSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    return handleValidationError(validationResult.error);
  }

  // DBにメールアドレスが存在しているか確認 / Check if the email address exists in the DB
  const existingUser = await prisma.user.findUnique({
    where: { email: rawFormData.email },
  });
  if (existingUser) {
    return handleError({
      email: ['このメールアドレスは既に登録されています。'],
    });
  }

  // パスワードを暗号化 / Encrypt password
  const hashedPassword = await bcryptjs.hash(rawFormData.password, 12);

  // DBにユーザーを登録 / Create user in the DB
  await prisma.user.create({
    data: {
      name: rawFormData.name,
      email: rawFormData.email,
      password: hashedPassword,
    },
  });

  // dashboardへリダイレクト / Redirect to dashboard
  await signIn('credentials', {
    ...Object.fromEntries(formData),
    redirect: false,
  });

  redirect('/dashboard');
}
