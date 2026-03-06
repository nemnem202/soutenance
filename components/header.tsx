import Searchbar from "./searchbar";
import UserAccountORLogin from "./user-account-menu-or-login-button";

export default function Header() {
  return (
    <header className="w-full h-20 bg-card fixed z-1 top-0 pl-70 border-b ">
      <div className="w-full h-full p-4 flex justify-between items-center gap-8">
        <div className="w-full max-w-100">
          <Searchbar placeholder="Browse exercices" />
        </div>
        <UserAccountORLogin />
      </div>
    </header>
  );
}
