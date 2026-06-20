import CommentSection from "@/app/(main)/feed/comment-section";
import { IPost } from "@/app/(main)/feed/type";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import apiClient from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
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
    try {
      await apiClient.delete(`/posts/${post.id}`);
      onRefresh();
    } catch (err: any) {
      console.error("Failed to delete post:", err.message);
    }
  };

  const handleTogglePin = async () => {
    try {
      await apiClient.patch(`/posts/${post.id}`, { is_pinned: !post.is_pinned });
      onRefresh();
    } catch (err: any) {
      console.error("Failed to pin post:", err.message);
    }
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
                {formatDate(post.created_at)}
              </div>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            {post.is_pinned && (
              <Badge variant="secondary" className="text-xs">
                📌 Đã ghim
              </Badge>
            )}
            {(isAdmin || user?.id === post.author_id) && (
              <Popover.Root>
                <Popover.Trigger asChild>
                  <Button variant="ghost" size="icon">
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                </Popover.Trigger>

                <Popover.Portal>
                  <Popover.Content
                    side="bottom"
                    align="end"
                    className="w-32 p-1 bg-popover border rounded-md shadow-md"
                  >
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleTogglePin}
                      >
                        {post.is_pinned ? <PinOff /> : <Pin />}
                        {post.is_pinned ? "Bỏ ghim" : "Ghim"}
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-destructive"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </Button>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {post.title && <h3 className="font-semibold">{post.title}</h3>}
        <p className="text-sm whitespace-pre-wrap">{post.content}</p>
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
