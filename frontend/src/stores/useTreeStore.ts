// stores/useTreeStore.ts
import { create } from "zustand";

type TreeStore = {
  people: any[];
  families: any[];

  setTreeData: (people: any[], families: any[]) => void;
};

export const useTreeStore = create<TreeStore>((set) => ({
  people: [],
  families: [],

  setTreeData: (people, families) =>
    set({
      people,
      families,
    }),
}));
