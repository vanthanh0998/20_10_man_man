import React, { useState } from 'react';
import { Camera, Heart, Plus, Sparkles, X } from 'lucide-react';

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
}

interface PhotoGallerySectionProps {
  photos: GalleryPhoto[];
  herName: string;
  onOpenCustomize: () => void;
  isAdminMode?: boolean;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  photos,
  herName,
  onOpenCustomize,
  isAdminMode = false,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  return (
    <section id="ky-niem" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header with Title & Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-rose-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-1">
              <Camera size={14} />
              <span>Góc Kỷ Niệm Ngọt Ngào</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Khoảnh Khắc Của Nàng Thơ
            </h2>
          </div>

          {isAdminMode && (
            <button
              onClick={onOpenCustomize}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-full shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Tải ảnh của {herName} lên</span>
            </button>
          )}
        </div>

        {/* Polaroid Memory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {photos.map((photo, index) => (
            <div
              key={photo.id || index}
              onClick={() => setSelectedPhoto(photo)}
              className="group cursor-pointer rounded-2xl bg-white p-3.5 shadow-md hover:shadow-xl border border-stone-200/80 transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
              role="button"
              tabIndex={0}
              aria-label={`Xem ảnh: ${photo.caption}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSelectedPhoto(photo);
              }}
            >
              {/* Photo Frame */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-rose-50 mb-3">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart size={16} className="fill-rose-400 text-rose-400" />
                </div>
              </div>

              {/* Photo Caption & Unboxed Metadata */}
              <div className="px-1 flex-1 flex flex-col justify-between">
                <p className="font-serif-display text-sm font-semibold text-stone-800 line-clamp-1 group-hover:text-rose-700 transition-colors">
                  {photo.caption}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                  <span>{photo.date}</span>
                  <span className="flex items-center gap-1 text-rose-500 font-medium">
                    <Sparkles size={12} />
                    <span>Xem phóng to</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-3xl w-full rounded-2xl bg-white overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                aria-label="Đóng ảnh"
              >
                <X size={18} />
              </button>

              <div className="max-h-[75vh] overflow-hidden bg-stone-950 flex items-center justify-center">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="p-4 sm:p-5 flex items-center justify-between bg-white border-t border-stone-100">
                <div>
                  <h3 className="font-serif-display text-base sm:text-lg font-semibold text-stone-900">
                    {selectedPhoto.caption}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">{selectedPhoto.date}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                  <Heart size={14} className="fill-rose-500 text-rose-500" />
                  <span>Kỷ niệm đong đầy</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
