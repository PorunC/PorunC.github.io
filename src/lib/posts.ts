import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export async function getAllPosts() {
  const posts = await getCollection('blog');
  return posts.sort(sortPostsByDate);
}

export function sortPostsByDate(a: BlogPost, b: BlogPost) {
  return b.data.date.getTime() - a.data.date.getTime();
}

export function getPostUrl(post: BlogPost) {
  return `/${post.data.slug}/`;
}

export function formatDate(date: Date) {
  return dateFormatter.format(date).replaceAll('/', '-');
}

export function termSlug(term: string) {
  return term.trim().replaceAll('.', '-').replace(/\s+/g, '-');
}

export function getTagUrl(tag: string) {
  return `/tags/${termSlug(tag)}/`;
}

export function getCategoryUrl(category: string) {
  return `/categories/${termSlug(category)}/`;
}

export function getArchiveParts(post: BlogPost) {
  const [year, month, day] = post.data.slug.split('/');
  return { year, month, day };
}

export function getTermCounts(posts: BlogPost[], field: 'tags' | 'categories') {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const term of post.data[field]) {
      counts.set(term, (counts.get(term) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], 'zh-CN'));
}

export function groupPostsByYear(posts: BlogPost[]) {
  const groups = new Map<string, BlogPost[]>();
  for (const post of posts) {
    const { year } = getArchiveParts(post);
    const group = groups.get(year) ?? [];
    group.push(post);
    groups.set(year, group);
  }
  return [...groups.entries()].sort((a, b) => Number(b[0]) - Number(a[0]));
}

export function groupPostsByMonth(posts: BlogPost[]) {
  const groups = new Map<string, BlogPost[]>();
  for (const post of posts) {
    const { year, month } = getArchiveParts(post);
    const key = `${year}-${month}`;
    const group = groups.get(key) ?? [];
    group.push(post);
    groups.set(key, group);
  }
  return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}
