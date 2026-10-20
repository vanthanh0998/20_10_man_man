/**
 * Vietnamese Name Dictionary and Transliteration Helper
 * Maps URL slugs (e.g., 'huong', 'thu_huong', 'man') to accented Vietnamese names (e.g., 'Hương', 'Thu Hương', 'Mận').
 */

export const COMMON_VIETNAMESE_NAMES: Record<string, string> = {
  // Special nicknames for user
  man: 'Mận',
  manman: 'Mận Mận',
  man_man: 'Mận Mận',
  man_em: 'Mận Em',
  be_man: 'Bé Mận',

  // Common female Vietnamese names
  huong: 'Hương',
  thu_huong: 'Thu Hương',
  thuhuong: 'Thu Hương',
  mai_huong: 'Mai Hương',
  lan_huong: 'Lan Hương',
  quynh_huong: 'Quỳnh Hương',

  mai: 'Mai',
  thanh_mai: 'Thanh Mai',
  ngoc_mai: 'Ngọc Mai',
  xuan_mai: 'Xuân Mai',

  lan: 'Lan',
  ngoc_lan: 'Ngọc Lan',
  huong_lan: 'Hương Lan',

  ngoc: 'Ngọc',
  bao_ngoc: 'Bảo Ngọc',
  bich_ngoc: 'Bích Ngọc',
  nhu_ngoc: 'Như Ngọc',
  kim_ngoc: 'Kim Ngọc',

  linh: 'Linh',
  thuy_linh: 'Thùy Linh',
  khanh_linh: 'Khánh Linh',
  phuong_linh: 'Phương Linh',
  my_linh: 'Mỹ Linh',
  dieu_linh: 'Diệu Linh',

  ha: 'Hà',
  thu_ha: 'Thu Hà',
  ngoc_ha: 'Ngọc Hà',
  thanh_ha: 'Thanh Hà',

  hang: 'Hằng',
  thanh_hang: 'Thanh Hằng',
  thu_hang: 'Thu Hằng',
  minh_hang: 'Minh Hằng',

  yen: 'Yến',
  hai_yen: 'Hải Yến',
  hoang_yen: 'Hoàng Yến',
  phi_yen: 'Phi Yến',

  van: 'Vân',
  thanh_van: 'Thanh Vân',
  cam_van: 'Cẩm Vân',
  thuy_van: 'Thúy Vân',
  khanh_van: 'Khánh Vân',

  nhung: 'Nhung',
  hong_nhung: 'Hồng Nhung',
  cam_nhung: 'Cẩm Nhung',

  nga: 'Nga',
  thanh_nga: 'Thanh Nga',
  to_nga: 'Tố Nga',

  loan: 'Loan',
  phuong_loan: 'Phương Loan',
  thanh_loan: 'Thanh Loan',

  thuy: 'Thúy',
  thanh_thuy: 'Thanh Thúy',
  minh_thuy: 'Minh Thúy',

  hoa: 'Hoa',
  quynh_hoa: 'Quỳnh Hoa',
  thanh_hoa: 'Thanh Hoa',

  dung: 'Dung',
  thuy_dung: 'Thùy Dung',
  my_dung: 'Mỹ Dung',

  vy: 'Vy',
  tuong_vy: 'Tường Vy',
  thao_vy: 'Thảo Vy',
  khanh_vy: 'Khánh Vy',

  my: 'Mỹ',
  tra_my: 'Trà My',
  diem_my: 'Diễm My',
  huyen_my: 'Huyền My',

  tram: 'Trâm',
  bich_tram: 'Bích Trâm',
  ngoc_tram: 'Ngọc Trâm',
  quynh_tram: 'Quỳnh Trâm',

  oanh: 'Oanh',
  kim_oanh: 'Kim Oanh',
  hoang_oanh: 'Hoàng Oanh',

  phuong: 'Phương',
  mai_phuong: 'Mai Phương',
  thu_phuong: 'Thu Phương',
  ha_phuong: 'Hà Phương',
  minh_phuong: 'Minh Phương',

  quynh: 'Quỳnh',
  nhu_quynh: 'Như Quỳnh',
  truc_quynh: 'Trúc Quỳnh',

  chi: 'Chi',
  khanh_chi: 'Khánh Chi',
  quynh_chi: 'Quỳnh Chi',
  thuy_chi: 'Thùy Chi',

  ly: 'Ly',
  huong_ly: 'Hương Ly',
  truc_ly: 'Trúc Ly',

  thu: 'Thu',
  hoai_thu: 'Hoài Thu',
  minh_thu: 'Minh Thư',
  anh_thu: 'Anh Thư',

  quyen: 'Quyên',
  le_quyen: 'Lệ Quyên',
  thao_quyen: 'Thảo Quyên',

  tuyen: 'Tuyền',
  thanh_tuyen: 'Thanh Tuyền',
  mong_tuyen: 'Mộng Tuyền',

  diem: 'Diễm',
  kieu_diem: 'Kiều Diễm',

  duyen: 'Duyên',
  my_duyen: 'Mỹ Duyên',
  ky_duyen: 'Kỳ Duyên',

  chau: 'Châu',
  minh_chau: 'Minh Châu',
  quynh_chau: 'Quỳnh Châu',

  nhi: 'Nhi',
  yen_nhi: 'Yến Nhi',
  gia_nhi: 'Gia Nhi',
  thao_nhi: 'Thảo Nhi',

  an: 'An',
  thuy_an: 'Thúy An',
  binh_an: 'Bình An',

  giang: 'Giang',
  huong_giang: 'Hương Giang',
  thu_giang: 'Thu Giang',

  thao: 'Thảo',
  phuong_thao: 'Phương Thảo',
  thanh_thao: 'Thanh Thảo',
  nhu_thao: 'Như Thảo',

  trang: 'Trang',
  thu_trang: 'Thu Trang',
  thuy_trang: 'Thùy Trang',
  quynh_trang: 'Quỳnh Trang',
  huyen_trang: 'Huyền Trang',
  minh_trang: 'Minh Trang',

  huyen: 'Huyền',
  thanh_huyen: 'Thanh Huyền',
  thu_huyen: 'Thu Huyền',
  ngoc_huyen: 'Ngọc Huyền',

  tram_anh: 'Trâm Anh',
  quynh_anh: 'Quỳnh Anh',
  ngoc_anh: 'Ngọc Ánh',
  kim_ngan: 'Kim Ngân',
  ngoc_ngan: 'Ngọc Ngân',

  em_yeu: 'Em Yêu',
  vo_yeu: 'Vợ Yêu',
  cong_chua: 'Công Chúa',
  be_iu: 'Bé Iu',
  nang_tho: 'Nàng Thơ',
};

/**
 * Convert a slug or raw nickname string into proper Vietnamese display name.
 * e.g., 'huong' -> 'Hương', 'man' -> 'Mận', 'thu_huong' -> 'Thu Hương'
 */
export function slugToVietnameseName(slug: string): string {
  if (!slug) return '';
  const normalized = slug.trim().toLowerCase().replace(/\s+/g, '_');

  if (COMMON_VIETNAMESE_NAMES[normalized]) {
    return COMMON_VIETNAMESE_NAMES[normalized];
  }

  // Fallback: capitalize words
  return slug
    .trim()
    .split(/[\s_+]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
