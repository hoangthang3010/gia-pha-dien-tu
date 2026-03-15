"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { ContributeDialog } from "@/components/contribute-dialog";
import { Search, TreePine, Eye, Users, GitBranch, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
  fetchTreeData,
  updateFamilyChildren as supaUpdateFamilyChildren,
  moveChildToFamily as supaMoveChild,
  removeChildFromFamily as supaRemoveChild,
  updatePersonLiving as supaUpdatePersonLiving,
  updatePerson as supaUpdatePerson,
} from "@/lib/supabase-data";
import { type TreeNode, type TreeFamily } from "@/lib/tree-layout";
import TreeFlow from "@/app/(main)/tree/tree-flow";
import {
  computePersonGenerations,
  filterFamilyFromFather,
} from "@/app/(main)/tree/helper";
import EditorPanel from "@/app/(main)/tree/editor-panel";
import FamilyTreeLengend from "@/app/(main)/tree/family-tree-legend";
import { TreeControls } from "@/app/(main)/tree/tree-controls";
import { useTreeStore } from "@/stores/useTreeStore";
import { shallow } from "zustand/shallow";

type ViewMode = "full" | "ancestor" | "descendant";
export type ZoomLevel = "full" | "compact" | "mini";

// Default depth at which branches auto-collapse in panoramic view (0-indexed: gen 3 = Đời 4)
const AUTO_COLLAPSE_GEN = 8;

