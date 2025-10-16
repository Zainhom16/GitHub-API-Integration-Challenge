"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Circle, ExternalLink, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from "./loading";
import ErrorCard from "./error";
import { RepositoryNoteDialog } from "@/components/repository-note-dialoge";
import { Repository } from "../../types/Repository";

export default function RepositoryData({ username }: { username: string }) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
        );

        if (!response.ok) throw new Error("Failed to fetch repositories");

        const data = await response.json();
        setRepos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  if (isLoading) return <Loading />;
  if (error) return <ErrorCard message={error} />;

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Repositories ({repos.length})</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {repos.map((repo) => (
            <Card
              key={repo.id}
              className="p-6 transition-colors hover:bg-accent/50"
            >
              <div className="space-y-4">
                {/* Repo Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2"
                    >
                      <h4 className="truncate text-lg font-semibold text-primary group-hover:underline">
                        {repo.name}
                      </h4>
                      <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    </a>
                    {repo.fork && (
                      <Badge variant="secondary" className="mt-1">
                        Fork
                      </Badge>
                    )}
                  </div>

                  {/* Note Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRepo(repo)}
                    title="Add Note"
                  >
                    <StickyNote className="h-4 w-4" />
                  </Button>
                </div>

                {/* Description */}
                {repo.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {repo.description}
                  </p>
                )}

                {/* Topics */}
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {repo.topics.slice(0, 5).map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {repo.language && (
                    <div className="flex items-center gap-1.5">
                      <Circle className="h-3 w-3 fill-primary text-primary" />
                      <span>{repo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GitFork className="h-4 w-4" />
                    <span>{repo.forks_count}</span>
                  </div>
                </div>

                {/* Updated */}
                <div className="text-xs text-muted-foreground">
                  Updated{" "}
                  {new Date(repo.updated_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {repos.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No public repositories found
            </p>
          </Card>
        )}
      </div>

      {selectedRepo && (
        <RepositoryNoteDialog
          repo={selectedRepo}
          open={!!selectedRepo}
          onOpenChangeAction={(open) => !open && setSelectedRepo(null)}
        />
      )}
    </>
  );
}
