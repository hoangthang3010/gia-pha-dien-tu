"use client";

import { useEffect, useState, useCallback } from "react";
import { Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import apiClient from "@/lib/api-client";
import PostComposer from "@/app/(main)/feed/post-composer";
import PostCard from "@/app/(main)/feed/post-card";
import { IPost } from "@/app/(main)/feed/type";
import { Popover } from "radix-ui";
import { useClanStore } from "@/stores/clan-store";

export default function FeedPage() {
  const clanId = useClanStore((s) => s.clanId);

  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (!clanId) return;
    setLoading(true);
    try {
      const { data } = await apiClient.get('/posts');
      if (data) setPosts(data);
    } catch (error: any) {
      console.error("Failed to load posts:", error.message);
    } finally {
      setLoading(false);
    }
  }, [clanId]);

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
