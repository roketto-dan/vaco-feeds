import { format } from "date-fns";
import { users, type User } from "../data/user";
import { notionPosts } from "../data/notionPost";
import { isDateRecent } from "../utils/isDateRecent";
import { getRssFeed } from "./rss";

type Post = {
  user: string;
  title: string;
  link: string;
  date: string;
  isRecentPost: boolean;
};

export async function getPosts(): Promise<Post[]> {
  const rssFeedPosts = await getRssFeedPosts();
  const notionPosts = await getNotionPosts();
  const posts = [...rssFeedPosts, ...notionPosts].map((post) => ({
    ...post,
    link: decodeURIComponent(post.link),
  }));

  return posts
    .reduce<[Post[], Post[]]>(
      (acc, post) => {
        const user = users.find((user) => user.name === post.user);

        if (user == null) {
          return acc;
        }

        return user.joinDate != null &&
          isDateRecent({ date: user.joinDate, days: 7 })
          ? [[...acc[0], post], acc[1]]
          : [acc[0], [...acc[1], post]];
      },
      [[], []],
    )
    .flatMap((posts) =>
      posts.sort((a, b) => {
        if (a.date === undefined) return 1;
        if (b.date === undefined) return -1;

        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }),
    );
}

async function getNotionPosts(): Promise<Post[]> {
  const postPromises = notionPosts
    .map<Promise<Post | null>>(async (post) => {
      const user = users.find((user) => user.name === post.user);

      if (user == null) {
        return null;
      }

      return {
        user: user.name,
        title: post.title,
        link: decodeURIComponent(post.link),
        date: post.date,
        isRecentPost: post.date
          ? isDateRecent({ date: post.date, days: 7 })
          : false,
      };
    })
    .filter((post): post is Promise<Post> => post !== null);

  const posts = (await Promise.allSettled(postPromises))
    .filter((result) => result.status === "fulfilled")
    .map(({ value }) => value);

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
