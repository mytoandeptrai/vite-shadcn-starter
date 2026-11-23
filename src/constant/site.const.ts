/** Brand and search metadata. The build turns this into the page head, manifest, robots.txt and sitemap. */
export const siteConfig = {
  name: 'jacobhocoto',
  title: 'jacobhocoto – Mô phỏng thi sa hình lái xe B1/B2 3D',
  shortTitle: 'Mô phỏng thi sa hình B1/B2 3D',
  description:
    'Luyện thi sát hạch lái xe B1 số tự động và B2 số sàn bằng mô phỏng 3D: đề-pa lên dốc, ghép xe dọc, chấm điểm từng lỗi. Chạy ngay trên máy tính và điện thoại.',
  /** Used when neither VITE_SITE_URL nor Vercel's production domain is known at build time. */
  defaultUrl: 'https://vite-shadcn-starter.vercel.app',
  language: 'vi',
  locale: 'vi_VN',
  themeColor: '#0b1220',
  ogImage: {
    path: '/og-image.jpg',
    type: 'image/jpeg',
    width: 1200,
    height: 630,
    alt: 'jacobhocoto – mô phỏng 3D bài đề-pa lên dốc với vô lăng, bàn đạp và cần số trên màn hình',
  },
  keywords: [
    'jacobhocoto',
    'mô phỏng lái xe 3D',
    'thi sa hình B1',
    'thi sa hình B2',
    'luyện thi sát hạch lái xe',
    'đề-pa lên dốc',
    'dừng và khởi hành xe ngang dốc',
    'ghép xe dọc vào nơi đỗ',
    'lùi chuồng dọc',
    'tập lái xe số sàn',
    'tập lái xe số tự động',
    'học lái ô tô online',
  ],
  features: [
    'Hạng B1 số tự động: cần số P-R-N-D, xe tự bò khi nhả phanh',
    'Hạng B2 số sàn: côn, điểm bám, chết máy khi nhả côn sai',
    'Bài dừng và khởi hành xe ngang dốc 10%',
    'Bài ghép xe dọc vào nơi đỗ với vạch cảm biến',
    'Chấm điểm từ 100, đạt từ 80 điểm',
    'Gương chiếu hậu, bản đồ, nhiều góc camera',
    'Điều khiển bằng bàn phím hoặc cảm ứng, hỗ trợ xoay ngang điện thoại',
  ],
} as const;
