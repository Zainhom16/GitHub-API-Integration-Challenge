"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitHubUser } from "../../types/GitHubUser";
import {
  MapPin,
  LinkIcon,
  Building,
  Users,
  BookOpen,
  Calendar,
  ExternalLink,
} from "lucide-react";
import RepositoryData from "@/components/repository-list";
import Loading from "./loading";
import ErrorCard from "./error";
import { AIAnalysis } from "./ai-component";
import ProfileNotes from "./profile-add-notes";

export default function ProfileData({ username }: { username: string }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.github.com/users/${username}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("User not found");
          }
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (isLoading) {
    <Loading />;
  }

  if (error) {
    <ErrorCard message={error} />;
  }

  if (!user) return null;

  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Card className="p-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Avatar className="h-48 w-48 border-4 border-border">
              <AvatarImage
                src={user.avatar_url || "/placeholder.svg"}
                alt={user.name || user.login}
              />
              <AvatarFallback>
                {user.login.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <div className="flex-1 min-w-0">
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2"
                >
                  <h2 className="text-3xl font-bold transition-all duration-200 group-hover:underline decoration-2 underline-offset-4">
                    {user.name || user.login}
                  </h2>
                  <ExternalLink className="h-6 w-6 flex-shrink-0 text-muted-foreground transition-transform duration-200 group-hover:scale-110 group-hover:text-primary" />
                </a>
              </div>

              <p className="text-lg text-muted-foreground">@{user.login}</p>
            </div>

            {user.bio && (
              <p className="text-base leading-relaxed">{user.bio}</p>
            )}

            <div className="flex flex-wrap gap-4">
              {/*repos*/}
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">{user.public_repos}</span>
                <span className="text-muted-foreground">repositories</span>
              </div>

              {/*followers*/}
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">{user.followers}</span>
                <span className="text-muted-foreground">followers</span>
              </div>

              {/*following*/}
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">{user.following}</span>
                <span className="text-muted-foreground">following</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-2">
              {user.company && (
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{user.company}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <RepositoryData username={user.login} />
      <AIAnalysis username={user.login} />
      <ProfileNotes
        username={user.login}
        profileName={user.name || user.login}
      />
    </div>
  );
}
