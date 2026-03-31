"use client";

import { useEffect } from "react";
import { useClanStore } from "@/stores/clan-store";
import { useTreeStore } from "@/stores/tree-store";
import { fetchTreeData } from "@/lib/supabase-data";

export function TreeLoader() {
  const clanId = useClanStore((s) => s.clanId);
  const setTreeData = useTreeStore((s) => s.setTreeData);

  useEffect(() => {
    if (!clanId) return;

    fetchTreeData(clanId).then((data) => {
      setTreeData(data.people, data.families);
    });
  }, [clanId, setTreeData]);

  return null;
}
