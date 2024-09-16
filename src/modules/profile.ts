import { getGitHubUser } from "../clients/github";
import { users } from "../data/user";

export async function getUserBlogImageUrl(
  userName: string
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

export async function getUserProfileImageUrl(
  userName: string
): Promise<string | null> {
  const user = users.find((user) => user.name === userName);

  if (user == null) {
    return null;
  }

  switch (true) {
    case user.github != null:
      return getGitHubProfileImageUrl(user.github);
    default:
      return null;
  }
}

async function getGitHubProfileImageUrl(
  userName: string
): Promise<string | null> {
  try {
    const response = await getGitHubUser(userName);
    return response.avatar_url;
  } catch(e) {
    console.error(e);
    return null;
  }
}
