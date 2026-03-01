import { getOwnPost } from '@/lib/ownPost';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ja } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';
import { auth } from '@/auth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

type Params = {
  params: Promise<{ id: string }>;
};

export default async function ShowPage({ params }: Params) {
  // sessionからユーザーidを取得 / Get user id from session
  const session = await auth();
  const userId = session?.user?.id;
  if (!session?.user?.email || !userId) {
    throw new Error('不正なリクエストです');
  }
  // 記事IDを取得
  const { id } = await params;
  // 特定の記事を取得
  const post = await getOwnPost(userId, id);

  if (!post) {
    notFound();
  }
  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='max-w-3xl mx-auto'>
        {post.topImage && (
          <div className='relative w-full h-100'>
            <Image src={post.topImage} alt={post.title} fill sizes='100vw' />
          </div>
        )}
        <CardHeader>
          <div className='flex justify-between items-center mb-4'>
            <p className='text-sm text-gray-500'>投稿者：{post.author.name}</p>
            <time className='text-sm text-gray-500'>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: ja,
              })}
            </time>
          </div>
          <CardTitle className='line-clamp-2'>{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='border p-4 bg-gray-50 prose max-w-none'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              skipHtml={false}
              unwrapDisallowed={true}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
