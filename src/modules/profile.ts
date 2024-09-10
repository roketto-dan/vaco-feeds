import { getGitHubUser } from "../clients/github";
import { users } from "../data/user";

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
  } catch {
    return null;
  }
}
