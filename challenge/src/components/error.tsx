"use client";
import { Card } from "@/components/ui/card";

export default function ErrorCard({ message }: { message: string }) {
  return (
    <Card className="mx-auto max-w-2xl p-8 text-center border border-red-200 bg-red-50">
      <p className="text-red-800 font-medium">{message}</p>
    </Card>
  );
}
