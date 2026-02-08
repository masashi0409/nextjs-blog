import { getPosts, searchPosts } from '@/lib/post';
import PostCard from '@/components/post/PostCard';
import { Post } from '@/types/post';

type Props = {
  searchParams: {
    search?: string;
  };
};

export default async function PostsPage({ searchParams }: Props) {
  // PrismaのDBから記事を取得する / Fetch posts from the database(Prisma)

  // urlパラメータ取得 / get URL parameters
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.search || '';

  // 検索語があれば検索、なければ全件取得 / if search words exist, search posts, otherwise get all posts
  const posts = searchQuery ? await searchPosts(searchQuery) : await getPosts();

  return (
    <>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}
