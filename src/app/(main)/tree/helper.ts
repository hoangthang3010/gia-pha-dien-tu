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
