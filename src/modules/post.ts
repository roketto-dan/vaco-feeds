import Parser from "rss-parser";
import { format } from "date-fns";
import { users } from "../data/user";
import { notionPosts } from "../data/notionPost";
import { isDateRecent } from "../utils/isDateRecent";

const parser = new Parser();

type Post = {
  user: string;
  title: string;
  link: string;
  date: string;
  isRecentPost: boolean;
  channel: {
    title: string;
    link: string;
    description: string;
  };
};

export async function getPosts(): Promise<Post[]> {
  const rssFeedPosts = await fetchRssFeedPosts();
  const notionPosts = getNotionPosts();
  const posts = [...rssFeedPosts, ...notionPosts].map((post) => ({
    ...post,
    link: decodeURIComponent(post.link),
  }));

  return posts.sort((a, b) => {
    if (a.date === undefined) return 1;
    if (b.date === undefined) return -1;

    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

function getNotionPosts(): Post[] {
  return notionPosts.flatMap((post) => {
    const user = users.find((user) => user.name === post.user);

    if (user == null) {
      return [];
    }

    return {
      user: user.name,
      title: post.title,
      link: post.link,
      date: post.date,
      isRecentPost: post.date ? isDateRecent({ date: post.date, days: 7 }) : false,
      channel: {
        title: user.name,
        link: user.feedUrl,
        description: `${post.user} Notion`,
      },
    };
  });
}

export async function fetchRssFeedPosts(): Promise<Post[]> {
  const itemsSettledResult = await Promise.allSettled(
    users.map(async (user) => {
      const parsed = await parser.parseURL(user.feedUrl);

      return parsed.items.map((item) => ({
        ...item,
        user: user.name,
        channel: {
          title: parsed.title ?? "unknown",
          link: parsed.link ?? "unknown",
          description: parsed.description ?? "unknown",
        },
      }));
    })
  );

  const posts = itemsSettledResult
    .map((result) => {
      if (result.status === "rejected") {
        console.error(result.reason);
        return [];
      }

      return result.value;
    })
    .flat()
    .map((item) => ({
      ...item,
      title: item.title ?? "unknown",
      link: item.link ?? "",
      date: item.pubDate ? format(item.pubDate, "yyyy.MM.dd.") : "unknown",
      isRecentPost: item.pubDate ? isDateRecent({ date: item.pubDate, days: 7 }) : false,
    }));

  return posts;
}
