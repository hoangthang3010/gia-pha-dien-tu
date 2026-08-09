import { ZoomLevel } from "@/app/(main)/tree/tree-client";
import { CARD_H, CARD_W, PositionedNode } from "@/lib/tree-layout";
import { ChevronDown, ChevronRight } from "lucide-react";
import { memo } from "react";

// === Person Card Component (memoized) ===
export const MemoPersonCard = memo(
  PersonCard,
  (prev, next) =>
    prev.item === next.item &&
    prev.isHighlighted === next.isHighlighted &&
    prev.isFocused === next.isFocused &&
    prev.isHovered === next.isHovered &&
    prev.isSelected === next.isSelected &&
    prev.showCollapseToggle === next.showCollapseToggle &&
    prev.isCollapsed === next.isCollapsed,
);
function PersonCard({
  item,
  isHighlighted,
  isFocused,
  isHovered,
  isSelected,
  zoomLevel,
  showCollapseToggle,
  isCollapsed,
  onHover,
  onClick,
  onSetFocus,
  onToggleCollapse,
}: {
  item: PositionedNode;
  isHighlighted: boolean;
  isFocused: boolean;
  isHovered: boolean;
  isSelected: boolean;
  zoomLevel?: ZoomLevel;
  showCollapseToggle: boolean;
  isCollapsed: boolean;
  onHover: (h: string | null) => void;
  onClick: (handle: string, x: number, y: number) => void;
  onSetFocus: (handle: string) => void;
  onToggleCollapse: (handle: string) => void;
}) {
  const { x, y } = item || {};

  const {
    gender = 1,
    isLiving,
    isPatrilineal,
    handle,
    displayName,
    birthYear,
    deathYear,
  } = item?.node || {};

  const generation = item.generation;

  const isMale = gender === 1;
  const isFemale = gender === 2;
  const isDead = !isLiving;
  const isPatri = isPatrilineal;

  // ── Color system ──
  const dotColor = !isPatri
    ? "#94a3b8"
    : isMale
      ? "#818cf8"
      : isFemale
        ? "#f472b6"
        : "#94a3b8";

  // F1: MINI zoom → just a colored dot with tooltip
  if (zoomLevel === "mini") {
    return (
      <div
        className="absolute group"
        style={{
          left: x + CARD_W / 2 - 6,
          top: y + CARD_H / 2 - 6,
          width: 12,
          height: 12,
        }}
        onMouseEnter={() => onHover(handle)}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          onClick(handle, x + CARD_W, y + CARD_H / 2);
        }}
      >
        <div
          className="w-3 h-3 rounded-full shadow-sm"
          style={{ backgroundColor: dotColor }}
        />
        {/* Tooltip on hover */}
        <div
          className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 z-50
                    bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none"
        >
          {displayName} · Đời {item.generation + 1}
        </div>
      </div>
    );
  }

  // Extract initials
  const nameParts = displayName?.split(" ");
  const initials =
    nameParts?.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts?.length - 1][0]).toUpperCase()
      : displayName?.slice(0, 2).toUpperCase();

  const avatarBg = !isPatri
    ? "bg-stone-300 text-stone-600"
    : isMale
      ? isDead
        ? "bg-indigo-300 text-indigo-800"
        : "bg-indigo-400 text-white"
      : isFemale
        ? isDead
          ? "bg-rose-300 text-rose-800"
          : "bg-rose-400 text-white"
        : "bg-slate-300 text-slate-600";

  const bgClass = !isPatri
    ? "from-stone-50 to-stone-100 border-stone-300/80 border-dashed"
    : isDead
      ? isMale
        ? "from-indigo-50/60 to-slate-50 border-indigo-300/60"
        : "from-rose-50/60 to-slate-50 border-rose-300/60"
      : isMale
        ? "from-indigo-50 to-violet-50 border-indigo-300"
        : isFemale
          ? "from-rose-50 to-pink-50 border-rose-300"
          : "from-slate-50 to-slate-100 border-slate-300";

  const glowClass = isSelected
    ? "ring-2 ring-blue-500 ring-offset-2 shadow-blue-200 shadow-lg"
    : isHighlighted
      ? "ring-2 ring-amber-400 ring-offset-2"
      : isFocused
        ? "ring-2 ring-indigo-400 ring-offset-2"
        : isHovered
          ? "ring-1 ring-indigo-200"
          : "";

  // F1: COMPACT zoom → smaller card with just name + gen
  if (zoomLevel === "compact") {
    return (
      <div
        className={`absolute rounded-lg border bg-gradient-to-br shadow-sm transition-all duration-200
                    cursor-pointer hover:shadow-md ${bgClass} ${glowClass}
                    ${isDead ? "opacity-70" : ""} ${!isPatri ? "opacity-80" : ""}`}
        style={{ width: CARD_W, height: CARD_H }}
        onMouseEnter={() => onHover(handle)}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          onClick(handle, x + CARD_W, y + CARD_H / 2);
        }}
      >
        <div className="px-2 py-1.5 h-full flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center
                        font-bold text-[9px] shadow-sm ring-1 ring-black/5 ${avatarBg} flex-shrink-0`}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[10px] leading-tight text-slate-800 truncate">
              {displayName}
            </p>
            <span className="text-[8px] font-semibold px-0.5 py-px rounded bg-amber-100 text-amber-700">
              Đời {item.generation + 1}
            </span>
          </div>
        </div>
        {/* Collapse toggle */}
        {showCollapseToggle && (
          <button
            className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-10 w-5 h-5 rounded-full
                            bg-white border border-slate-300 shadow-sm flex items-center justify-center
                            hover:bg-slate-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse(handle);
            }}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3 text-slate-500" />
            ) : (
              <ChevronDown className="w-3 h-3 text-slate-500" />
            )}
          </button>
        )}
      </div>
    );
  }

  // F1: FULL zoom → original detailed card
  return (
    <div
      className={`absolute rounded-xl border-[1.5px] bg-gradient-to-br shadow-sm transition-all duration-200
                cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${bgClass} ${glowClass}
                ${isDead ? "opacity-70" : ""} ${!isPatri ? "opacity-80" : ""}`}
      style={{ width: CARD_W, height: CARD_H }}
      onMouseEnter={() => onHover(handle)}
      onMouseLeave={() => onHover(null)}
      onClick={(e) => {
        e.stopPropagation();
        onClick(handle, x + CARD_W, y + CARD_H / 2);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onSetFocus(handle);
      }}
    >
      <div className="px-2.5 py-2 h-full flex items-center gap-2.5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center
                        font-bold text-sm shadow-sm ring-1 ring-black/5 ${avatarBg} ${isDead ? "opacity-60" : ""}`}
          >
            {initials}
          </div>
          {isPatri && (
            <span
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500
                            text-white text-[8px] flex items-center justify-center shadow-sm font-bold ring-1 ring-white"
            >
              Nguyễn
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[11px] leading-tight text-slate-800 truncate">
            {displayName}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {birthYear
              ? `${birthYear}${deathYear ? ` — ${deathYear}` : isLiving ? " — nay" : ""}`
              : "—"}
          </p>
          <div className="mt-0.5 flex items-center gap-1">
            <span className="text-[9px] font-semibold px-1 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200/60">
              Đời {item.generation + 1}
            </span>
            {isDead ? (
              <span className="text-[9px] text-slate-400">✝ Đã mất</span>
            ) : (
              <span className="text-[9px] text-emerald-600 font-medium">
                ● Còn sống
              </span>
            )}
            {!isPatri && (
              <span className="text-[9px] text-slate-400 ml-0.5">
                · Ngoại tộc
              </span>
            )}
          </div>
        </div>
      </div>

      {/* F4: Collapse toggle button */}
      {showCollapseToggle && (
        <button
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-6 h-6 rounded-full
                        bg-white border border-slate-300 shadow-sm flex items-center justify-center
                        hover:bg-amber-50 hover:border-amber-400 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse(handle);
          }}
          title={isCollapsed ? "Mở rộng nhánh" : "Thu gọn nhánh"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>
      )}
    </div>
  );
}
