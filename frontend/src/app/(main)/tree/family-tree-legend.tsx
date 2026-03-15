export default function FamilyTreeLengend() {
  return (
    <div className="flex gap-3 text-[10px] text-muted-foreground pt-1.5 px-1 flex-wrap">
      <span className="flex items-center gap-1">
        <span className="w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-400" />{" "}
        Nam (chính tộc)
      </span>
      <span className="flex items-center gap-1">
        <span className="w-2.5 h-2.5 rounded-sm bg-pink-100 border border-pink-400" />{" "}
        Nữ (chính tộc)
      </span>
      <span className="flex items-center gap-1">
        <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-dashed border-slate-300" />{" "}
        Ngoại tộc
      </span>
      <span className="flex items-center gap-1">
        <span className="text-red-500">❤</span> Vợ chồng
      </span>
      <span className="flex items-center gap-1 opacity-60">
        <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 border border-slate-400" />{" "}
        Đã mất
      </span>
      <span className="ml-auto opacity-50">
        Cuộn để zoom • Kéo để di chuyển • Nhấn để xem
      </span>
    </div>
  );
}
