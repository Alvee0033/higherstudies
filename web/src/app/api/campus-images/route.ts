import { NextRequest } from "next/server";

type MetadataValue = { value?: string };
type CommonsImage = {
  title?: string;
  imageinfo?: Array<{
    width?: number;
    height?: number;
    thumburl?: string;
    descriptionurl?: string;
    extmetadata?: Record<string, MetadataValue>;
  }>;
};

type CampusImage = {
  url: string;
  sourceUrl: string;
  artist: string;
  license: string;
  licenseUrl: string;
};

const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const USER_AGENT = "HigherStudyCampusImages/1.0 (https://github.com/Alvee0033)";
const REJECTED = /logo|seal|coat.of.arms|flag|map|poster|protest|occupation|demolition|construction|interior|football|portrait|hospital|medical|student|graduation/i;
const CAMPUS_SCENE = /campus|building|hall|quadrangle|quad|library|courtyard|university|college|aerial|entrance/i;

function plainText(value: string | undefined): string {
  return (value ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
    .slice(0, 120);
}

function permittedLicense(value: string): boolean {
  return /^(CC BY(?:-SA)? [234]\.0|CC0|Public domain)$/i.test(value);
}

async function searchCommons(name: string, scene: "campus" | "building"): Promise<CampusImage | null> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `filetype:bitmap intitle:"${name}" ${scene}`,
    gsrnamespace: "6",
    gsrlimit: "10",
    prop: "imageinfo",
    iiprop: "url|extmetadata|size",
    iiurlwidth: "640",
    iiextmetadatafilter: "LicenseShortName|LicenseUrl|Artist|Attribution",
  });
  const response = await fetch(`${COMMONS_API}?${params}`, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    next: { revalidate: 604800 },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) return null;
  const payload = (await response.json()) as { query?: { pages?: Record<string, CommonsImage> } };
  const expected = name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const candidates = Object.values(payload.query?.pages ?? {}).filter((page) => {
    const title = (page.title ?? "").replace(/^File:/, "");
    const normalized = title.toLowerCase().replace(/[^a-z0-9]+/g, " ");
    const image = page.imageinfo?.[0];
    const license = plainText(image?.extmetadata?.LicenseShortName?.value);
    const artist = plainText(image?.extmetadata?.Attribution?.value || image?.extmetadata?.Artist?.value);
    return normalized.includes(expected) && CAMPUS_SCENE.test(title) && !REJECTED.test(title)
      && !!image?.thumburl && !!image?.descriptionurl && (image.width ?? 0) >= 600
      && (image.width ?? 0) / Math.max(image.height ?? 1, 1) >= 1.2
      && permittedLicense(license) && (license === "CC0" || license === "Public domain" || !!artist);
  });
  candidates.sort((a, b) => {
    const score = (page: CommonsImage) => /campus|quadrangle|courtyard|aerial/i.test(page.title ?? "") ? 1 : 0;
    return score(b) - score(a);
  });
  const chosen = candidates[0]?.imageinfo?.[0];
  if (!chosen?.thumburl || !chosen.descriptionurl) return null;
  const metadata = chosen.extmetadata ?? {};
  const license = plainText(metadata.LicenseShortName?.value);
  return {
    url: chosen.thumburl,
    sourceUrl: chosen.descriptionurl,
    artist: plainText(metadata.Attribution?.value || metadata.Artist?.value) || "Wikimedia Commons",
    license,
    licenseUrl: plainText(metadata.LicenseUrl?.value) || chosen.descriptionurl,
  };
}

async function findImage(name: string): Promise<CampusImage | null> {
  try {
    return await searchCommons(name, "campus") ?? await searchCommons(name, "building");
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const names = [...new Set(request.nextUrl.searchParams.getAll("name").map((name) => name.trim()))];
  if (names.length === 0 || names.length > 20 || names.some((name) => name.length < 3 || name.length > 120 || /["<>]/.test(name))) {
    return Response.json({ error: "Provide 1–20 institution names." }, { status: 400 });
  }
  const images: Record<string, CampusImage | null> = {};
  for (let start = 0; start < names.length; start += 3) {
    await Promise.all(names.slice(start, start + 3).map(async (name) => { images[name] = await findImage(name); }));
  }
  return Response.json({ images }, { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } });
}
