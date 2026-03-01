'use client';
import { useState, useActionState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import TextareaAutosize from 'react-textarea-autosize';
import 'highlight.js/styles/github.css'; // コードハイライト用のスタイル
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updatePost } from '@/lib/actions/updatePost';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type EditPostFormProps = {
  post: {
    id: string;
    title: string;
    content: string;
    topImage?: string | null;
    published: boolean;
  };
};

export default function EditPostForm({ post }: EditPostFormProps) {
  const [content, setContent] = useState(post.content); // 記事の文章
  const [contentLength, setContentLength] = useState(0); // 文字数
  const [preview, setPreview] = useState(false); // プレビュー
  // タイトル、表示非表示、画像のプレビューもuseStateで変更できるように
  const [title, setTitle] = useState(post.title);
  const [published, setPublished] = useState(post.published);
  const [imagePreview, setImagePreview] = useState(post.topImage);

  const [state, formAction] = useActionState(updatePost, {
    success: false,
    errors: {},
  });

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    setContentLength(value.length);
  };

  // 画像のプレビュー
  // 画像はファイルか、アップされていないか判定
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // プレビュー用URL生成 ブラウザのメモリに保存される
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // input type="file" にはDB内の画像urlを設定できない
  // -> そのまま更新すると画像urlが消える可能性
  // 対策:
  // DB内の画像urlをinput type="hidden"で持たせる
  // 画像が変更されたら新しい画像を保存する
  // プレビューを表示し現在の画像を表示する

  // プレビューURLはブラウザのメモリに保存される
  // コンポーネントが破棄されるかimagePreview変更時に プレビューURLを解放
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview !== post.topImage) {
        // プレビューURL解放
        URL.revokeObjectURL(imagePreview); // プレビューurlはブラウザのメモリに保存される
      }
    };
  }, [imagePreview, post.topImage]);

  return (
    <div className='container mx-auto mt-10'>
      <h1 className='text-2xl font-bold mb-4'>新規記事投稿</h1>
      <form action={formAction} className='space-y-4'>
        <div>
          <Label htmlFor='title'>タイトル</Label>
          <Input
            id='title'
            type='text'
            name='title'
            placeholder='タイトルを入力してください'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {state.errors.title && (
            <p className='text-red-500 text-sm mt-1'>
              {state.errors.title?.join(', ')}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor='topImage'>トップ画像</Label>
          <Input
            type='file'
            id='topImage'
            accept='image/*'
            name='topImage'
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div>
              <Image
                src={imagePreview}
                alt={post.title}
                width={0}
                height={0}
                sizes='200px'
                className='w-[200px]'
              />
            </div>
          )}
          {state.errors.topImage && (
            <p className='text-red-500 text-sm mt-1'>
              {state.errors.topImage?.join(', ')}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor='content'>記事本文</Label>
          <TextareaAutosize
            id='content'
            name='content'
            className='w-full border p-2'
            placeholder='記事本文を入力してください'
            minRows={8}
            value={content}
            onChange={handleContentChange}
          />
          {state.errors.content && (
            <p className='text-red-500 text-sm mt-1'>
              {state.errors.content?.join(', ')}
            </p>
          )}
        </div>
        <div className='text-right text-sm text-gray-500 mt-1'>
          文字数：{contentLength}
        </div>
        <div>
          <Button type='button' onClick={() => setPreview(!preview)}>
            {preview ? 'プレビューを閉じる' : 'プレビューを表示'}
          </Button>
        </div>
        {preview && (
          <div className='border p-4 bg-gray-50 prose max-w-none'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              skipHtml={false} // HTMLスキップを無効化
              unwrapDisallowed={true} // Markdownの改行を解釈
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
        <RadioGroup
          value={published.toString()}
          name='published'
          onValueChange={(value) => setPublished(value === 'true')}
        >
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='true' id='published-one' />
            <Label htmlFor='published-one'>公開</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='false' id='published-two' />
            <Label htmlFor='published-two'>非公開</Label>
          </div>
        </RadioGroup>
        <div>
          <Button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded'
          >
            更新する
          </Button>
        </div>
        {/* 更新に必要なパラメータをhiddenで渡す */}
        {/* 記事ID */}
        <input type='hidden' name='postId' value={post.id} />
        {/* DB内画像url */}
        <input type='hidden' name='oldImageUrl' value={post.topImage || ''} />
      </form>
    </div>
  );
}
