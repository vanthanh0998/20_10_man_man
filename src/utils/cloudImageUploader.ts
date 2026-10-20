/**
 * Utility to compress images into lightweight WebP/JPEG data URLs
 * or upload to free cloud image hosting.
 */

export async function compressImage(
  file: File,
  maxWidth = 1000,
  quality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const elem = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try webp first, fall back to jpeg
        try {
          const webpUrl = elem.toDataURL('image/webp', quality);
          if (webpUrl.startsWith('data:image/webp')) {
            resolve(webpUrl);
            return;
          }
        } catch {
          // fallback to jpeg
        }

        const jpegUrl = elem.toDataURL('image/jpeg', quality);
        resolve(jpegUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Upload image with graceful multi-tier fallback:
 * 1. Optional ImgBB if key is provided
 * 2. Instant optimized compressed data URL (100% reliable, zero external dependencies)
 */
export async function uploadImageDirect(
  file: File,
  optionalImgbbKey?: string
): Promise<string> {
  // If user provided a custom ImgBB key, try uploading with it
  if (optionalImgbbKey && optionalImgbbKey.trim()) {
    try {
      const compressedDataUrl = await compressImage(file, 1200, 0.82);
      const base64Raw = compressedDataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
      const formData = new FormData();
      formData.append('image', base64Raw);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${optionalImgbbKey.trim()}`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.url) {
          return json.data.url;
        }
      }
    } catch {
      // Fallback to local optimized base64
    }
  }

  // Primary seamless method: High-quality optimized Canvas image
  // Zero setup, works immediately on every device without third-party reliance
  return await compressImage(file, 900, 0.78);
}
