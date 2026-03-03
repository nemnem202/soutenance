import logo from "../assets/logo.svg";

export default function Logo() {
  return (
    <a href="/" className="cursor-pointer ">
      <img src={logo} alt="Logo" className="h-8 w-35 hover:fill-primary" width={140} />
    </a>
  );
}
