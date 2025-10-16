"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { useState } from "react";
import ProfileData from "@/components/profile-info-card";
import UserComparison from "@/components/comparison-input-data";

export default function Home() {
  const [activeTab, setActiveTab] = useState("search");
  const [username, setUsername] = useState("");
  const [searchedUsername, setSearchedUsername] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setSearchedUsername(username.trim());
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setUsername("");
    setSearchedUsername("");
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="mx-auto w-full mb-8 grid grid-cols-2 max-w-md">
            <TabsTrigger value="search">Search Profiles</TabsTrigger>
            <TabsTrigger value="compare">Compare Users</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <form className="mx-auto mb-12 max-w-2xl" onSubmit={handleSearch}>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter GitHub Username"
                    className="h-12 pl-10 text-base"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" className="px-8">
                  Search
                </Button>
              </div>
            </form>
            {searchedUsername && <ProfileData username={searchedUsername} />}
          </TabsContent>

          <TabsContent value="compare">
            <UserComparison />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
