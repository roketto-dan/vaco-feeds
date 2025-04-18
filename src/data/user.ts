import { getUserProfileImageUrl } from "../modules/profile";

import { getUserBlogImageUrl } from "../modules/profile";

export type User = {
  name: string;
  feedUrl: string;
  blog?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  slack?: string;
  joinDate?: string;
  avatarUrl: string | null;
  blogAvatarUrl: string | null;
};

export const userData = [
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
    joinDate: "2024-10-03",
  },
  {
    name: "정주형",
    blog: "https://medium.com/@juhyoung.jung1992",
    feedUrl: "https://medium.com/@juhyoung.jung1992/feed",
    github: "patissier-boulanger",
    joinDate: "2024-10-09",
  },
  {
    name: "홍유진",
    blog: "https://medium.com/@howyoujini",
    feedUrl: "https://medium.com/@howyoujini/feed",
    github: "howyoujini",
    joinDate: "2024-10-28",
  },
  {
    name: "송규경",
    blog: "https://www.ssongq.com",
    feedUrl: "https://www.ssongq.com/rss.xml",
    github: "SsongQ-92",
    joinDate: "2024-11-26",
  },
  {
    name: "이양래",
    blog: "https://devrey.blog/",
    feedUrl: "https://devrey.blog/rss.xml",
    github: "whoisrey",
    joinDate: "2024-12-03",
  },
  {
    name: "이주연",
    blog: "https://www.coco-study.site/",
    feedUrl: "https://www.coco-study.site/rss.xml",
    github: "coco8j",
    joinDate: "2024-12-07",
  },
  {
    name: "김소연",
    blog: "https://medium.com/@hong7ya",
    feedUrl: "https://medium.com/@hong7ya/feed",
    github: "hong7ya",
    joinDate: "2025-04-15",
  },
];

export const users: User[] = await Promise.all(
  userData.map(async (user) => ({
    ...user,
    avatarUrl: await getUserProfileImageUrl(user.name),
    blogAvatarUrl: await getUserBlogImageUrl(user.name),
  })),
);
