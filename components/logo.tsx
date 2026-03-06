import logo from "../assets/logo.svg";

export default function Logo() {
  return (
    <a href="/" className="cursor-pointer ">
      <img src={logo} alt="Logo" className=" w-50 hover:fill-primary" width={200} />
    </a>
  );
}
