import { useLanguage } from "@/hooks/use-language";
import Searchbar from "./searchbar";
import UserAccountORLogin from "./user-account-menu-or-login-button";

export default function Header() {
  const { instance } = useLanguage();
  return (
    <header className="w-full h-20 bg-card fixed z-10 top-0 pl-70 border-b ">
      <div className="w-full h-full p-4 flex justify-between items-center gap-8">
        <div className="w-full max-w-100">
          <Searchbar placeholder={instance.getItem("browse_exercices")} />
        </div>
        <UserAccountORLogin />
      </div>
    </header>
  );
}
