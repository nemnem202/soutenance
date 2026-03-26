import { ArrowLeft, EllipsisVertical } from "lucide-react";
import { HistoryBackButton } from "../custom-buttons";

export default function ArrowElipsisTopMenu() {
  return (
    <div className="w-full p-2 pb-0 flex justify-between">
      <HistoryBackButton />

      <EllipsisVertical />
    </div>
  );
}
