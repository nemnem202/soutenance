// https://vike.dev/Head

import logoUrl from "../assets/logo.svg";

export function Head() {
  return (
    <>
      <link rel="icon" href={logoUrl} />
      <link
        rel="preload"
        href="/assets/fonts/zing-rust.woff"
        as="font"
        type="font/woff"
        crossOrigin="anonymous"
      />
    </>
  );
}
