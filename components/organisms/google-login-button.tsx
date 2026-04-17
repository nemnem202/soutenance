import { Button } from "@/components/ui/button";
import useSession from "@/hooks/use-session";

export default function GoogleLoginButton() {
  const { setSession } = useSession();
  const handleConnexion = async () => {
    window.open("/api/auth/google", "google-auth", "width=500,height=600");

    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return;

      const { session } = event.data;

      if (!session) return;

      console.log("User connecté :", session);
      setSession(session);

      window.close();
    });
  };
  return (
    <Button
      variant={"outline"}
      className="rounded-full h-fit aspect-square p-2"
      onClick={handleConnexion}
    >
      <img
        data-alt-override="false"
        alt="G"
        srcSet="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw 1x, https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw 2x"
        width="24"
        height="24"
        loading="lazy"
        fetchPriority="low"
        src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw"
      ></img>
    </Button>
  );
}
