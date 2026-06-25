"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : ["https://loremflickr.com/800/1000/clothes"];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl2 border border-line bg-cream-deep">
        <Image src={list[active]} alt={title} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" unoptimized priority />
      </div>
      {list.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 transition ${
                i === active ? "border-clay" : "border-line hover:border-ink/40"
              }`}
            >
              <Image src={src} alt={`${title} фото ${i + 1}`} fill sizes="120px" className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
