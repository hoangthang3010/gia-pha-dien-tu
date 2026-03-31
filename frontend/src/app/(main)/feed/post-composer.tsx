import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/lib/api-client";
import { useClanStore } from "@/stores/clan-store";
import { PenSquare, User } from "lucide-react";
import { useState } from "react";

export default function PostComposer({
  onPostCreated,
}: {
  onPostCreated: () => void;
}) {
  const clanId = useClanStore((s) => s.clanId);

  const { user, isLoggedIn } = useAuth();
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async () => {
    if (!body.trim() || !user) return;
    setSubmitting(true);
    try {
      await apiClient.post("/posts", {
        title: title.trim() || null,
        body: body.trim(),
        clan_id: clanId,
        type: "general",
      });
      setBody("");
      setTitle("");
      setExpanded(false);
      onPostCreated();
    } catch (err: any) {
      console.error("Failed to create post:", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
            <User className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="flex-1">
            {expanded && (
              <Input
                className="mb-2"
                placeholder="Tiêu đề (tùy chọn)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            )}
            <Textarea
              placeholder="Chia sẻ điều gì đó với dòng họ..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onFocus={() => setExpanded(true)}
              rows={expanded ? 4 : 2}
            />
          </div>
        </div>
        {expanded && (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(false)}
            >
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!body.trim() || submitting}
            >
              <PenSquare className="mr-2 h-4 w-4" />
              {submitting ? "Đang đăng..." : "Đăng bài"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
