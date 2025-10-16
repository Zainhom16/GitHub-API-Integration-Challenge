"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitHubUser } from "../../types/GitHubUser";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  Star,
  GitFork,
  TrendingUp,
  Calendar,
} from "lucide-react";
import Loading from "./loading";
import ErrorCard from "./error";
import { calculateAccountAge } from "@/lib/calcAccAge";

interface Repository {
  stargazers_count: number;
  forks_count: number;
}

interface ComparisonData {
  user: GitHubUser;
  totalStars: number;
  totalForks: number;
  avgStarsPerRepo: number;
}

interface ComparisonResultsProps {
  username1: string;
  username2: string;
}

export default function ComparisonResults({
  username1,
  username2,
}: ComparisonResultsProps) {
  const [data1, setData1] = useState<ComparisonData | null>(null);
  const [data2, setData2] = useState<ComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async (username: string): Promise<ComparisonData> => {
      const userResponse = await fetch(
        `https://api.github.com/users/${username}`
      );
      if (!userResponse.ok) throw new Error(`Failed to fetch ${username}`);
      const user = await userResponse.json();

      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100`
      );
      if (!reposResponse.ok)
        throw new Error(`Failed to fetch ${username}'s repos`);
      const repos: Repository[] = await reposResponse.json();

      const totalStars = repos.reduce(
        (sum, repo) => sum + repo.stargazers_count,
        0
      );
      const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
      const avgStarsPerRepo =
        repos.length > 0 ? Math.round(totalStars / repos.length) : 0;

      return { user, totalStars, totalForks, avgStarsPerRepo };
    };

    const fetchBothUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [result1, result2] = await Promise.all([
          fetchUserData(username1),
          fetchUserData(username2),
        ]);
        setData1(result1);
        setData2(result2);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBothUsers();
  }, [username1, username2]);

  if (isLoading) {
    <Loading />;
  }

  if (error) {
    <ErrorCard message={error} />;
  }

  if (!data1 || !data2) return null;

  const metrics = [
    {
      label: "Followers",
      icon: Users,
      value1: data1.user.followers,
      value2: data2.user.followers,
    },
    {
      label: "Following",
      icon: Users,
      value1: data1.user.following,
      value2: data2.user.following,
    },
    {
      label: "Public Repos",
      icon: BookOpen,
      value1: data1.user.public_repos,
      value2: data2.user.public_repos,
    },
    {
      label: "Total Stars",
      icon: Star,
      value1: data1.totalStars,
      value2: data2.totalStars,
    },
    {
      label: "Total Forks",
      icon: GitFork,
      value1: data1.totalForks,
      value2: data2.totalForks,
    },
    {
      label: "Avg Stars/Repo",
      icon: TrendingUp,
      value1: data1.avgStarsPerRepo,
      value2: data2.avgStarsPerRepo,
    },
  ];

  const accountAge1 = calculateAccountAge(data1.user.created_at);
  const accountAge2 = calculateAccountAge(data2.user.created_at);

  return (
    <div className="space-y-6">
      {/* User Headers */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-border">
              <AvatarImage
                src={data1.user.avatar_url || "/placeholder.svg"}
                alt={data1.user.name || data1.user.login}
              />
              <AvatarFallback>
                {data1.user.login.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="truncate text-xl font-bold">
                {data1.user.name || data1.user.login}
              </h3>
              <p className="truncate text-sm text-muted-foreground">
                @{data1.user.login}
              </p>
              <a
                href={data1.user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                View Profile
              </a>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-border">
              <AvatarImage
                src={data2.user.avatar_url || "/placeholder.svg"}
                alt={data2.user.name || data2.user.login}
              />
              <AvatarFallback>
                {data2.user.login.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="truncate text-xl font-bold">
                {data2.user.name || data2.user.login}
              </h3>
              <p className="truncate text-sm text-muted-foreground">
                @{data2.user.login}
              </p>
              <a
                href={data2.user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                View Profile
              </a>
            </div>
          </div>
        </Card>
      </div>

      {/* Metrics Comparison */}
      <Card className="p-6">
        <h3 className="mb-6 text-xl font-bold">Metrics Comparison</h3>
        <div className="space-y-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const winner =
              metric.value1 > metric.value2
                ? "left"
                : metric.value2 > metric.value1
                ? "right"
                : "tie";

            return (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  <span>{metric.label}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <div className="text-right">
                    <span
                      className={`text-2xl font-bold ${
                        winner === "left" ? "text-primary" : ""
                      }`}
                    >
                      {metric.value1.toLocaleString()}
                    </span>
                    {winner === "left" && (
                      <Badge variant="success" className="ml-2">
                        Winner
                      </Badge>
                    )}
                  </div>
                  <div className="text-center text-xs text-muted-foreground">
                    vs
                  </div>
                  <div className="text-left">
                    <span
                      className={`text-2xl font-bold ${
                        winner === "right" ? "text-primary" : ""
                      }`}
                    >
                      {metric.value2.toLocaleString()}
                    </span>
                    {winner === "right" && (
                      <Badge variant="success" className="ml-2">
                        Winner
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Account Age</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="text-right">
                <span
                  className={`text-2xl font-bold ${
                    accountAge1 > accountAge2 ? "text-primary" : ""
                  }`}
                >
                  {accountAge1}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">
                  years
                </span>
                {accountAge1 > accountAge2 && (
                  <Badge variant="success" className="ml-2">
                    Winner
                  </Badge>
                )}
              </div>

              <div className="text-center text-xs text-muted-foreground">
                vs
              </div>

              <div className="text-left">
                <span
                  className={`text-2xl font-bold ${
                    accountAge2 > accountAge1 ? "text-primary" : ""
                  }`}
                >
                  {accountAge2}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">
                  years
                </span>
                {accountAge2 > accountAge1 && (
                  <Badge variant="success" className="ml-2">
                    Winner
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
