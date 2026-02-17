import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Search } from "lucide-react";

export default function Searchbar() {
  return (
    <InputGroup className="max-w-100 border-none !bg-popover h-full">
      <InputGroupAddon align="inline-start">
        <Search />
      </InputGroupAddon>
      <InputGroupInput id="input-group-url" placeholder="example.com" />
    </InputGroup>
  );
}
