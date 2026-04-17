// https://vike.dev/Head

import logoUrl from "../assets/logo.svg";
import font from "/assets/fonts/zing-rust.woff";

export function Head() {
  return (
    <>
      <link rel="icon" href={logoUrl} />
      <link rel="preload" href={font} as="font" type="font/woff" crossOrigin="anonymous" />
    </>
  );
}
