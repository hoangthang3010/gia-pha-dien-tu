import { Suspense } from "react";
import B from "./tree-client";
import A from "./tree-client-normal";
import "./styles.css";

export const dynamic = "force-dynamic";

export default function TreePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-muted-foreground">Đang tải gia phả...</div>
        </div>
      }
    >
      <A />
      <B />
    </Suspense>
  );
}
