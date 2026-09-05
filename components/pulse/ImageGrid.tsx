'use client';

import React, { useState } from 'react';

interface ImageGridProps {
  images: string[];
}

export function ImageGrid({ images }: ImageGridProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (images.length === 0) return null;

  const gridClass =
    images.length === 1
      ? 'grid-cols-1'
      : images.length === 2
        ? 'grid-cols-2'
        : images.length === 3
          ? 'grid-cols-2'
          : 'grid-cols-2';

  return (
    <>
      <div className={`grid ${gridClass} gap-1 rounded-2xl overflow-hidden border border-white/8`}>
        {images.slice(0, 4).map((src, i) => (
          <div
            key={i}
            className={`relative overflow-hidden cursor-pointer ${
              images.length === 1
                ? 'aspect-video'
                : images.length === 3 && i === 0
                  ? 'row-span-2 aspect-[3/4]'
                  : 'aspect-square'
            }`}
            onClick={() => setLightboxIdx(i)}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxIdx(null)}
        >
          <img
            src={images[lightboxIdx]}
            alt=""
            className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {images.length > 1 && images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }}
                className={`w-2 h-2 rounded-full transition cursor-pointer ${
                  i === lightboxIdx ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
