import { Button } from "@/components/ui/button";
import {
  ChevronsDownUp,
  ChevronsUpDown,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Pencil,
} from "lucide-react";

type Props = {
  collapseAll?: () => void;
  expandAll?: () => void;
  fitAll: () => void;
  zoomIn?: () => void;
  zoomOut?: () => void;
  isAdmin?: boolean;
  editorMode: boolean;
  setEditorMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  setSelectedCard: (v: any) => void;
};

export function TreeControls({
  collapseAll,
  expandAll,
  fitAll,
  zoomIn,
  zoomOut,
  isAdmin,
  editorMode,
  setEditorMode,
  setSelectedCard,
}: Props) {
  return (
    <div className="flex gap-0.5">
      {collapseAll && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          title="Thu gọn tất cả"
          onClick={collapseAll}
        >
          <ChevronsDownUp className="h-3.5 w-3.5" />
        </Button>
      )}

      {expandAll && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          title="Mở rộng tất cả"
          onClick={expandAll}
        >
          <ChevronsUpDown className="h-3.5 w-3.5" />
        </Button>
      )}

      <div className="w-px bg-border mx-0.5" />

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={zoomIn}
      >
        <ZoomIn className="h-3.5 w-3.5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={zoomOut}
      >
        <ZoomOut className="h-3.5 w-3.5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={fitAll}
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </Button>

      <div className="w-px bg-border mx-0.5" />

      {isAdmin && (
        <Button
          variant={editorMode ? "default" : "outline"}
          size="icon"
          className={`h-8 w-8 ${
            editorMode ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
          }`}
          title={editorMode ? "Tắt chỉnh sửa" : "Chế độ chỉnh sửa"}
          onClick={() => {
            setEditorMode((m) => !m);
            setSelectedCard(null);
          }}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
