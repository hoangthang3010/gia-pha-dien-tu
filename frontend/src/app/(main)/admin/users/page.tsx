"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Shield,
  Plus,
  MoreHorizontal,
  Copy,
  Check,
  Link2,
  Trash2,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";
import { fetchAllProfiles, updateProfileRole, updateProfileStatus, fetchInviteLinks, createInviteLink, deleteInviteLink } from "@/lib/supabase-data";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  editor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  archivist:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  member: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  guest: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

interface ProfileUser {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  status: string;
  created_at: string;
}

interface InviteLink {
  id: string;
  code: string;
  role: string;
  max_uses: number;
  used_count: number;
  created_at: string;
}

function generateCode() {
  const chars = "abcdef0123456789";
  let code = "";
  for (let i = 0; i < 32; i++)
    code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function AdminUsersPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<ProfileUser[]>([]);
  const [invites, setInvites] = useState<InviteLink[]>([]);
  const [loading, setLoading] = useState(true);

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteMaxUses, setInviteMaxUses] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);

  // Users pagination states
  const [usersPage, setUsersPage] = useState(1);
  const [usersLimit, setUsersLimit] = useState(10);
  const [usersNextPage, setUsersNextPage] = useState<number | null>(null);
  const [usersPrevPage, setUsersPrevPage] = useState<number | null>(null);

  // Invites pagination states
  const [invitesPage, setInvitesPage] = useState(1);
  const [invitesLimit, setInvitesLimit] = useState(10);
  const [invitesNextPage, setInvitesNextPage] = useState<number | null>(null);
  const [invitesPrevPage, setInvitesPrevPage] = useState<number | null>(null);

  // Fetch users from profiles table
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllProfiles(usersLimit, usersPage);
      setUsers(res.items);
      setUsersNextPage(res.nextPage);
      setUsersPrevPage(res.prevPage);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [usersPage, usersLimit]);

  // Fetch invite links
  const fetchInvites = useCallback(async () => {
    try {
      const res = await fetchInviteLinks(invitesLimit, invitesPage);
      setInvites(res.items);
      setInvitesNextPage(res.nextPage);
      setInvitesPrevPage(res.prevPage);
    } catch {
      /* ignore */
    }
  }, [invitesPage, invitesLimit]);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchUsers();
    }
  }, [authLoading, isAdmin, fetchUsers]);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchInvites();
    }
  }, [authLoading, isAdmin, fetchInvites]);

  // Create invite link
  const handleCreateInvite = useCallback(async () => {
    const code = generateCode();
    const data = await createInviteLink({
      code,
      role: inviteRole,
      max_uses: inviteMaxUses,
    });
    if (data) {
      setInvites((prev) => [data, ...prev]);
    }
  }, [inviteRole, inviteMaxUses]);

  // Delete invite link
  const handleDeleteInvite = useCallback(async (id: string) => {
    await deleteInviteLink(id);
    setInvites((prev) => prev.filter((inv) => inv.id !== id));
  }, []);

  // Change user role
  const handleChangeRole = useCallback(
    async (userId: string, newRole: string) => {
      await updateProfileRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    },
    [],
  );

  // Suspend / reactivate user
  const handleToggleStatus = useCallback(
    async (userId: string, currentStatus: string) => {
      const newStatus = currentStatus === "active" ? "suspended" : "active";
      await updateProfileStatus(userId, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
      );
    },
    [],
  );

  // Copy to clipboard
  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    }
  }, []);

  const getInviteUrl = (code: string) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/register?code=${code}`;
  };

  const handleCloseDialog = () => {
    setInviteDialogOpen(false);
    setCopied(null);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-muted-foreground">
          Bạn không có quyền truy cập trang này.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Quản lý thành viên
          </h1>
          <p className="text-muted-foreground">
            Quản lý tài khoản và quyền truy cập
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              fetchUsers();
              fetchInvites();
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog
            open={inviteDialogOpen}
            onOpenChange={(open) => {
              if (!open) handleCloseDialog();
              else setInviteDialogOpen(true);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tạo link mời
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo link mời thành viên</DialogTitle>
                <DialogDescription>
                  Chọn quyền và tạo link mời cho thành viên mới
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quyền</label>
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    <option value="member">
                      Member — Xem và đề xuất chỉnh sửa
                    </option>
                    <option value="editor">Editor — Chỉnh sửa trực tiếp</option>
                    <option value="archivist">
                      Archivist — Quản lý tư liệu
                    </option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Số lần dùng tối đa
                  </label>
                  <Input
                    type="number"
                    value={inviteMaxUses}
                    onChange={(e) =>
                      setInviteMaxUses(
                        Math.max(1, parseInt(e.target.value) || 1),
                      )
                    }
                    min={1}
                    max={100}
                  />
                </div>
                <Button className="w-full" onClick={handleCreateInvite}>
                  <Link2 className="mr-2 h-4 w-4" />
                  Tạo link mời
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thành viên</CardTitle>
          <CardDescription>{users.length} thành viên</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Quyền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tham gia</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.display_name || user.email.split("@")[0]}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={ROLE_COLORS[user.role] || ""}
                        >
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "destructive"
                          }
                        >
                          {user.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(user.id, "admin")}
                            >
                              Đặt Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(user.id, "editor")}
                            >
                              Đặt Editor
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(user.id, "member")}
                            >
                              Đặt Member
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className={
                                user.status === "active"
                                  ? "text-destructive"
                                  : "text-green-600"
                              }
                              onClick={() =>
                                handleToggleStatus(user.id, user.status)
                              }
                            >
                              {user.status === "active"
                                ? "Tạm ngưng"
                                : "Kích hoạt lại"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls for Users */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <div className="flex-1 text-sm text-muted-foreground">
                  Trang hiện tại: {usersPage}
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Hàng mỗi trang</p>
                    <select
                      value={usersLimit}
                      onChange={(e) => {
                        setUsersLimit(Number(e.target.value));
                        setUsersPage(1);
                      }}
                      className="h-8 w-[70px] rounded-md border bg-background py-1 px-2 text-sm"
                    >
                      {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                      disabled={!usersPrevPage}
                    >
                      &lt;
                    </Button>
                    <span className="text-sm font-medium px-2">Trang {usersPage}</span>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => setUsersPage((p) => p + 1)}
                      disabled={!usersNextPage}
                    >
                      &gt;
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Invite Links Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Link mời
          </CardTitle>
          <CardDescription>{invites.length} link</CardDescription>
        </CardHeader>
        <CardContent>
          {invites.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              Chưa có link mời nào
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Link</TableHead>
                    <TableHead>Quyền</TableHead>
                    <TableHead>Đã dùng / Tối đa</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          ...?code={inv.code.slice(0, 8)}...
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={ROLE_COLORS[inv.role] || ""}
                        >
                          {inv.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {inv.used_count} / {inv.max_uses}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(inv.created_at).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(getInviteUrl(inv.code))}
                            title="Sao chép link"
                          >
                            {copied === getInviteUrl(inv.code) ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteInvite(inv.id)}
                            title="Xóa link"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <div className="flex-1 text-sm text-muted-foreground">
                  Trang hiện tại: {invitesPage}
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Hàng mỗi trang</p>
                    <select
                      value={invitesLimit}
                      onChange={(e) => {
                        setInvitesLimit(Number(e.target.value));
                        setInvitesPage(1);
                      }}
                      className="h-8 w-[70px] rounded-md border bg-background py-1 px-2 text-sm"
                    >
                      {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => setInvitesPage((p) => Math.max(1, p - 1))}
                      disabled={!invitesPrevPage}
                    >
                      &lt;
                    </Button>
                    <span className="text-sm font-medium px-2">Trang {invitesPage}</span>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => setInvitesPage((p) => p + 1)}
                      disabled={!invitesNextPage}
                    >
                      &gt;
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
