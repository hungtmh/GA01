# GA01

## GA01-Group-Website

Thư mục dự án: `GA01-Group-Website/`

### Cấu trúc

```
GA01-Group-Website/
├─ index.html
├─ about.html
├─ members/
│  ├─ tran-manh-hung.html
│  ├─ bui-duong-duy-cuong.html
│  ├─ nguyen-anh-khoa.html
│  ├─ nguyen-tan-thang.html
│  └─ ninh-van-khai.html
├─ css/
│  └─ style.css
├─ js/
│  └─ script.js
└─ assets/
	└─ images/
		├─ logo.png (placeholder)
		├─ tran-manh-hung.jpg (placeholder)
		├─ bui-duong-duy-cuong.jpg (placeholder)
		├─ nguyen-anh-khoa.jpg (placeholder)
		├─ nguyen-tan-thang.jpg (placeholder)
		└─ ninh-van-khai.jpg (placeholder)
```

### Phân công gợi ý (có thể thay đổi)

- Thành viên 1 (Lead): Kiến trúc dự án, header/footer, build & deploy.
- Thành viên 2 (UI/UX): Màu sắc, style.css, responsive.
- Thành viên 3 (Frontend): `index.html`, components thẻ card, mobile nav.
- Thành viên 4 (Nội dung): `about.html`, nội dung chi tiết từng `members/*.html`, ảnh.

### Tiêu chí chấm điểm mapping

- Thông tin: `index.html` (tổng quan), `members/*.html` (chi tiết) – 4.0
- Theme & màu: `css/style.css` (màu chủ đạo emerald/slate) – 2.0
- Responsive: header, nav, footer, sidebar, grid – 2.0
- Public host: GitHub Pages – 2.0

### Hướng dẫn deploy GitHub Pages

1) Commit code vào nhánh `main`

2) Bật GitHub Pages
	- Vào Settings → Pages
	- Source: Deploy from a branch
	- Branch: `main`, Folder: `/root` (do file `index.html` nằm trong `GA01-Group-Website/`, bạn có 2 cách):
	  - Cách A (đơn giản): Di chuyển nội dung website ra thư mục gốc repo, hoặc
	  - Cách B: Giữ nguyên cấu trúc và đặt "Folder" là `/docs` rồi chuyển toàn bộ `GA01-Group-Website` thành `/docs`.

3) Khuyến nghị cách B (ít xáo trộn):
	- Đổi tên thư mục `GA01-Group-Website` → `docs`
	- Settings → Pages → Branch: `main` | Folder: `/docs`
	- Chờ 1–2 phút, URL public sẽ có dạng:
	  `https://<username>.github.io/<repo>/`

4) Kiểm tra và cập nhật link public vào báo cáo/bài nộp.

### Phát triển tiếp theo (gợi ý)

- Thêm nội dung thật cho từng thành viên, ảnh thật thay placeholder.
- Thêm form liên hệ (HTML + Formspree hoặc email link).
- Tối ưu Lighthouse: contrast, aria-label, meta tags SEO.
- Thêm favicon, Open Graph images.

### Chạy cục bộ

Mở file `GA01-Group-Website/index.html` trực tiếp bằng trình duyệt hoặc dùng live server.