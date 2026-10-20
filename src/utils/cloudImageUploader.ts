/**
 * Utility to compress images and upload to free cloud image hosting (ImgBB)
 * or convert to lightweight optimized WebP.
 */

export async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<string> {
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
        // Export as WebP or JPEG
        const dataUrl = elem.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Upload image to ImgBB free hosting API
 * Free public key or custom user key
 */
export async function uploadToImgBB(file: File, customApiKey?: string): Promise<string> {
  // Free public API key for image hosting
  const apiKey = customApiKey || '6d207e02198a847aa5fb3d03a46eacbb';

  // First compress to avoid large upload
  const base64DataUrl = await compressImage(file, 1400, 0.82);
  const base64Raw = base64DataUrl.replace(/^data:image\/[a-z]+;base64,/, '');

  const formData = new FormData();
  formData.append('image', base64Raw);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }

  const result = await response.json();
  if (result.success && result.data?.url) {
    return result.data.url;
  }

  throw new Error('Could not retrieve image URL from hosting service');
}
