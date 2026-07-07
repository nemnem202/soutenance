import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/molecules/input-group";

export default function NewGameLinkInput() {
  return (
    <InputGroup
      className={
        "h-15 paragraph text-[1.2rem]! flex items-center focus-within:bg-primary/20! p-2 group rounded-lg"
      }
    >
      <InputGroupInput
        id="link-input"
        value={"https://tailwindcss.com/docs/border-radius#creating-pill-buttons"}
        className="size-full flex items-center border-none! shadow-none! outline-none! "
        tabIndex={0}
        autoFocus
      />
      <InputGroupButton className="rounded-md h-full bg-secondary/80 opacity-60 group-focus-within:opacity-100 hover:bg-secondary min-w-20 rounded-sm">
        Send
      </InputGroupButton>
    </InputGroup>
  );
}
