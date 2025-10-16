"use client";

import type React from "react";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ComparisonResults from "@/components/comparison-result";

export default function UserComparison() {
  const [username1, setUsername1] = useState("");
  const [username2, setUsername2] = useState("");
  const [comparedUsers, setComparedUsers] = useState<[string, string] | null>(
    null
  );

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (username1.trim() && username2.trim()) {
      setComparedUsers([username1.trim(), username2.trim()]);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="mx-auto max-w-3xl p-8">
        <div className="mb-6 flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Compare GitHub Users</h2>
        </div>

        <form onSubmit={handleCompare} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="user1" className="text-sm font-medium">
                First User
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="user1"
                  type="text"
                  placeholder="Username 1"
                  value={username1}
                  onChange={(e) => setUsername1(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="user2" className="text-sm font-medium">
                Second User
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="user2"
                  type="text"
                  placeholder="Username 2"
                  value={username2}
                  onChange={(e) => setUsername2(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Compare Users
          </Button>
        </form>
      </Card>

      {comparedUsers && (
        <ComparisonResults
          username1={comparedUsers[0]}
          username2={comparedUsers[1]}
        />
      )}
    </div>
  );
}
