import "@/stylesheets/tailwind.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>game layout </h1>
      {children}
    </div>
  );
}
