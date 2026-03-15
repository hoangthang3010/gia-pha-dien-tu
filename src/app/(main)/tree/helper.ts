import { TreeFamily, TreeNode } from "@/lib/tree-layout";

export function getFamilyFromFather(personId, families) {
  const wives = new Set();
  const children = new Set();
  const daughtersInLaw = new Set();

  function collectDescendants(fatherId) {
    families.forEach((f) => {
      if (f.fatherHandle === fatherId) {
        if (f.motherHandle) wives.add(f.motherHandle);

        f.children.forEach((child) => {
          if (!children.has(child)) {
            children.add(child);

            // tìm vợ của con → con dâu
            families.forEach((cf) => {
              if (cf.fatherHandle === child && cf.motherHandle) {
                daughtersInLaw.add(cf.motherHandle);
              }
            });

            // đệ quy tiếp
            collectDescendants(child);
          }
        });
      }
    });
  }

  collectDescendants(personId);

  return {
    husband: [personId],
    wives: [...wives],
    children: [...children],
    daughtersInLaw: [...daughtersInLaw],
  };
}

export const filterFamilyFromFather = (person, families, setTreeData) => {
  const result = getFamilyFromFather(person, families);

  setTreeData((data) => {
    return {
      ...data,
      people: data.people.map((peo) => {
        return {
          ...peo,
          hidden: !result || !Object.values(result).flat().includes(peo.handle),
        };
      }),
    };
  });
};

// Compute generations via BFS from root persons (persons not in any family as children)
export function computePersonGenerations(
  people: TreeNode[],
  families: TreeFamily[],
): Map<string, number> {
  const childOf = new Set<string>();
  for (const f of families) for (const ch of f.children) childOf.add(ch);
  const roots = people.filter((p) => p.isPatrilineal && !childOf.has(p.handle));
  const gens = new Map<string, number>();
  const familyMap = new Map(families.map((f) => [f.handle, f]));
  const queue: { handle: string; gen: number }[] = roots.map((r) => ({
    handle: r.handle,
    gen: 0,
  }));
  while (queue.length > 0) {
    const { handle, gen } = queue.shift()!;
    if (gens.has(handle)) continue;
    gens.set(handle, gen);
    const person = people.find((p) => p.handle === handle);
    if (!person) continue;
    for (const fId of person.families) {
      const fam = familyMap.get(fId);
      if (!fam) continue;
      // Spouse at same gen
      if (fam.fatherHandle && !gens.has(fam.fatherHandle))
        gens.set(fam.fatherHandle, gen);
      if (fam.motherHandle && !gens.has(fam.motherHandle))
        gens.set(fam.motherHandle, gen);
      for (const ch of fam.children) {
        if (!gens.has(ch)) queue.push({ handle: ch, gen: gen + 1 });
      }
    }
  }
  return gens;
}
