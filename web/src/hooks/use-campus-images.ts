"use client";

import * as React from "react";

export type CampusImage = {
  url: string;
  sourceUrl: string;
  artist: string;
  license: string;
  licenseUrl: string;
};

// In-memory global cache across component mounts and navigation
const memoryCache = new Map<string, CampusImage | null>();

export function useCampusImages(names: string[]): Record<string, CampusImage | null> {
  const key = React.useMemo(() => {
    return [...new Set(names.filter(Boolean))].slice(0, 20).sort().join("\u0000");
  }, [names]);

  // Synchronously initialize any already cached images from memory or sessionStorage
  const [images, setImages] = React.useState<Record<string, CampusImage | null>>({});

  React.useEffect(() => {
    if (!key) return;

    const list = key.split("\u0000").filter(Boolean);
    const initialSync: Record<string, CampusImage | null> = {};
    const missing: string[] = [];

    for (const name of list) {
      if (memoryCache.has(name)) {
        initialSync[name] = memoryCache.get(name)!;
      } else {
        let foundInStorage = false;
        try {
          const stored = sessionStorage.getItem(`hs_campus_img_${name}`);
          if (stored !== null) {
            const parsed = stored === "null" ? null : JSON.parse(stored);
            memoryCache.set(name, parsed);
            initialSync[name] = parsed;
            foundInStorage = true;
          }
        } catch {
          // ignore
        }
        if (!foundInStorage) {
          missing.push(name);
        }
      }
    }

    let syncFrame: number | undefined;
    if (Object.keys(initialSync).length > 0) {
      syncFrame = requestAnimationFrame(() => setImages((prev) => {
        let changed = false;
        const next = { ...prev };
        for (const [k, v] of Object.entries(initialSync)) {
          if (next[k] !== v) {
            next[k] = v;
            changed = true;
          }
        }
        return changed ? next : prev;
      }));
    }

    if (missing.length === 0) {
      return () => { if (syncFrame !== undefined) cancelAnimationFrame(syncFrame); };
    }

    const controller = new AbortController();
    const params = new URLSearchParams();
    missing.forEach((name) => params.append("name", name));

    fetch(`/api/campus-images?${params}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() as Promise<{ images: Record<string, CampusImage | null> }> : Promise.reject()))
      .then((payload) => {
        if (!payload?.images) return;
        const fetched = payload.images;

        Object.entries(fetched).forEach(([name, img]) => {
          memoryCache.set(name, img);
          try {
            sessionStorage.setItem(`hs_campus_img_${name}`, img ? JSON.stringify(img) : "null");
          } catch {
            // ignore
          }
          if (img?.url && typeof window !== "undefined") {
            const preloadImg = new Image();
            preloadImg.src = img.url;
          }
        });

        setImages((prev) => {
          let changed = false;
          const next = { ...prev };
          for (const [k, v] of Object.entries(fetched)) {
            if (next[k] !== v) {
              next[k] = v;
              changed = true;
            }
          }
          return changed ? next : prev;
        });
      })
      .catch(() => {
        // preserve state
      });

    return () => {
      controller.abort();
      if (syncFrame !== undefined) cancelAnimationFrame(syncFrame);
    };
  }, [key]);

  return images;
}
