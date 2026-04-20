import { EllipsisVertical } from "lucide-react";
import { HistoryBackButton } from "@/components/ui/custom-buttons";
import MobileHeaderNavContainer from "./mobile-header-nav-container";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/organisms/dropdown-menu";
import { ReactNode } from "react";

export default function ArrowElipsisTopMenu({ menuContent }: { menuContent: ReactNode }) {
  return (
    <MobileHeaderNavContainer>
      <HistoryBackButton />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        {menuContent}
      </DropdownMenu>
    </MobileHeaderNavContainer>
  );
}
