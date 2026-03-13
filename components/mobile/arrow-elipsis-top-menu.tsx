import { ArrowLeft, EllipsisVertical } from "lucide-react";

export default function ArrowElipsisTopMenu() {
  return (
    <div className="w-full p-2 pb-0 flex justify-between">
      <button onClick={() => window.history.back()}>
        <ArrowLeft />
      </button>

      <EllipsisVertical />
    </div>
  );
}