export default function TreeViewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const treeFlowRef = useRef<unknown>(null);

  const people = useTreeStore((s) => s.people);
  const families = useTreeStore((s) => s.families);
  const treeDataStore = useMemo(
    () => ({ people, families }),
    [families, people],
  );

  const [treeData, setTreeData] = useState<{
    people: TreeNode[];
    families: TreeFamily[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("full");
  const [focusPerson, setFocusPerson] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [highlightHandles, setHighlightHandles] = useState<Set<string>>(
    new Set(),
  );
  const [hoveredHandle, setHoveredHandle] = useState<string | null>(null);
  const [contributePerson, setContributePerson] = useState<{
    handle: string;
    name: string;
  } | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // F4: Collapsible branches
  const [collapsedBranches, setCollapsedBranches] = useState<Set<string>>(
    new Set(),
  );

  // Editor mode state
  const [editorMode, setEditorMode] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  // Fit all
  const fitAll = () => {
    treeFlowRef.current?.fitView?.();
  };

  const filterFamilyFromFatherAndFitView = async (fatherId) => {
    await filterFamilyFromFather(fatherId, treeData?.families, setTreeData);
    fitAll();
  };

  const autoCollapseForDescendant = useCallback(
    (person: string) => {
      if (!treeData) return;
      filterFamilyFromFatherAndFitView(person);
    },
    [treeData],
  );

  useEffect(() => {
    autoCollapseForDescendant?.(focusPerson || "");
  }, [focusPerson]);

  // URL query param initialization + auto-collapse on initial load
  const urlInitialized = useRef(false);
  useEffect(() => {
    if (urlInitialized.current || !treeData) return;
    urlInitialized.current = true;
    const viewParam = searchParams.get("view") as ViewMode | null;
    const personParam = searchParams.get("person");
    if (viewParam && ["full", "ancestor", "descendant"].includes(viewParam)) {
      setViewMode(viewParam);
    }
    if (personParam && treeData.people.some((p) => p.handle === personParam)) {
      setFocusPerson(personParam);
    }
    // Auto-collapse on initial load
    if (!viewParam || viewParam === "full") {
      // Panoramic: collapse by absolute generation
      const gens = computePersonGenerations(treeData.people, treeData.families);
      const toCollapse = new Set<string>();
      for (const f of treeData.families) {
        if (f.children.length === 0) continue;
        const parentHandle = f.fatherHandle || f.motherHandle;
        if (!parentHandle) continue;
        const gen = gens.get(parentHandle);
        if (gen !== undefined && gen >= AUTO_COLLAPSE_GEN) {
          toCollapse.add(parentHandle);
        }
      }
      setCollapsedBranches(toCollapse);
    } else if (viewParam === "descendant" && personParam) {
      // Descendant: collapse by relative depth from focus person
      const personMap = new Map(treeData.people.map((p) => [p.handle, p]));
      const toCollapse = new Set<string>();
      const depthMap = new Map<string, number>();
      const queue: string[] = [personParam];
      depthMap.set(personParam, 0);
      while (queue.length > 0) {
        const h = queue.shift()!;
        const depth = depthMap.get(h)!;
        const p = personMap.get(h);
        if (!p) continue;
        for (const fId of p.families) {
          const fam = treeData.families.find((f) => f.handle === fId);
          if (!fam || fam.children.length === 0) continue;
          if (depth >= AUTO_COLLAPSE_GEN) {
            toCollapse.add(h);
          } else {
            for (const ch of fam.children) {
              if (!depthMap.has(ch)) {
                depthMap.set(ch, depth + 1);
                queue.push(ch);
              }
            }
          }
        }
      }
      setCollapsedBranches(toCollapse);
    }
  }, [searchParams, treeData]);

  // Sync URL when view/focus changes
  useEffect(() => {
    if (!urlInitialized.current) return;
    const params = new URLSearchParams();
    if (viewMode !== "full") params.set("view", viewMode);
    if (focusPerson && viewMode !== "full") params.set("person", focusPerson);
    const qs = params.toString();
    router.replace(`/tree${qs ? "?" + qs : ""}`, { scroll: false });
  }, [viewMode, focusPerson, router]);

  // Fetch data
  useEffect(() => {
    if (!treeDataStore) return;
    setTreeData(treeDataStore);
    setLoading(false);
  }, [treeDataStore]);

  // Filtered data for view mode
  // const displayData = useMemo(() => {
  //   if (!treeData) return null;
  //   if (viewMode === "full" || !focusPerson) return treeData;
  //   if (viewMode === "ancestor")
  //     return filterAncestors(focusPerson, treeData.people, treeData.families);
  //   if (viewMode === "descendant")
  //     return filterDescendants(focusPerson, treeData.people, treeData.families);
  //   return treeData;
  // }, [treeData, viewMode, focusPerson]);

  // F4: Toggle collapse — reveals one level at a time when expanding
  const toggleCollapse = useCallback(
    (handle: string) => {
      if (!treeData) return;
      setCollapsedBranches((prev) => {
        const next = new Set(prev);
        if (next.has(handle)) {
          // Expanding: remove this person's collapse, but auto-collapse their
          // direct children who have descendants (progressive reveal)
          next.delete(handle);
          const person = treeData.people.find((p) => p.handle === handle);
          if (person) {
            for (const fId of person.families) {
              const fam = treeData.families.find((f) => f.handle === fId);
              if (!fam) continue;
              for (const ch of fam.children) {
                // Check if child has their own children
                const childPerson = treeData.people.find(
                  (p) => p.handle === ch,
                );
                if (childPerson) {
                  const childHasChildren = childPerson.families.some((cfId) => {
                    const cf = treeData.families.find((f) => f.handle === cfId);
                    return cf && cf.children.length > 0;
                  });
                  if (childHasChildren) {
                    next.add(ch);
                  }
                }
              }
            }
          }
        } else {
          next.add(handle);
        }
        return next;
      });
    },
    [treeData],
  );

  // F4: Check if a person has children (for showing toggle button)
  const hasChildren = useCallback(
    (handle: string): boolean => {
      if (!treeData) return false;
      return treeData.families.some(
        (f) =>
          (f.fatherHandle === handle || f.motherHandle === handle) &&
          f.children.length > 0,
      );
    },
    [treeData],
  );

  const visibleNodes = useMemo(() => {
    if (!treeData) return [];
    return treeData?.people.filter((n) => !n.hidden);
  }, [treeData]);

  // Stable callbacks for PersonCard
  const handleCardHover = useCallback(
    (h: string | null) => setHoveredHandle(h),
    [],
  );

  // Copy shareable link
  const copyTreeLink = useCallback((handle: string) => {
    const url = `${window.location.origin}/tree?view=descendant&person=${handle}`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }, []);

  const handleCardClick = useCallback(
    (handle: string) => {
      treeFlowRef.current?.reset();
      const node = treeFlowRef.current?.getNode(handle);
      if (!node) return;

      const id = `context-${Date.now()}`;
      const { x, y } = {
        x: node.position.x,
        y: node.position.y,
      };

      const newNode = {
        id,
        type: "context-menu",
        position: {
          x: x + (node.measured?.width ?? 0) + 10,
          y,
        },
        className: "context-menu-node",
        data: {
          ...node.data,
          onViewDetail: () => {
            router.push(`/people/${node.data.handle}`);
            treeFlowRef.current?.reset();
          },

          onShowDescendants: () => {
            setFocusPerson(node.data.handle);
            setViewMode("descendant");
            treeFlowRef.current?.reset();
          },

          onShowAncestors: () => {
            setFocusPerson(node.data.handle);
            setViewMode("ancestor");
            treeFlowRef.current?.reset();
          },

          onSetFocus: () => {
            treeFlowRef.current?.setCenter(x, y, {
              zoom: treeFlowRef.current?.getZoom(),
              duration: 800,
            });
            treeFlowRef.current?.reset();
          },

          onShowFull: () => {
            setViewMode("full");
            fitAll();
            treeFlowRef.current?.reset();
          },

          onCopyLink: () => {
            copyTreeLink(node.data.handle);
            treeFlowRef.current?.reset();
          },

          onContribute: () => {
            setContributePerson({
              handle: node.data.handle,
              name: node.data.displayName,
            });
            treeFlowRef.current?.reset();
          },

          onClose: () => treeFlowRef.current?.reset(),
        },
      };

      if (editorMode) {
        setSelectedCard(handle);
        return;
      }

      treeFlowRef.current?.setNodes((nds) => nds.concat(newNode));
    },
    [copyTreeLink, editorMode, router],
  );
  const handleCardFocus = useCallback((handle: string) => {
    setFocusPerson(handle);
  }, []);

  // Search highlight
  useEffect(() => {
    if (!searchQuery || !treeData) {
      setHighlightHandles(new Set());
      return;
    }
    const q = searchQuery.toLowerCase();
    setHighlightHandles(
      new Set(
        treeData.people
          .filter((p) => p.displayName.toLowerCase().includes(q))
          .map((p) => p.handle),
      ),
    );
  }, [searchQuery, treeData]);

  // View mode
  const changeViewMode = (mode: ViewMode) => {
    if (mode !== "full" && !focusPerson && treeData?.people[0])
      setFocusPerson(treeData.people[0].handle);
    setViewMode(mode);
    // Auto-collapse based on view mode
    if (mode === "full") {
      filterFamilyFromFatherAndFitView(treeData?.people[0].handle);
    } else if (mode === "descendant") {
      const person = focusPerson || treeData?.people[0]?.handle;
      if (person) {
        // TODO
      }
    } else {
      setCollapsedBranches(new Set());
    }
  };

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery || !treeData) return [];
    const q = searchQuery.toLowerCase();
    return treeData.people
      .filter((p) => p.displayName.toLowerCase().includes(q))
      .slice(0, 8);
  }, [searchQuery, treeData]);

  // connPath kept for compatibility but unused with batched rendering

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-1 pb-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <TreePine className="h-5 w-5" /> Cây gia phả
          </h1>
          <p className="text-muted-foreground text-xs">
            {treeData?.people
              ? `${visibleNodes.length} thành viên`
              : "Đang tải..."}
            {viewMode !== "full" && focusPerson && (
              <span className="ml-1 text-blue-500">
                • {viewMode === "ancestor" ? "Tổ tiên" : "Con cháu"} của{" "}
                {
                  treeData?.people.find((p) => p.handle === focusPerson)
                    ?.displayName
                }
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* View modes */}
          <div className="flex rounded-lg border overflow-hidden text-xs">
            {(
              [
                ["full", "Toàn cảnh", Eye],
                ["ancestor", "Tổ tiên", Users],
                ["descendant", "Con cháu", GitBranch],
              ] as const
            ).map(([mode, label, Icon]) => (
              <button
                key={mode}
                onClick={() => changeViewMode(mode)}
                className={`px-2.5 py-1.5 font-medium flex items-center gap-1 transition-colors ${mode !== "full" ? "border-l" : ""} ${viewMode === mode ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <div className="relative w-44">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
                className="pl-8 h-8 text-xs"
              />
            </div>
            {showSearch && searchResults.length > 0 && (
              <Card className="absolute z-50 w-56 right-0 top-10 shadow-lg">
                <CardContent className="p-1 max-h-52 overflow-y-auto">
                  {searchResults.map((p: TreeNode) => (
                    <button
                      key={p.handle}
                      onClick={() => {
                        setFocusPerson(p.handle);
                        setViewMode("descendant");
                        setShowSearch(false);
                        setSearchQuery("");
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded text-xs hover:bg-accent transition-colors flex justify-between"
                    >
                      <span className="font-medium">{p.displayName}</span>
                      <span className="text-muted-foreground">
                        {"generation" in p ? `Đời ${p.generation}` : ""}
                        {p.isPrivacyFiltered ? " 🔒" : ""}
                      </span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Controls */}
          <TreeControls
            fitAll={fitAll}
            zoomIn={() => {
              treeFlowRef.current?.zoomIn();
            }}
            zoomOut={() => treeFlowRef.current?.zoomOut()}
            isAdmin={isAdmin}
            editorMode={editorMode}
            setEditorMode={setEditorMode}
            setSelectedCard={setSelectedCard}
          />
        </div>
      </div>

      {/* Tree viewport + Editor panel row */}
      <div className="flex-1 flex gap-0 min-h-0">
        <div className="flex-1  overflow-hidden rounded-xl border-2 bg-gradient-to-br from-background to-muted/30">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            treeData && (
              <div
                style={{ width: "100%", height: "100%", position: "relative" }}
              >
                <TreeFlow
                  ref={treeFlowRef}
                  treeData={treeData}
                  card={{
                    highlightHandles: highlightHandles,
                    focusPerson: focusPerson,
                    hoveredHandle: hoveredHandle,
                    editorMode: editorMode,
                    selectedCard: selectedCard,
                    hasChildren: hasChildren,
                    collapsedBranches: collapsedBranches,
                    onHover: handleCardHover,
                    onClick: handleCardClick,
                    onSetFocus: handleCardFocus,
                    onToggleCollapse: toggleCollapse,
                  }}
                />
                {/* Zoom + culling indicator */}
                <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur border rounded px-1.5 py-0.5 text-[10px] text-muted-foreground flex gap-1.5">
                  {treeData?.people && <span className="opacity-60">·</span>}
                  {treeData?.people && (
                    <span>
                      {visibleNodes.length}/{treeData?.people.length} nodes
                    </span>
                  )}
                </div>

                {/* Focus person selector */}
                {viewMode !== "full" && treeData && (
                  <div className="absolute top-2 right-2 bg-background/90 backdrop-blur border rounded-lg px-2 py-1.5 flex items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground">Gốc:</span>
                    <select
                      value={focusPerson || ""}
                      onChange={(e) => setFocusPerson(e.target.value)}
                      className="border rounded px-1.5 py-0.5 text-xs bg-background max-w-[140px]"
                    >
                      {treeData.people.map((p) => (
                        <option key={p.handle} value={p.handle}>
                          {p.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )
          )}

          {/* Link copied toast */}
          {linkCopied && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 z-50">
              <Copy className="w-3.5 h-3.5" /> Đã sao chép link!
            </div>
          )}
        </div>

        {/* Editor Sidebar Panel */}
        {editorMode && (
          <EditorPanel
            selectedCard={selectedCard}
            treeData={treeData}
            onReorderChildren={(familyHandle, newOrder) => {
              setTreeData((prev) =>
                prev
                  ? {
                      ...prev,
                      families: prev.families.map((f) =>
                        f.handle === familyHandle
                          ? { ...f, children: newOrder }
                          : f,
                      ),
                    }
                  : null,
              );
              supaUpdateFamilyChildren(familyHandle, newOrder);
            }}
            onMoveChild={(childHandle, fromFamily, toFamily) => {
              setTreeData((prev) => {
                if (!prev) return null;
                const families = prev.families.map((f) => {
                  if (f.handle === fromFamily)
                    return {
                      ...f,
                      children: f.children.filter((c) => c !== childHandle),
                    };
                  if (f.handle === toFamily)
                    return { ...f, children: [...f.children, childHandle] };
                  return f;
                });
                supaMoveChild(childHandle, fromFamily, toFamily, prev.families);
                return { ...prev, families };
              });
            }}
            onRemoveChild={(childHandle, familyHandle) => {
              setTreeData((prev) => {
                if (!prev) return null;
                const families = prev.families.map((f) =>
                  f.handle === familyHandle
                    ? {
                        ...f,
                        children: f.children.filter((c) => c !== childHandle),
                      }
                    : f,
                );
                supaRemoveChild(childHandle, familyHandle, prev.families);
                return { ...prev, families };
              });
            }}
            onToggleLiving={(handle, isLiving) => {
              setTreeData((prev) =>
                prev
                  ? {
                      ...prev,
                      people: prev.people.map((p) =>
                        p.handle === handle ? { ...p, isLiving } : p,
                      ),
                    }
                  : null,
              );
              supaUpdatePersonLiving(handle, isLiving);
            }}
            onUpdatePerson={(handle, fields) => {
              setTreeData((prev) => {
                if (!prev) return null;
                return {
                  ...prev,
                  people: prev.people.map((p) =>
                    p.handle === handle ? { ...p, ...fields } : p,
                  ),
                };
              });
              supaUpdatePerson(handle, fields);
            }}
            onReset={async () => {
              const data = await fetchTreeData();
              setTreeData(data);
            }}
            onClose={() => {
              setEditorMode(false);
              setSelectedCard(null);
            }}
          />
        )}
      </div>

      {/* Legend */}
      <FamilyTreeLengend />

      {/* Contribute dialog */}
      {contributePerson && (
        <ContributeDialog
          personHandle={contributePerson.handle}
          personName={contributePerson.name}
          onClose={() => setContributePerson(null)}
        />
      )}
    </div>
  );
}
