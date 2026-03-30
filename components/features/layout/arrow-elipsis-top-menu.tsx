import { EllipsisVertical } from "lucide-react";
import MobileHeaderNavContainer from "./mobile-header-nav-container";
import { HistoryBackButton } from "@/components/ui/custom-buttons";

export default function ArrowElipsisTopMenu() {
  return (
    <MobileHeaderNavContainer>
      <HistoryBackButton />
      <EllipsisVertical />
    </MobileHeaderNavContainer>
  );
}
