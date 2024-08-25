import Parser from "rss-parser";
import { format } from "date-fns";
import { users } from "../data/user";

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
    .sort((a, b) => {
      if (a.pubDate === undefined) return 1;
      if (b.pubDate === undefined) return -1;

      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    })
    .map((item) => ({
      ...item,
      title: item.title ?? "unknown",
      link: item.link ?? "",
      date: item.pubDate ? format(item.pubDate, "yyyy.MM.dd.") : "unknown",
    }));

  return posts;
}
