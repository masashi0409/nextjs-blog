import { writeFile } from 'fs/promises';
import path from 'path';

/**
 * バイナリデータをBufferに変換し、指定パスにファイル(buffer)を書き込みます。
 * 保存したファイルのハッシュを返します。
 * エラーが発生した場合、nullを返します。
 *
 * DBにはURLを保存します。
 * ファイル実体は`public/images`に保存します。
 *
 * @param file - バイナリデータを含むFileオブジェクト
 * @returns 保存したファイルのハッシュ（string）かエラーが発生した場合null
 */
export async function saveImage(file: File): Promise<string | null> {
  // バイナリデータをBufferに変換 ブラウザはArrayBufferで扱っている Node.js側はBuffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // ファイル名を生成
  const fileName = `${Date.now()}-${file.name}`;

  // アップロードフォルダ
  const uploadDir = path.join(process.cwd(), 'public/images');

  try {
    // 保存先の完全なファイル名
    const filePath = path.join(uploadDir, fileName);

    // ファイルを保存（指定パスにファイル(buffer)を書き込む）
    await writeFile(filePath, buffer);

    // 保存したファイルのパスを返す
    return `/images/${fileName}`;
  } catch (error) {
    console.error('Error saving image:', error);
    return null;
  }
}
