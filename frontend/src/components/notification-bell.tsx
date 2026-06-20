"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Bell, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { fetchNotifications, fetchUnreadNotificationsCount, NotificationItem } from "@/lib/supabase-data";
import { useAuth } from "@/components/auth-provider";
import { useAuthStore } from "@/stores/auth-store";

export function NotificationBell() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const useSse =
    process.env.NEXT_PUBLIC_NOTIFICATION_MODE === "sse" && !!accessToken;
  const notificationStreamUrl = accessToken
    ? `${process.env.NEXT_PUBLIC_API_URL || ""}/notifications/stream?token=${encodeURIComponent(
        accessToken,
      )}`
    : null;

  const latestNotifications = useMemo(
    () => notifications.slice(0, 10),
    [notifications],
  );

  const fetchLatestNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchNotifications(10);
      setNotifications(Array.isArray(data.items) ? data.items : []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const fetchCount = async () => {
      try {
        const count = await fetchUnreadNotificationsCount();
        setUnreadCount(count || 0);
      } catch {
        /* ignore */
      }
    };

    fetchCount();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLatestNotifications();

    if (
      useSse &&
      typeof window !== "undefined" &&
      notificationStreamUrl &&
      "EventSource" in window
    ) {
      const source = new EventSource(notificationStreamUrl);

      source.onmessage = (event) => {
        try {
          const data = event.data.trim();
          const parsed = JSON.parse(data);
          const count = typeof parsed === "number" ? parsed : parsed?.count ?? 0;
          setUnreadCount(count || 0);

          if (parsed?.type === "notification" && parsed?.notification) {
            setNotifications((prev) => {
              const next = [parsed.notification, ...prev.filter((item) => item.id !== parsed.notification.id)];
              return next.slice(0, 10);
            });
          }
        } catch {
          try {
            const count = Number(event.data.trim());
            if (!Number.isNaN(count)) {
              setUnreadCount(count || 0);
            }
          } catch {
            /* ignore malformed SSE payload */
          }
        }
      };

      source.onerror = () => {
        // SSE will retry automatically; keep existing count until next event.
      };

      return () => source.close();
    }

    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, user, useSse, notificationStreamUrl, fetchLatestNotifications]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[22rem] p-0" align="end" forceMount>
        <div className="space-y-2 p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">Thông báo</p>
              <p className="text-xs text-muted-foreground">
                {unreadCount} chưa đọc
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                router.push("/notifications");
              }}
            >
              Xem tất cả
            </Button>
          </div>

          <div className="max-h-[32rem] overflow-y-auto rounded-md border border-border bg-background">
            {loading ? (
              <div className="p-4 text-sm text-muted-foreground">
                Đang tải thông báo...
              </div>
            ) : latestNotifications.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                Chưa có thông báo nào
              </div>
            ) : (
              latestNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col gap-1 p-3 hover:bg-accent"
                  onSelect={(event) => {
                    event.preventDefault();
                    setIsOpen(false);
                    if (notification.link_url) {
                      router.push(notification.link_url);
                    }
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium line-clamp-1">
                      {notification.title}
                    </span>
                    {notification.link_url ? (
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(notification.created_at).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
