import { getGitHubUser } from "../clients/github";
import { users } from "../data/user";

export async function getUserBlogImageUrl(
  userName: string,
): Promise<string | null> {
  const user = users.find((user) => user.name === userName);

  if (user?.blog == null) {
    return null;
  }

  switch (true) {
    case user.blog.startsWith("https://velog.io/"):
      return "https://static.velog.io/favicon.ico";
    default:
      return "https://em-content.zobj.net/source/apple/391/link_1f517.png";
  }
}

const cache = new Map<string, string | null>();

export async function getUserProfileImageUrl(
  userName: string,
): Promise<string | null> {
  const user = users.find((user) => user.name === userName);

  if (user == null) {
    return null;
  }

  if (cache.has(userName) && cache.get(userName) != null) {
    return cache.get(userName) ?? null;
  }

  const userAvatarUrl = await (async () => {
    switch (true) {
      case user.github != null:
        return getGitHubProfileImageUrl(user.github);
      default:
        return null;
    }
  })();
  if (userAvatarUrl != null) {
    cache.set(userName, userAvatarUrl);
  }

  return userAvatarUrl;
}

async function getGitHubProfileImageUrl(
  userName: string,
): Promise<string | null> {
  try {
    const response = await getGitHubUser(userName);
    return response.avatar_url;
  } catch (e) {
    console.error(e);
    return null;
  }
}
