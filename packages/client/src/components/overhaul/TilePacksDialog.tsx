// The tile packs Game Mode's overworld and towns are drawn with live in the classic Agents panel. The new
// layout's Agents pages (desktop viewer, phone/tablet list) have no room for the panel's sections, so they
// open the same section in a dialog.
import { Suspense, lazy } from "react";
import { Modal } from "../ui/Modal";

const TilePacksSection = lazy(() =>
  import("../panels/AgentsPanel").then((module) => ({ default: module.TilePacksSection })),
);

export function TilePacksDialog({ open, onClose, title }: { open: boolean; onClose: () => void; title: string }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-md">
      <Suspense fallback={null}>
        <TilePacksSection />
      </Suspense>
    </Modal>
  );
}
