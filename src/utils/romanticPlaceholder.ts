/**
 * Safe romantic placeholder for broken/missing photos that never leaks private photos.
 */
export const GENERIC_ROMANTIC_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fff1f2"/>
        <stop offset="50%" stop-color="#ffe4e6"/>
        <stop offset="100%" stop-color="#fecdd3"/>
      </linearGradient>
    </defs>
    <rect width="600" height="450" fill="url(#bg)"/>
    <circle cx="300" cy="200" r="70" fill="#fda4af" opacity="0.4"/>
    <path d="M300 240 C300 240 220 180 220 130 C220 90 260 70 300 110 C340 70 380 90 380 130 C380 180 300 240 300 240 Z" fill="#e11d48"/>
    <text x="300" y="300" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#881337" text-anchor="middle">
      Khoảnh Khắc Kỷ Niệm
    </text>
    <text x="300" y="335" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#9f1239" text-anchor="middle">
      20 Tháng 10 Yêu Thương
    </text>
  </svg>`
)}`;

export const isManSlug = (slug: string): boolean => {
  const clean = (slug || '').toLowerCase().trim();
  return clean === 'man' || clean === 'manman' || clean === 'man_man';
};

export const isDefaultManPhoto = (url: string): boolean => {
  if (!url) return false;
  return (
    url.includes('/assets/my-photos/her-') ||
    url.includes('her-1') ||
    url.includes('her-2') ||
    url.includes('her-3') ||
    url.includes('her-4') ||
    url.includes('her-5') ||
    url.includes('her-6') ||
    url.includes('her-7')
  );
};
