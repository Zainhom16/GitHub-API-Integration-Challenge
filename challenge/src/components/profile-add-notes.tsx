"use client";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StickyNote, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ProfileNotes({
  username,
  profileName,
}: {
  username: string;
  profileName: string;
}) {
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem(`github-notes-${username}`);
    setNotes(savedNotes || "");
  }, [username]);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem(`github-notes-${username}`, notes);

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Notes saved", {
        description: `Your notes for ${profileName} have been saved locally.`,
      });
    }, 300);
  };

  const handleDelete = () => {
    localStorage.removeItem(`github-notes-${username}`);
    setNotes("");
    toast.success("Notes deleted", {
      description: `Your notes for ${profileName} have been deleted.`,
    });
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold">Personal Notes</h3>
        </div>
        {notes && (
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder={`Add your notes about ${profileName}...`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-32 resize-y"
        />
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Notes"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Notes are saved locally in your browser using localStorage.
        </p>
      </div>
    </Card>
  );
}
