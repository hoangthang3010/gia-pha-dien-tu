import { TreeFamily, TreeNode } from "@/lib/tree-layout";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Pencil,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Popover } from "radix-ui";
import { useEffect, useRef, useState } from "react";

// === Editor Panel Component ===
export default function EditorPanel({
  selectedCard,
  treeData,
  onReorderChildren,
  onMoveChild,
  onRemoveChild,
  onToggleLiving,
  onUpdatePerson,
  onReset,
  onClose,
}: {
  selectedCard: string | null;
  treeData: { people: TreeNode[]; families: TreeFamily[] } | null;
  onReorderChildren: (familyHandle: string, newOrder: string[]) => void;
  onMoveChild: (
    childHandle: string,
    fromFamily: string,
    toFamily: string,
  ) => void;
  onRemoveChild: (childHandle: string, familyHandle: string) => void;
  onToggleLiving: (handle: string, isLiving: boolean) => void;
  onUpdatePerson: (handle: string, fields: Record<string, unknown>) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const [editName, setEditName] = useState("");
  const [editBirthYear, setEditBirthYear] = useState("");
  const [editDeathYear, setEditDeathYear] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parentSearch, setParentSearch] = useState("");
  const [showParentDropdown, setShowParentDropdown] = useState(false);
  const parentSearchRef = useRef<HTMLDivElement>(null);

  if (!treeData) return null;

  const person: TreeNode | null | undefined = selectedCard
    ? treeData.people.find((p) => p.handle === selectedCard)
    : null;

  // Sync local state when selection changes
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (person) {
      setEditName(person.displayName || "");
      setEditBirthYear(person.birthYear?.toString() || "");
      setEditDeathYear(person.deathYear?.toString() || "");
      setDirty(false);
      setParentSearch("");
      setShowParentDropdown(false);
    }
  }, [person?.handle]);

  // Close parent dropdown on outside click
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        parentSearchRef.current &&
        !parentSearchRef.current.contains(e.target as Node)
      ) {
        setShowParentDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Find the family where this person is a parent
  const parentFamily = person
    ? treeData.families.find(
        (f) =>
          f.fatherHandle === person.handle || f.motherHandle === person.handle,
      )
    : null;

  // Find the family where this person is a child
  const childOfFamily = person
    ? treeData.families.find((f) => f.children.includes(person.handle))
    : null;

  console.log(childOfFamily);

  // Get parent person name
  const parentPerson = childOfFamily
    ? treeData.people.find(
        (p) =>
          p.handle === childOfFamily.fatherHandle ||
          p.handle === childOfFamily.motherHandle,
      )
    : null;

  // Children of the selected person's family
  const children = parentFamily
    ? (parentFamily.children
        .map((ch) => treeData.people.find((p) => p.handle === ch))
        .filter(Boolean) as TreeNode[])
    : [];

  // All families (for "change parent" dropdown) with labels
  const allParentFamilies = treeData.families.filter(
    (f) => f.fatherHandle || f.motherHandle,
  );
  const parentFamiliesWithLabels = allParentFamilies.map((f) => {
    const father = treeData.people.find((p) => p.handle === f.fatherHandle);
    const gen = father ? (father as TreeNode).generation : "";
    const label = father ? father.displayName : f.handle;
    return { ...f, label, gen };
  });
  console.log(parentFamiliesWithLabels);

  // Filter parent families by search term
  const filteredParentFamilies = parentSearch.trim()
    ? parentFamiliesWithLabels.filter(
        (f) =>
          f.label.toLowerCase().includes(parentSearch.toLowerCase()) ||
          f.handle.toLowerCase().includes(parentSearch.toLowerCase()),
      )
    : parentFamiliesWithLabels;

  const handleSave = async () => {
    if (!person || !dirty) return;
    setSaving(true);
    const fields: Record<string, unknown> = {};
    if (editName !== person.displayName) fields.displayName = editName;
    const newBirth = editBirthYear ? parseInt(editBirthYear) : null;
    if (newBirth !== (person.birthYear ?? null)) fields.birthYear = newBirth;
    const newDeath = editDeathYear ? parseInt(editDeathYear) : null;
    if (newDeath !== (person.deathYear ?? null)) fields.deathYear = newDeath;
    if (Object.keys(fields).length > 0) {
      onUpdatePerson(person.handle, fields);
    }
    setDirty(false);
    setSaving(false);
  };

  return (
    <div className="w-72 bg-background border-l flex flex-col overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-blue-50">
        <div className="flex items-center gap-2">
          <Pencil className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">Chỉnh sửa</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onReset}
            title="Khôi phục gốc"
            className="p-1 rounded hover:bg-blue-100 text-blue-600"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-blue-100 text-blue-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {!person ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-muted-foreground text-center">
            Nhấn vào một card trên cây để chọn và chỉnh sửa
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Editable person info */}
          <div className="p-3 border-b space-y-2">
            <p className="text-xs text-muted-foreground">
              Đời {person.generation ?? "?"} · {person.handle}
            </p>
            {parentPerson && (
              <p className="text-xs text-muted-foreground">
                Cha:{" "}
                <span className="font-medium text-foreground">
                  {parentPerson.displayName}
                </span>
              </p>
            )}

            {/* Editable Name */}
            <div>
              <label className="text-xs text-muted-foreground">Họ tên</label>
              <input
                className="w-full border rounded px-2 py-1 text-sm bg-background"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  setDirty(true);
                }}
              />
            </div>

            {/* Birth / Death Year */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">
                  Năm sinh
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1 text-sm bg-background"
                  value={editBirthYear}
                  onChange={(e) => {
                    setEditBirthYear(e.target.value);
                    setDirty(true);
                  }}
                  placeholder="—"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Năm mất</label>
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1 text-sm bg-background"
                  value={editDeathYear}
                  onChange={(e) => {
                    setEditDeathYear(e.target.value);
                    setDirty(true);
                  }}
                  placeholder="—"
                />
              </div>
            </div>

            {/* Living status */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Trạng thái:</span>
              <button
                className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                  person.isLiving
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
                onClick={() => onToggleLiving(person.handle, !person.isLiving)}
              >
                {person.isLiving ? "● Còn sống" : "○ Đã mất"}
              </button>
            </div>

            {/* Save button */}
            {dirty && (
              <button
                className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            )}
          </div>

          {/* Children reorder */}
          {parentFamily && children.length > 0 && (
            <div className="p-3 border-b">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Con ({children.length})
              </p>
              <div className="space-y-1">
                {children.map((child, idx) => (
                  <div
                    key={child.handle}
                    className="flex items-center gap-1 group"
                  >
                    <GripVertical className="h-3 w-3 text-muted-foreground/40" />
                    <span className="flex-1 text-xs truncate">
                      {child.displayName}
                    </span>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {idx > 0 && (
                        <button
                          className="p-0.5 rounded hover:bg-muted"
                          title="Lên"
                          onClick={() => {
                            const newOrder = [...parentFamily.children];
                            [newOrder[idx - 1], newOrder[idx]] = [
                              newOrder[idx],
                              newOrder[idx - 1],
                            ];
                            onReorderChildren(parentFamily.handle, newOrder);
                          }}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                      )}
                      {idx < children.length - 1 && (
                        <button
                          className="p-0.5 rounded hover:bg-muted"
                          title="Xuống"
                          onClick={() => {
                            const newOrder = [...parentFamily.children];
                            [newOrder[idx], newOrder[idx + 1]] = [
                              newOrder[idx + 1],
                              newOrder[idx],
                            ];
                            onReorderChildren(parentFamily.handle, newOrder);
                          }}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        className="p-0.5 rounded hover:bg-red-100 text-red-500"
                        title="Xóa liên kết"
                        onClick={() => {
                          if (
                            confirm(
                              `Xóa "${child.displayName}" khỏi danh sách con?`,
                            )
                          ) {
                            onRemoveChild(child.handle, parentFamily.handle);
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Change parent — searchable */}
          {childOfFamily && (
            <div className="p-3 border-b" ref={parentSearchRef}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Đổi cha
              </p>

              {/* Current parent display */}
              <p className="text-xs text-muted-foreground mb-1">
                Hiện tại:{" "}
                <span className="font-medium text-foreground">
                  {parentPerson?.displayName ?? childOfFamily.handle}
                </span>
              </p>

              {/* Searchable input */}
              <div className="relative">
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1 text-xs bg-background placeholder:text-muted-foreground/60"
                  placeholder="🔍 Tìm cha mới..."
                  value={parentSearch}
                  onChange={(e) => {
                    setParentSearch(e.target.value);
                    setShowParentDropdown(true);
                  }}
                  onFocus={() => setShowParentDropdown(true)}
                />
                {showParentDropdown && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border rounded shadow-lg max-h-48 overflow-y-auto">
                    {filteredParentFamilies.length === 0 ? (
                      <div className="px-2 py-2 text-xs text-muted-foreground text-center">
                        Không tìm thấy
                      </div>
                    ) : (
                      filteredParentFamilies.map((f) => {
                        const isSelected = f.handle === childOfFamily.handle;
                        return (
                          <button
                            key={f.handle}
                            className={`w-full text-left px-2 py-1.5 text-xs hover:bg-blue-50 flex items-center gap-1 transition-colors ${isSelected ? "bg-blue-100 font-semibold text-blue-700" : ""}`}
                            onClick={() => {
                              if (f.handle !== childOfFamily.handle) {
                                onMoveChild(
                                  person.handle,
                                  childOfFamily.handle,
                                  f.handle,
                                );
                              }
                              setShowParentDropdown(false);
                              setParentSearch("");
                            }}
                          >
                            <span className="truncate flex-1">{f.label}</span>
                            <span className="text-muted-foreground/60 shrink-0">
                              Đ{f.gen}
                            </span>
                            {isSelected && (
                              <span className="text-blue-600 shrink-0">✓</span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
