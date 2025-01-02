import { format } from "date-fns";
import { users, type User } from "../data/user";
import { notionPosts } from "../data/notionPost";
import { isDateRecent } from "../utils/isDateRecent";
import { getRssFeed } from "./rss";
import slugify from "slugify";

export type Post = {
  id: string;
  user: string;
  title: string;
  link: string;
  date: string;
  isRecentPost: boolean;
};

export function generatePostId(post: { title: string }): string {
  return slugify(post.title, {
    remove: /[*+~.,()\[\]'"!?:@]/g,
    lower: true,
  }).replace(/\//g, "-");
}

const sortByRecentDate = (a: Post, b: Post): number => {
  if (a.date === undefined) return 1;
  if (b.date === undefined) return -1;

  return new Date(b.date).getTime() - new Date(a.date).getTime();
};
async function getPosts(): Promise<Post[]> {
  const rssFeedPosts = await getRssFeedPosts();
  const notionPosts = getNotionPosts();
  const posts = [...rssFeedPosts, ...notionPosts].map((post) => ({
    ...post,
    link: decodeURIComponent(post.link),
  }));

  const resentUserPosts = users
    .filter(
      (user) =>
        user.joinDate != null && isDateRecent({ date: user.joinDate, days: 7 }),
    )
    .sort((a, b) => {
      if (a.joinDate === undefined) return 1;
      if (b.joinDate === undefined) return -1;

      return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
    })
    .flatMap((user) =>
      posts
        .sort(sortByRecentDate)
        .filter((post) => post.user === user.name)
        .slice(0, 3),
    )
    .sort(sortByRecentDate);

  const resentUserPostSet = new Set(resentUserPosts);

  const recentPosts = posts
    .filter((post) => !resentUserPostSet.has(post))
    .sort(sortByRecentDate);

  return [...resentUserPosts, ...recentPosts];
}

function getNotionPosts(): Post[] {
  const posts = notionPosts
    .map<Post | null>((post) => {
      const user = users.find((user) => user.name === post.user);

      if (user == null) {
        return null;
      }

      return {
        user: user.name,
        id: generatePostId(post),
        title: post.title,
        link: decodeURIComponent(post.link),
        date: post.date,
        isRecentPost: post.date
          ? isDateRecent({ date: post.date, days: 7 })
          : false,
      };
    })
    .filter((post): post is Post => post !== null);

  return posts;
}

async function getRssFeedPosts(): Promise<Post[]> {
  const posts = (await Promise.allSettled(users.map(getPostsFromRssFeed)))
    .filter((result) => result.status === "fulfilled")
    .flatMap(({ value }) => value);

  return posts;
}

async function getPostsFromRssFeed(user: User): Promise<Post[]> {
  const feed = await getRssFeed(user.feedUrl);
  const posts = feed.items.map<Promise<Post>>(async (item) => {
    return {
      user: user.name,
      id: generatePostId({ title: item.title ?? "" }),
      title: item.title ?? "",
      link: item.link ?? "",
      date: item.pubDate ? format(item.pubDate, "yyyy.MM.dd.") : "",
      isRecentPost: item.pubDate
        ? isDateRecent({ date: item.pubDate, days: 7 })
        : false,
    };
  });

  return Promise.all(posts);
}

export const posts = await getPosts();
