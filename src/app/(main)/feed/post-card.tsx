import CommentSection from "@/app/(main)/feed/comment-section";
import { IPost } from "@/app/(main)/feed/type";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import {
  Calendar,
  ChevronDown,
  EllipsisVertical,
  MessageCircle,
  Pin,
  PinOff,
  Trash2,
  User,
} from "lucide-react";
import { Popover } from "radix-ui";
import { useState } from "react";

export default function PostCard({
  post,
  onRefresh,
}: {
  post: IPost;
  onRefresh: () => void;
}) {
  const { user, isAdmin } = useAuth();
  const [showComments, setShowComments] = useState(false);

  const handleDelete = async () => {
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (!error) onRefresh();
  };

  const handleTogglePin = async () => {
    const { error } = await supabase
      .from("posts")
      .update({ is_pinned: !post.is_pinned })
      .eq("id", post.id);
    if (!error) onRefresh();
  };

  return (
    <Card className={post.is_pinned ? "border-primary/30 bg-primary/5" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">
                {post.author?.display_name ||
                  post.author?.email?.split("@")[0] ||
                  "Ẩn danh"}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(post.created_at).toLocaleDateString("vi-VN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {post.is_pinned && (
              <Badge variant="secondary" className="text-xs">
                📌 Đã ghim
              </Badge>
            )}
            {(isAdmin || user?.id === post.author_id) && (
              <Popover.Root>
                <Popover.Trigger>
                  <EllipsisVertical />
                </Popover.Trigger>
                <Popover.Content>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleTogglePin}
                      title={post.is_pinned ? "Bỏ ghim" : "Ghim"}
                    >
                      {post.is_pinned ? <PinOff /> : <Pin />}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Popover.Content>
              </Popover.Root>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {post.title && <h3 className="font-semibold">{post.title}</h3>}
        <p className="text-sm whitespace-pre-wrap">{post.body}</p>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="mr-1 h-4 w-4" />
          Bình luận {post.comment_count ? `(${post.comment_count})` : ""}
          <ChevronDown
            className={`ml-1 h-3 w-3 transition-transform ${showComments ? "rotate-180" : ""}`}
          />
        </Button>
        {showComments && <CommentSection postId={post.id} />}
      </CardContent>
    </Card>
  );
}
