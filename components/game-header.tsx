import Logo from "./logo";
import UserAccountORLogin from "./user-account-menu-or-login-button";

export default function Header() {
  return (
    <header className="w-full h-20 bg-background  border-b p-4 flex justify-between items-center gap-8 select-none">
      <Logo />
      <UserAccountORLogin />
    </header>
  );
}
