// stores/clan-store.ts
import { create } from "zustand";

type ClanStore = {
  clanId: string | null;
  clansList: any[];
  clanMembersList: any[];

  setClanId: (id: string) => void;
  setClansList: (arr: any[]) => void;
  setClanMembersList: (arr: any[]) => void;
};

export const useClanStore = create<ClanStore>((set) => ({
  clanId: null,
  clansList: [],
  clanMembersList: [],

  setClanId: (id) => set({ clanId: id }),
  setClansList: (arr) => set({ clansList: arr }),
  setClanMembersList: (arr) => set({ clanMembersList: arr }),
}));
