"use client";

import { useEffect, useState, useCallback } from "react";
import { FileText, Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fetchAuditLogs } from "@/lib/supabase-data";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  UPDATE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const data = await fetchAuditLogs();
    if (data) setLogs(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const filtered = logs.filter(
    (l) =>
      ((l.action as string) || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      ((l.entity_type as string) || "")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLogs = filtered.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Audit Log
          </h1>
          <p className="text-muted-foreground">Lịch sử hoạt động hệ thống</p>
        </div>
        <Button variant="outline" onClick={fetchLogs}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Lọc theo hành động, entity..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Hành động</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>Người thực hiện</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.map((log) => (
                    <TableRow key={log.id as string}>
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(log.created_at as string).toLocaleString(
                          "vi-VN",
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={ACTION_COLORS[log.action as string] || ""}
                        >
                          {log.action as string}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.entity_type as string}
                      </TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[120px]">
                        {(log.entity_id as string) || "—"}
                      </TableCell>
                      <TableCell>
                        {((log.actor as Record<string, unknown>)
                          ?.display_name as string) ||
                          ((log.actor as Record<string, unknown>)
                            ?.email as string) ||
                          "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-8"
                      >
                        Chưa có log nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              {filtered.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Hiển thị {startIndex + 1} - {Math.min(endIndex, filtered.length)} trong tổng số {filtered.length}
                  </div>
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">Hàng mỗi trang</p>
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="h-8 w-[70px] rounded-md border bg-background py-1 px-2 text-sm"
                      >
                        {[5, 10, 20, 50, 100].map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                      Trang {currentPage} / {totalPages || 1}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <span className="sr-only">Trang trước</span>
                        &lt;
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                      >
                        <span className="sr-only">Trang sau</span>
                        &gt;
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
