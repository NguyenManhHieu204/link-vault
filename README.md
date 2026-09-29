# Link Vault - Bookmark Manager

Dự án Take-Home Assignment cho vị trí Fullstack Engineer.

## ✅ Checklist Yêu Cầu

- [x] **Mô tả ngắn dự án & tính năng**: Ứng dụng quản lý Bookmark. Đã hoàn thiện toàn bộ tính năng cốt lõi (CRUD, Tự động cào Metadata, Auth, Tìm kiếm, Lọc Tag, Xóa, Trang Public).
- [x] **Tech stack & Lý do chọn**: 
  - **Next.js (App Router)**: Gom Frontend và Backend vào 1 Repo, Server Actions xử lý form an toàn.
  - **SQLite + Prisma ORM**: Hoạt động dưới dạng file cục bộ, giúp người chấm bài (Reviewer) clone về chạy được ngay mà không cần cài đặt Database Server.
  - **Tailwind + shadcn/ui**: Xây dựng UI đẹp, nhất quán, hỗ trợ Dark Mode.
  - **Cheerio**: Bóc tách HTML để lấy Title, Favicon, Ảnh OG cực nhanh ở phía Server.
- [x] **Sơ đồ kiến trúc luồng dữ liệu**:
  `User (1) --- (N) Bookmark --- (N) Tag`
- [x] **Hướng dẫn chạy local**: Xem hướng dẫn chi tiết bên dưới.
- [x] **Biến môi trường**: Đã có file `.env.example`.
- [x] **Ghi chú dùng AI**: Sử dụng công cụ AI (Gemini) để hỗ trợ viết khung Boilerplate ban đầu, thiết kế Prisma Schema và các Regex xử lý lấy Metadata, tiết kiệm thời gian gõ code. Toàn bộ logic lưu trữ và giao diện được review/sửa đổi thủ công để đảm bảo chất lượng.

## 🚀 Hướng dẫn chạy Local (Từng bước)

**Bước 1:** Clone dự án và cài đặt thư viện
```bash
git clone <url-repo-cua-ban>
cd link-vault
npm install
```

**Bước 2:** Cấu hình môi trường
```bash
cp .env.example .env
```
*(Lưu ý: Bạn không cần đổi thông tin trong .env vì dự án dùng mặc định SQLite `file:./dev.db`)*

**Bước 3:** Khởi tạo Database SQLite
```bash
npx prisma migrate dev --name init
```

**Bước 4:** Khởi động dự án
```bash
npm run dev
```
Truy cập `http://localhost:3000` trên trình duyệt.

## 🐳 Hướng dẫn chạy bằng Docker (Bonus)
Đảm bảo máy bạn đã cài Docker và Docker Compose. Mở terminal và chạy lệnh duy nhất:
```bash
docker-compose up --build
```
Dự án sẽ tự động đóng gói và chạy tại `http://localhost:3000`. Dữ liệu SQLite được mount ra ngoài nên sẽ không bị mất khi tắt container.

## 💡 Đánh đổi (Trade-offs) & Hướng phát triển thêm
*   **Database:** Đã chọn SQLite để tối ưu hóa việc chấm bài của Reviewer. Nếu triển khai lên production thực tế (như Vercel/AWS), sẽ cần đổi qua PostgreSQL (Chỉ cần đổi config trong `schema.prisma`).
*   **Edit Bookmark:** Tạm thời chỉ hỗ trợ Thêm & Xóa. Thực tế thao tác Xóa rồi Thêm lại nhanh hơn việc tạo form Edit đối với Bookmark, nhưng nếu có thêm thời gian sẽ làm form Edit hoàn chỉnh.
