# 🕷️ Spider-Game

Mini game HTML5 Canvas: điều khiển **nhện** bắn tơ để **bắt ruồi** trong 60 giây, tránh **bọ cánh cứng**. Chạy thuần `HTML/CSS/JS`, **không cần build**. Sẵn sàng triển khai trên **GitHub Pages**.

## Cách chơi
- Di chuyển: `← ↑ → ↓` hoặc `W A S D`
- Bắn tơ: `Space`
- Di động: joystick ảo + nút 🕸️
- Bắt ruồi để +1 điểm. Dính bọ → trừ **5 giây**.

## Chạy cục bộ
Mở `index.html` bằng trình duyệt là chơi được.

## Triển khai GitHub Pages
1. Tạo repo mới, ví dụ: `spider-game`.
2. Upload toàn bộ file/folder ở đây vào nhánh `main`.
3. (Tuỳ chọn) Dùng workflow trong `.github/workflows/deploy.yml` hoặc bật **Settings → Pages → Source: GitHub Actions**.
4. Sau khi chạy xong, site sẽ có link dạng:
   - `https://<username>.github.io/spider-game/` (project page).

> Không có bước build — chỉ là static files.

## Giấy phép
[MIT](./LICENSE)
