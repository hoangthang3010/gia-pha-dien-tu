import { TreeNode } from "@/lib/tree-layout";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Crosshair,
  Eye,
  Link,
  MessageSquarePlus,
  User,
  X,
} from "lucide-react";

function MenuAction({
  icon,
  label,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 active:bg-slate-100
                transition-colors text-left group"
      onClick={onClick}
    >
      <span className="text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-slate-700 group-hover:text-slate-900">
          {label}
        </p>
        <p className="text-[10px] text-slate-400">{desc}</p>
      </div>
    </button>
  );
}

// === Context Menu Card ===
export default function ContextMenuCard({ data }: { data: any }) {
  const {
    onViewDetail,
    onShowDescendants,
    onShowAncestors,
    onSetFocus,
    onShowFull,
    onCopyLink,
    onContribute,
    onClose,
    displayName,
    isPatrilineal,
    gender,
  } = data;
  return (
    <div
      className="animate-in fade-in zoom-in-95 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white/95 backdrop-blur-lg border border-slate-200 rounded-xl shadow-xl
                py-1.5 min-w-[200px] overflow-hidden"
      >
        {/* Header */}
        <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                            ${
                              isPatrilineal
                                ? gender === 1
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-pink-100 text-pink-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
            >
              {displayName
                .split(" ")
                .map((w: string) => w[0])
                .join("")
                .slice(0, 2)}
            </div>
            <span className="text-sm font-semibold text-slate-800 truncate max-w-[130px]">
              {displayName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Actions */}
        <div className="py-1">
          <MenuAction
            icon={<User className="w-4 h-4" />}
            label="Xem chi tiết"
            desc="Mở trang cá nhân"
            onClick={onViewDetail}
          />
          <MenuAction
            icon={<ArrowDownToLine className="w-4 h-4" />}
            label="Con cháu từ đây"
            desc="Hiển thị cây con cháu"
            onClick={onShowDescendants}
          />
          <MenuAction
            icon={<ArrowUpFromLine className="w-4 h-4" />}
            label="Tổ tiên"
            desc="Hiển thị dòng tổ tiên"
            onClick={onShowAncestors}
          />
          <MenuAction
            icon={<Crosshair className="w-4 h-4" />}
            label="Căn giữa"
            desc="Di chuyển tới vị trí"
            onClick={onSetFocus}
          />
          <div className="border-t border-slate-100 my-1" />
          <MenuAction
            icon={<Link className="w-4 h-4" />}
            label="Sao chép link Con cháu"
            desc="Chia sẻ link cây con cháu"
            onClick={onCopyLink}
          />
          <MenuAction
            icon={<Eye className="w-4 h-4" />}
            label="Toàn cảnh"
            desc="Hiển thị toàn bộ cây"
            onClick={onShowFull}
          />
          <div className="border-t border-slate-100 my-1" />
          <MenuAction
            icon={<MessageSquarePlus className="w-4 h-4" />}
            label="Đóng góp thông tin"
            desc="Bổ sung thông tin về người này"
            onClick={onContribute}
          />
        </div>
      </div>
    </div>
  );
}
