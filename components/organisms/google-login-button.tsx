import { Button } from "@/components/ui/button";

export default function GoogleLoginButton() {
  const handleConnexion = async () => {
    window.location.href = "/api/auth/google";
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
