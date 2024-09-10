import request from "./request";

type GitHubGetUserResponse = {
  id: string;
  login: string;
  name: string;
  type: string;
  avatar_url: string;
  html_url: string;
  node_id: string;
  url: string;
  email: string;
  company: string | null;
  created_at: string;
  updated_at: string;
}

export async function getGitHubUser(userName: string) {
  const clientId = import.meta.env.PUBLIC_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.PUBLIC_GITHUB_SECRET_ID;

  return request<GitHubGetUserResponse>(`https://api.github.com/users/${userName}?client_id=${clientId}&client_secret=${clientSecret}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}
