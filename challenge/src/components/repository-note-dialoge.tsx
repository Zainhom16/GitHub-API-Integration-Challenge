"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Repository } from "../../types/Repository";

interface RepositoryNoteDialogProps {
  repo: Repository;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function RepositoryNoteDialog({
  repo,
  open,
  onOpenChangeAction,
}: RepositoryNoteDialogProps) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      const savedNotes = localStorage.getItem(
        `github-repo-notes-${repo.full_name}`
      );
      setNotes(savedNotes || "");
    }
  }, [repo.full_name, open]);

  const handleSave = () => {
    localStorage.setItem(`github-repo-notes-${repo.full_name}`, notes);
    toast.success("Notes saved", {
      description: `Your notes for ${repo.name} have been saved locally.`,
    });
    onOpenChangeAction(false);
  };

  const handleDelete = () => {
    localStorage.removeItem(`github-repo-notes-${repo.full_name}`);
    setNotes("");
    toast.info("Notes deleted", {
      description: `Your notes for ${repo.name} have been deleted.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Repository Notes
          </DialogTitle>
          <DialogDescription>{repo.full_name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            placeholder={`Add your notes about ${repo.name}...`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-40 resize-y"
          />

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleDelete} disabled={!notes}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Notes
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Notes are saved locally in your browser using localStorage.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
