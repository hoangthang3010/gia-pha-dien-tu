"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchPeople, fetchDashboardStats } from "@/lib/supabase-data";
import { useClanStore } from "@/stores/clan-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Person {
  handle: string;
  displayName: string;
  gender: number;
  birthYear?: number;
  deathYear?: number;
  isLiving: boolean;
  isPrivacyFiltered: boolean;
  _privacyNote?: string;
}

export default function PeopleListPage() {
  const router = useRouter();
  const clanId = useClanStore((s) => s.clanId);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<number | null>(null);
  const [livingFilter, setLivingFilter] = useState<boolean | null>(null);
  const [totalPeople, setTotalPeople] = useState<number | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [prevPage, setPrevPage] = useState<number | null>(null);
  console.log(currentPage);


  // Debounce search query to avoid spamming backend API
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch total number of members in family tree
  useEffect(() => {
    if (!clanId) return;
    const loadStats = async () => {
      try {
        const stats = await fetchDashboardStats(clanId);
        if (stats && typeof stats.people === "number") {
          setTotalPeople(stats.people);
        }
      } catch {
        /* ignore */
      }
    };
    loadStats();
  }, [clanId]);

  // Fetch paginated and filtered list of members
  useEffect(() => {
    const loadPeople = async () => {
      setLoading(true);
      try {
        const res = await fetchPeople(
          pageSize,
          currentPage,
          debouncedSearch || undefined,
          genderFilter !== null ? genderFilter : undefined,
          livingFilter !== null ? livingFilter : undefined
        );

        setPeople(res.items);
        setNextPage(res.nextPage);
        setPrevPage(res.prevPage);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    loadPeople();
  }, [currentPage, pageSize, debouncedSearch, genderFilter, livingFilter]);


  useEffect(() => {
    const loadPeople = async () => {
      setLoading(true);
      try {
        const res = await fetchPeople(
          10,
          1,
        );
        setPeople(res.items);
        setNextPage(res.nextPage);
        setPrevPage(res.prevPage);
        setCurrentPage(res.page)
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    loadPeople();
  }, [clanId]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleGenderFilter = (val: number | null) => {
    setGenderFilter(val);
    setCurrentPage(1);
  };

  const handleLivingFilter = (val: boolean | null) => {
    setLivingFilter(val);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6" />
          Thành viên gia phả
        </h1>
        <p className="text-muted-foreground">
          {totalPeople !== null ? `${totalPeople} người trong gia phả` : "Danh sách thành viên gia phả"}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={genderFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleGenderFilter(null)}
          >
            Tất cả
          </Button>
          <Button
            variant={genderFilter === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => handleGenderFilter(1)}
          >
            Nam
          </Button>
          <Button
            variant={genderFilter === 2 ? "default" : "outline"}
            size="sm"
            onClick={() => handleGenderFilter(2)}
          >
            Nữ
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={livingFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleLivingFilter(null)}
          >
            Tất cả
          </Button>
          <Button
            variant={livingFilter === true ? "default" : "outline"}
            size="sm"
            onClick={() => handleLivingFilter(true)}
          >
            Còn sống
          </Button>
          <Button
            variant={livingFilter === false ? "default" : "outline"}
            size="sm"
            onClick={() => handleLivingFilter(false)}
          >
            Đã mất
          </Button>
        </div>
      </div>

      {/* Table */}
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
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Giới tính</TableHead>
                    <TableHead>Năm sinh</TableHead>
                    <TableHead>Năm mất</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {people.map((p) => (
                    <TableRow
                      key={p.handle}
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => router.push(`/people/${p.handle}`)}
                    >
                      <TableCell className="font-medium">
                        {p.displayName}
                        {p.isPrivacyFiltered && (
                          <span className="ml-1 text-amber-500">🔒</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {p.gender === 1 ? "Nam" : p.gender === 2 ? "Nữ" : "?"}
                        </Badge>
                      </TableCell>
                      <TableCell>{p.birthYear || "—"}</TableCell>
                      <TableCell>
                        {p.deathYear || (p.isLiving ? "—" : "?")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.isLiving ? "default" : "secondary"}>
                          {p.isLiving ? "Còn sống" : "Đã mất"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {people.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-8"
                      >
                        {search || genderFilter !== null || livingFilter !== null
                          ? "Không tìm thấy kết quả"
                          : "Chưa có dữ liệu gia phả"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              {people.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Hiển thị {(currentPage - 1) * pageSize + 1} - {(currentPage - 1) * pageSize + people.length}
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
                    <div className="flex items-center justify-center text-sm font-medium">
                      Trang {currentPage}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={prevPage === null}
                      >
                        <span className="sr-only">Trang trước</span>
                        &lt;
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={nextPage === null}
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
