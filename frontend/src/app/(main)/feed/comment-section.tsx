import { IComment } from "@/app/(main)/feed/type";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { Dot, Send, User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function CommentSection({ postId }: { postId: string }) {
  const { user, isLoggedIn } = useAuth();
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/comments?postId=${postId}`);
      if (data?.items) setComments(data.items);
    } catch (err: any) {
      console.error("Failed to load comments:", err.message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;
    try {
      await apiClient.post("/comments", {
        post_id: postId,
        content: newComment.trim(),
      });
      setNewComment("");
      fetchComments();
    } catch (err: any) {
      console.error("Failed to post comment:", err.message);
    }
  };

  return (
    <div className="border-t pt-3 space-y-3">
      {loading ? (
        <p className="text-xs text-muted-foreground">Đang tải...</p>
      ) : (
        comments.map((c: IComment) => (
          <div key={c.id} className="flex gap-2">
            <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
              <User className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <p className="text-xs font-medium">
                  {c.author?.display_name || c.author?.email?.split("@")[0]}
                </p>
                <span className="mx-2">·</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(c.created_at)}
                </span>
              </div>
              <p className="text-sm mt-2">{c.content}</p>
            </div>
          </div>
        ))
      )}
      {isLoggedIn && (
        <div className="flex gap-2">
          <Input
            placeholder="Viết bình luận..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="text-sm"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSubmit}
            disabled={!newComment.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
