/** Only a stored Scholar author ID is presented as a direct profile. */
export function scholarLink(name: string, institution: string, profileUrl?: string | null) {
  if (profileUrl) {
    try {
      const url = new URL(profileUrl);
      if (url.protocol === "https:" && url.hostname === "scholar.google.com" && url.pathname === "/citations" && /^[\w-]+$/.test(url.searchParams.get("user") ?? "") && !url.username && !url.password) {
        return { href: `https://scholar.google.com/citations?user=${encodeURIComponent(url.searchParams.get("user")!)}&hl=en`, label: "Google Scholar", confirmed: true };
      }
    } catch { /* Invalid stored links fall back to an explicitly labelled author search. */ }
  }
  const params = new URLSearchParams({ view_op: "search_authors", mauthors: [name, institution].filter(Boolean).join(" "), hl: "en" });
  return { href: `https://scholar.google.com/citations?${params}`, label: "Find on Scholar", confirmed: false };
}
