import BasicDropdown from "./dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { History, icons, Search } from "lucide-react";

interface SearchbarProps {
  placeholder: string;
}

const items = [
  { id: 1, label: "Small", icon: <History className="stroke-muted-foreground w-5" /> },
  { id: 2, label: "Medium", icon: <History className="stroke-muted-foreground w-5" /> },
  { id: 3, label: "Large", icon: <History className="stroke-muted-foreground w-5" /> },
  { id: 4, label: "Extra Large", icon: <History className="stroke-muted-foreground w-5" /> },
];

export default function Searchbar({ ...props }: SearchbarProps) {
  return (
    <>
      <BasicDropdown items={items} label={"oeoe"} className="w-full">
        <InputGroup className="w-full h-full">
          <InputGroupAddon align="inline-start" className="pl-3">
            <Search />
          </InputGroupAddon>
          <InputGroupInput id="input-group-url" placeholder={props.placeholder} className="!text-left" />
        </InputGroup>
      </BasicDropdown>
    </>
  );
}
