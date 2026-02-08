export type Post = {
  id: string;
  title: string;
  content: string;
  topImage: string | null;
  createdAt: Date;
  author: {
    name: string | null;
  };
};

export type PostCardProps = { post: Post };
