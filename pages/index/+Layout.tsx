import "@/stylesheets/tailwind.css";
import "@/stylesheets/general.css";
import { ReactNode } from "react";
import Sidebar from "@/components/app-sidebar";
import Header from "@/components/header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <Sidebar />
      <Header />
      <MainPannel>{children}</MainPannel>
    </div>
  );
}

function MainPannel({ children }: { children: ReactNode }) {
  return <main className=" pt-20 pl-70">{children}</main>;
}
