export type User = {
  name: string;
  feedUrl: string;
  blog?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  slack?: string;
};

export const users: User[] = [
  {
    name: "공재혁",
    blog: "https://www.jaaack.dev",
    feedUrl: "https://www.jaaack.dev/rss.xml",
    github: "0jaaack",
  },
  {
    name: "김유진",
    blog: "https://velog.io/@yukimiau",
    feedUrl: "https://v2.velog.io/rss/@yukimiau",
    github: "Youjin-cmd",
  },
  {
    name: "장명재",
    blog: "https://odd.voyage",
    feedUrl: "https://odd.voyage/rss.xml",
    github: "oddmj",
  },
  {
    name: "이영교",
    blog: "https://medium.com/@younggyo.lee.",
    feedUrl: "https://medium.com/feed/@younggyo.lee.",
    github: "younggyolee",
  },
];
