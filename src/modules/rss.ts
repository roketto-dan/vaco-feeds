import Parser from "rss-parser";

export async function getRssFeed(url: string) {
  const parser = new Parser();
  return parser.parseURL(url);
}
