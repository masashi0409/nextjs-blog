import { getPost } from '@/lib/post';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ja } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';

type Params = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: Params) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }
  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='max-w-3xl mx-auto'>
        {post.topImage && (
          <div className='relative w-full h-48'>
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
          <p className='text-sm text-gray-600 mb-2'>{post.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
