export function unscramble(s: string): string {
  let r = "",
    p: string;
  while (s.length > 51) {
    p = s.substring(0, 50);
    s = s.substring(50);
    r = r + obfusc50(p);
  }
  r = r + s;
  r = r.replace(/Kcl/g, "| x").replace(/LZ/g, " |").replace(/XyQ/g, "   ");
  return r;
}

export function obfusc50(s: string): string {
  const newString = s.split("");
  for (let i = 0; i < 5; i++) {
    [newString[i], newString[49 - i]] = [s[49 - i], s[i]];
  }
  for (let i = 10; i < 24; i++) {
    [newString[i], newString[49 - i]] = [s[49 - i], s[i]];
  }
  return newString.join("");
}
