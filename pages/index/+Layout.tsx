import "@/stylesheets/tailwind.css";
import "@/stylesheets/general.css";
import type { ReactNode } from "react";
import Sidebar from "@/components/features/layout/app-sidebar";
import Header from "@/components/features/layout/header";
import TabBar from "@/components/features/layout/tab-bar";
import SizeAdapter from "@/components/molecules/size-adapter";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SizeAdapter
      sm={<MobileLayout>{children}</MobileLayout>}
      md={<DesktopLayout>{children}</DesktopLayout>}
    />
  );
}

function DesktopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <Sidebar />
      <Header />
      <MainPannel>{children}</MainPannel>
    </div>
  );
}

function MainPannel({ children }: { children: ReactNode }) {
  return (
    <main className="pt-20 lg:pl-70 md:pl-60 pl-0 pb-10 w-screen min-h-screen flex flex-col">
      <div className="px-6 py-5 flex-1 w-full flex flex-col min-w-0 mx-auto max-w-300">
        {children}
      </div>
    </main>
  );
}

function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-screen">
      <main className="flex-1 overflow-auto p-4 no-scrollbar flex flex-col">
        {children}
      </main>
      <TabBar />
    </div>
  );
}
