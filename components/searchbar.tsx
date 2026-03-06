import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Search } from "lucide-react";

interface SearchbarProps {
  placeholder: string;
}

export default function Searchbar({ ...props }: SearchbarProps) {
  return (
    <InputGroup className="w-full h-full">
      <InputGroupAddon align="inline-start" className="pl-3">
        <Search />
      </InputGroupAddon>
      <InputGroupInput id="input-group-url" placeholder={props.placeholder} className="!text-left" />
    </InputGroup>
  );
}
