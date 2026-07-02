// https://vike.dev/Head

import logoUrl from "../assets/logo.svg";
import zingRust from "/assets/fonts/zing-rust.woff";
import bravura from "/assets/fonts/bravura.otf";
export function Head() {
  return (
    <>
      <link rel="icon" href={logoUrl} />
      <link rel="preload" href={zingRust} as="font" type="font/woff" crossOrigin="anonymous" />
      <link rel="preload" href={bravura} as="font" type="font/otf" crossOrigin="anonymous" />
    </>
  );
}
