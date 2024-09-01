import Parser from "rss-parser";
import { format } from "date-fns";
import { users } from "../data/user";
import { notionPosts } from "../data/notionPost";

const parser = new Parser();

type Post = {
  title: string;
  link: string;
  date: string;
  channel: {
    title: string;
    link: string;
    description: string;
  };
};

export async function getPosts(): Promise<Post[]> {
  const rssFeedPosts = await fetchRssFeedPosts();
  const notionPosts = getNotionPosts();
  const posts = [
    ...rssFeedPosts,
    ...notionPosts,
  ];

  return posts.sort((a, b) => {
    if (a.date === undefined) return 1;
    if (b.date === undefined) return -1;

    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

function getNotionPosts(): Post[] {
  return notionPosts.map((post) => {
    const user = users.find((user) => user.name === post.user);

    return {
      title: post.title,
      link: post.link,
      date: post.date,
      channel: {
        title: user?.name ?? post.user,
        link: user?.feedUrl ?? "unknown",
        description: `${post.user} Notion`,
      },
    };
  });
}

export async function fetchRssFeedPosts(): Promise<Post[]> {
  const feedUrls = users.map((user) => user.feedUrl);

  const itemsSettledResult = await Promise.allSettled(
    feedUrls.map(async (feedUrl) => {
      const parsed = await parser.parseURL(feedUrl);

      return parsed.items.map((item) => ({
        ...item,
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
    }));

  return posts;
}
