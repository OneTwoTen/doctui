# Quality regression matrix

Issue #17 bổ sung một lớp kiểm tra release-quality cho các component được thêm mới hoặc mở rộng trong PR #7. Mục tiêu là bắt các lỗi chỉ xuất hiện trong browser thật, đồng thời ngăn API public bị lệch giữa implementation, metadata, Storybook và VitePress.

## Các lệnh chính

```bash
bun run api:check
bun run test:browser
bun run quality:check
```

`api:check` đọc trực tiếp source TypeScript của các component trọng yếu, so sánh `props`, events và slots với contract đã xác minh trong `metadata/quality-contract.ts`, đồng thời kiểm tra component vẫn được export, vẫn có entry trong generated registry đúng package và có tài liệu VitePress + Storybook tương ứng.

`test:browser` chạy hai nhóm regression bằng Chrome/Chromium headless qua Chrome DevTools Protocol:

- browser quality matrix cho field relationships, segmented control, combobox, menu, date picker, notifications và theme tokens;
- browser overlay regressions cho Modal/Drawer, nested focus trap, scroll lock, Escape, outside dismissal, footer geometry và focus restoration.

CI chạy các kiểm tra này trước build. Sau đó Storybook và VitePress được build production, vì vậy ví dụ quan trọng không chỉ được tìm thấy trong source mà còn phải compile thành công.

## Phạm vi hiện tại

Matrix khóa các contract đã từng có regression trong issues #8–#16:

- `TextInput`: label/id, description + error `aria-describedby`, `aria-invalid`, native attributes;
- `SegmentedControl`: một keyboard entry point, bỏ qua disabled option, Arrow/Home/End đồng bộ focus và selection;
- `Combobox`: filtering, `aria-activedescendant`, disabled options, Enter selection;
- `TagsInput`: API contract của props/events/slots, cùng regression test riêng cho form, focus và IME;
- `Menu`: mở từ trigger bằng keyboard, focus item đầu tiên hợp lệ, Home/End/Escape và focus restoration;
- `Modal` / `Drawer`: nested layers, scroll lock, focus trap/restoration, Escape/outside dismissal và token geometry;
- `DatePicker`: focus vào calendar khi mở, arrow navigation, keyboard selection và return focus;
- `Notifications`: live-region semantics, dismiss control và lifecycle/timing được khóa bởi unit regressions;
- SSR: field/combobox/menu/tooltip IDs phải deterministic giữa hai lần server render; dates có regression SSR riêng.

## API drift contract

`metadata/quality-contract.ts` là contract release-quality cho nhóm component PR #7. Mỗi entry mô tả:

- package public;
- source file;
- danh sách props;
- events;
- slots.

`api:check` parse AST của `defineComponent()` thay vì dựa trên regex đơn giản. Nếu implementation thêm/xóa/đổi tên public prop, event hoặc slot mà contract chưa được update, CI sẽ fail. Generated registry tiếp tục đóng vai trò discovery metadata; `api:check` xác nhận component vẫn xuất hiện ở đúng package, còn `quality-contract.ts` là lớp metadata chính xác dùng để khóa API public của nhóm component PR #7.

## Giới hạn

Đây không phải application E2E suite. Matrix chỉ kiểm tra public behavior boundary của component library và cố tình giữ fixture nhỏ, deterministic, không phụ thuộc network hay backend. Những luồng sản phẩm, routing, API request hoặc business workflow vẫn thuộc test của application sử dụng doctui.

Khi sửa một regression browser-visible mới, ưu tiên thêm case vào matrix hiện có thay vì tạo một E2E app riêng. Nếu lỗi chỉ cần DOM/unit test để tái hiện chính xác thì giữ nó ở Vitest và chỉ bổ sung browser case khi behavior phụ thuộc focus thật, pointer, keyboard synthesis, layout hoặc browser lifecycle.
