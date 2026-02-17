import Searchbar from "./searchbard";

export default function Header() {
  return (
    <header className="w-full h-20 bg-background fixed z-1 top-0 pl-70 border-b ">
      <div className="w-full h-full p-4 flex justify-between items-center">
        <Searchbar />
        <div className="rounded-full bg-primary aspect-square h-10 flex items-center justify-center">N</div>
      </div>
    </header>
  );
}
