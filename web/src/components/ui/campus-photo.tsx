import Image from "next/image";
import type { CampusImage } from "@/hooks/use-campus-images";

export function CampusPhoto({ image, institution, className = "" }: {
  image: CampusImage | null | undefined;
  institution: string;
  className?: string;
}) {
  if (!image) return null;
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={image.url} alt={`Campus image associated with ${institution}`} fill unoptimized sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 33vw" className="object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#082b53]/85 to-transparent px-3 pb-2 pt-8 text-[10px] text-white">
        <a href={image.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-blue-100">Photo: {image.artist}</a>
        <span aria-hidden="true"> · </span>
        <a href={image.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-blue-100">{image.license}</a>
      </div>
    </div>
  );
}
