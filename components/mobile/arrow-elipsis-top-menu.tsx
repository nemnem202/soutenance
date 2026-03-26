import { ArrowLeft, EllipsisVertical } from "lucide-react";
import { HistoryBackButton } from "../custom-buttons";
import MobileHeaderNavContainer from "../mobile-header-nav-container";

export default function ArrowElipsisTopMenu() {
  return (
    <MobileHeaderNavContainer>
      <HistoryBackButton />
      <EllipsisVertical />
    </MobileHeaderNavContainer>
  );
}
