import { useEffect } from "react";
import { useClanStore } from "@/stores/clan-store";
import { fetchClanMembers, fetchClans } from "@/lib/supabase-data";

export function ClanLoader() {
  const setClansList = useClanStore((s) => s.setClansList);
  const setClanMembersList = useClanStore((s) => s.setClanMembersList);

  useEffect(() => {
    async function loadClan() {
      const [clans, clanMembers] = await Promise.all([
        fetchClans(),
        fetchClanMembers(),
      ]);

      if (clans) {
        setClansList(clans);
      }

      if (clanMembers) {
        setClanMembersList(clanMembers);
      }
    }

    loadClan();
  }, [setClansList, setClanMembersList]);

  return null;
}
