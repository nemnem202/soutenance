import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Search } from "lucide-react";

interface SearchbarProps {
  placeholder: string;
}

export default function Searchbar({ ...props }: SearchbarProps) {
  return (
    <InputGroup className="w-full border-none !bg-popover h-full">
      <InputGroupAddon align="inline-start">
        <Search />
      </InputGroupAddon>
      <InputGroupInput id="input-group-url" placeholder={props.placeholder} />
    </InputGroup>
  );
}
