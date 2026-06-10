import { getAllPosts, getPostUrl } from '../lib/posts';

export async function GET() {
  const posts = await getAllPosts();
  return new Response(
    JSON.stringify({
      posts: posts.map((post) => ({
        title: post.data.title,
        url: getPostUrl(post),
        date: post.data.date.toISOString(),
        tags: post.data.tags,
        categories: post.data.categories,
        excerpt: post.data.excerpt ?? '',
      })),
    }),
    {
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    },
  );
}
