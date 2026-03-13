import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { PenSquare } from "lucide-react";
import { useState } from "react";

export default function PostComposer({
  onPostCreated,
}: {
  onPostCreated: () => void;
}) {
  const { user, isLoggedIn } = useAuth();
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async () => {
    if (!body.trim() || !user) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("posts").insert({
        author_id: user.id,
        title: title.trim() || null,
        body: body.trim(),
        type: "general",
      });
      if (!error) {
        setBody("");
        setTitle("");
        setExpanded(false);
        onPostCreated();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        {expanded && (
          <Input
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
