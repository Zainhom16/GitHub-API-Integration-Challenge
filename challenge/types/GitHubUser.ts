export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  company: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  html_url: string;
  linkedin?: string;
}
