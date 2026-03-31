function parseCookie(str: string): Record<string, string> {
  return Object.fromEntries(
    str.split(";").map((p) => {
      const idx = p.indexOf("=");
      return [
        decodeURIComponent(p.slice(0, idx).trim()),
        decodeURIComponent(p.slice(idx + 1).trim()),
      ];
    }),
  );
}

export default async function getCurrentUserFromCookie(
  cookie: string,
): Promise<{ id: number } | null> {
  return null;
}
