"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TreePine,
  Users,
  Image,
  Activity,
  Newspaper,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchDashboardStats } from "@/lib/supabase-data";
import { useClanStore } from "@/stores/clan-store";

interface Stats {
  people: number;
  families: number;
  clan_members: number;
  posts: number;
  events: number;
  media: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    people: 0,
    families: 0,
    clan_members: 0,
    posts: 0,
    events: 0,
    media: 0,
  });
  const [loading, setLoading] = useState(true);

  const clanId = useClanStore((s) => s.clanId);

  useEffect(() => {
    async function fetchStats() {
      if (!clanId) return;
      try {
        const data = await fetchDashboardStats(clanId);
        setStats(data as unknown as Stats);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [clanId]);

  const cards = [
    {
      title: "Thành viên gia phả",
      icon: TreePine,
      value: stats.people,
      desc: "Trong cơ sở dữ liệu",
      href: "/tree",
    },
    {
      title: "Dòng họ (families)",
      icon: Users,
      value: stats.families,
      desc: "Gia đình đã ghi nhận",
      href: "/tree",
    },
    {
      title: "Tài khoản",
      icon: Users,
      value: stats.clan_members,
      desc: "Người dùng đã đăng ký",
      href: "/directory",
    },
    {
      title: "Bài viết",
      icon: Newspaper,
      value: stats.posts,
      desc: "Bảng tin dòng họ",
      href: "/feed",
    },
    {
      title: "Sự kiện",
      icon: CalendarDays,
      value: stats.events,
      desc: "Hoạt động sắp tới",
      href: "/events",
    },
    {
      title: "Tư liệu",
      icon: Image,
      value: stats.media,
      desc: "Ảnh & tài liệu",
      href: "/media",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trang chủ</h1>
        <p className="text-muted-foreground">
          Chào mừng đến với Gia phả dòng họ Nguyễn Văn
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.title} href={c.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{c.title}</CardTitle>
                <c.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : c.value}
                </div>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bắt đầu nhanh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Link href="/tree">
              <Button variant="outline">🌳 Xem cây gia phả</Button>
            </Link>
            <Link href="/feed">
              <Button variant="outline">📰 Bảng tin</Button>
            </Link>
            <Link href="/events">
              <Button variant="outline">📅 Sự kiện</Button>
            </Link>
            <Link href="/book">
              <Button variant="outline">📖 Sách gia phả</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
