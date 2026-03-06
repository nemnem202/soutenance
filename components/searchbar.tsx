import BasicDropdown from "./dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Search } from "lucide-react";
import useSearchbar from "@/hooks/use-searchbar";
import { navigate } from "vike/client/router";
export interface SearchbarProps {
  placeholder: string;
}

export default function Searchbar({ ...props }: SearchbarProps) {
  const { items, handleInputValueChange, searchbarValue, setSearchbarValue, placeholder, setPlaceholder } =
    useSearchbar(props);

  return (
    <BasicDropdown
      items={items}
      label={"searchbar-dropdown"}
      className="w-full"
      onItemClick={(item) => {
        setSearchbarValue(item.label);
        navigate("/search/" + item.label);
      }}
      onFocusChange={(item) => {
        setPlaceholder(item.label);
      }}
    >
      <InputGroup
        className="w-full h-full"
        onKeyDownCapture={(e) => {
          if (e.key.toLowerCase() === "enter") navigate("/search/" + searchbarValue);
        }}
      >
        <InputGroupAddon align="inline-start" className="pl-3">
          <Search />
        </InputGroupAddon>

        <InputGroupInput
          id="input-group-url"
          placeholder={placeholder}
          className="!text-left"
          onChange={handleInputValueChange}
          autoComplete="off"
          value={searchbarValue}
          onBlur={() => setPlaceholder(props.placeholder)}
        />
      </InputGroup>
    </BasicDropdown>
  );
}
