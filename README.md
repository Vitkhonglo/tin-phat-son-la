# Website Tín Phát Sơn La

Đây là website tĩnh, không cần máy chủ hoặc chi phí hosting. Có thể đăng miễn phí bằng GitHub Pages, Netlify hoặc Cloudflare Pages.

## Trước khi đăng

Mở [script.js](./script.js) và thay:

- `phone`, `phoneDisplay`: số điện thoại tư vấn thật.
- `zalo`: đường dẫn Zalo cá nhân hoặc OA.
- `facebook`: đường dẫn Facebook Page.
- `tiktok`: đường dẫn TikTok.
- `email`: email nhận yêu cầu từ form.

Trong [index.html](./index.html), cập nhật thêm địa chỉ, giấy phép, ảnh học viên, video và các bài viết thật. Các nội dung đang ghi “Đang cập nhật” hoặc “Thay bằng...” là vị trí chờ thông tin của chi nhánh.

## Đăng miễn phí

1. Tạo tài khoản GitHub và một repository mới.
2. Tải ba file `index.html`, `style.css`, `script.js` lên repository.
3. Vào **Settings → Pages**, chọn branch `main` và thư mục `/root`.
4. Dùng URL GitHub Pages làm link trong TikTok bio và Facebook Page.

Form hiện có chế độ dự phòng mở email để không cần backend. Khi có email thật, sửa `CONFIG.email`; với nhu cầu nhận form tự động ổn định hơn, có thể nối form vào Google Forms hoặc FormSubmit sau.

## Chỉnh sửa bằng tài khoản quản trị

Mở [admin.html](./admin.html), đăng nhập bằng mật khẩu mẫu `TinPhat2026`, sau đó chỉnh màu, cỡ chữ, số điện thoại, link mạng xã hội và nội dung. Website đọc các thay đổi từ bộ nhớ trình duyệt.

Lưu ý: vì đây là website tĩnh miễn phí, mật khẩu này chỉ là lớp tiện ích ở phía trình duyệt, không phải bảo mật máy chủ. Không nhập dữ liệu nhạy cảm. Nếu cần quản trị thật từ nhiều thiết bị, nên chuyển sang WordPress, Decap CMS hoặc thêm backend xác thực.
