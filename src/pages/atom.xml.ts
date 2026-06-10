import rss from '@astrojs/rss';
import { getAllPosts, getPostUrl } from '../lib/posts';
import { SITE } from '../lib/site';

export async function GET(context: { site?: URL }) {
  const posts = await getAllPosts();
  const site = context.site ?? new URL(SITE.url);

  return rss({
    title: SITE.title,
    description: SITE.description,
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt ?? SITE.description,
      pubDate: post.data.date,
      link: getPostUrl(post),
      categories: post.data.tags,
    })),
    customData: `<language>zh-CN</language><managingEditor>${SITE.email} (${SITE.author})</managingEditor>`,
  });
}
