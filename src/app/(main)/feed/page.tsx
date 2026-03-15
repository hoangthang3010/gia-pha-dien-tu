"use client";

import { useEffect, useState, useCallback } from "react";
import { Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import PostComposer from "@/app/(main)/feed/post-composer";
import PostCard from "@/app/(main)/feed/post-card";
import { IPost } from "@/app/(main)/feed/type";
import { Popover } from "radix-ui";

export default function FeedPage() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("posts")
        .select("*, author:profiles(email, display_name, role)")
        .eq("status", "published")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (data) {
        // Get comment counts
        const postIds = data.map((p: IPost) => p.id);
        if (postIds.length > 0) {
          const { data: counts } = await supabase
            .from("comments")
            .select("post_id")
            .in("post_id", postIds);
          const countMap: Record<string, number> = {};
          counts?.forEach((c: { post_id: string }) => {
            countMap[c.post_id] = (countMap[c.post_id] || 0) + 1;
          });
          data.forEach((p: IPost) => {
            p.comment_count = countMap[p.id] || 0;
          });
        }
        setPosts(data);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Newspaper className="h-6 w-6" />
          Bảng tin
        </h1>
        <p className="text-muted-foreground">Tin tức và hoạt động dòng họ</p>
      </div>

      <PostComposer onPostCreated={fetchPosts} />

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Chưa có bài viết nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onRefresh={fetchPosts} />
          ))}
        </div>
      )}
    </div>
  );
}
