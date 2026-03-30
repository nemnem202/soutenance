import BasicDropdown from "./animated-dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../molecules/input-group";
import { Search } from "lucide-react";
import useSearchbar from "@/hooks/use-searchbar";
import { navigate } from "vike/client/router";
import { useState } from "react";
export interface SearchbarProps {
  placeholder: string;
}

export default function Searchbar({ ...props }: SearchbarProps) {
  const {
    items,
    handleInputValueChange,
    searchbarValue,
    setSearchbarValue,
    placeholder,
    setPlaceholder,
  } = useSearchbar(props);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <BasicDropdown
      items={items}
      label={"searchbar-dropdown"}
      className="w-full"
      onItemClick={(item) => {
        setSearchbarValue(item.label);
        navigate(`/search/${item.label}`);
      }}
      onFocusChange={(item) => {
        if (!item) return setPlaceholder(props.placeholder);
        setPlaceholder(item.label);
      }}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <InputGroup
        className="w-full h-full"
        onKeyDownCapture={(e) => {
          if (e.key.toLowerCase() === "enter")
            navigate(`/search/${searchbarValue}`);
        }}
      >
        <InputGroupAddon align="inline-start" className="pl-3">
          <Search />
        </InputGroupAddon>

        <InputGroupInput
          id="input-group-url"
          placeholder={placeholder}
          className="!text-left"
          onChange={(e) => {
            handleInputValueChange(e);
            setPlaceholder(props.placeholder);
            setIsOpen(true);
          }}
          autoComplete="off"
          value={searchbarValue}
          onBlur={() => setPlaceholder(props.placeholder)}
        />
      </InputGroup>
    </BasicDropdown>
  );
}
