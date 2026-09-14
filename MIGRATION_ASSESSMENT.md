# Migration Assessment Report — vite-shadcn-starter

Ngày đánh giá: 14/09/2026
Phạm vi: toàn bộ `dependencies` + `devDependencies` trong `package.json`, đối chiếu với bản latest ổn định trên npm tại thời điểm đánh giá, kết hợp scan source code (`src/`) để xác định các package thực sự đang được dùng và mức độ ảnh hưởng khi breaking change xảy ra.

## 0. Nhận định chung

Trái với giả định ban đầu, stack hiện tại **không hề cũ** — đây rõ ràng là một boilerplate được cập nhật khá sát thời điểm khởi tạo (React 19.2, Vite 7.1, Tailwind CSS v4 theo mô hình CSS-first, TanStack Router/Query bản v1 mới, Biome 2.x, Storybook 9.1). Phần lớn các gói chỉ lệch **vài bản patch/minor** so với latest. Rủi ro thực sự nằm ở khoảng 10–12 package đã ra **major version mới trong vài tháng gần đây** (TypeScript 7, Vite 8, Storybook 10, TanStack Table v9, Vitest 5, Recharts v3, react-day-picker v10, react-resizable-panels v4...) — đây mới là phần cần kế hoạch cẩn thận, không phải "update hết mọi thứ" trong một lần.

## 1. Bảng phiên bản: hiện tại vs Latest

### 1.1. Nhóm rủi ro cao — major version mới, có breaking change xác nhận

| Package | Hiện tại | Latest | Loại | Rủi ro |
|---|---|---|---|---|
| `typescript` | ^5.7.2 (thực cài 5.9.3) | 7.0.2 | Major (compiler viết lại bằng Go — "tsgo") | **Rất cao** |
| `vite` | ^7.1.7 | 8.3.0 | Major (đổi bundler nền sang Rolldown/Oxc) | **Cao** |
| `@vitejs/plugin-react` | ^5.0.4 | 6.1.1 | Major (theo Vite 8) | Trung bình |
| `vite-plugin-svgr` | ^4.5.0 | 5.2.0 | Major (theo Vite 8) | Trung bình |
| `storybook` / `@storybook/react-vite` | ^9.1.9 | 10.6.0 | Major | Trung bình |
| `vitest` / `@vitest/ui` | ^3.0.5 / 3.2.4 | 5.0.0 | Major (bỏ qua hẳn v4) | Trung bình–Cao |
| `jsdom` | ^27.0.0 | 30.0.1 | Major x3 (đi kèm vitest) | Trung bình |
| `@tanstack/react-table` | ^8.21.2 | 9.2.4 | Major (đổi API cốt lõi) | **Cao** |
| `@tanstack/match-sorter-utils` | ^8.19.4 | 9.1.2 | Major | Thấp–Trung bình |
| `recharts` | 2.15.4 (pin cứng) | 3.10.1 | Major | **Cao** |
| `react-day-picker` | ^9.11.3 | 10.0.1 | Major (**đổi tên package**) | **Rất cao** |
| `react-resizable-panels` | ^3.0.6 | 4.12.4 | Major | **Cao** (bug đã biết với shadcn) |
| `kbar` | 0.1.0-beta.48 (pin cứng) | 1.0.0 | Từ beta lên bản ổn định đầu tiên | Trung bình |
| `react-dropzone` | ^14.3.8 | 20.1.2 | Nhiều major liên tiếp | Trung bình (API ít đổi, nhưng yêu cầu Node 22) |
| `i18next` | ^25.6.3 | 26.4.2 | Major | Trung bình |
| `react-i18next` | ^16.3.5 | 17.0.14 | Major | Trung bình |
| `react-helmet-async` | ^2.0.5 | 3.0.0 | Major | Thấp–Trung bình |
| `html-react-parser` | ^5.2.10 | 6.1.7 | Major | Thấp |
| `uuid` | ^13.0.0 | 14.0.2 | Major | Thấp |
| `framer-motion` | ^12.23.24 | 13.2.0 | Major | Thấp–Trung bình |
| `lucide-react` | ^0.544.0 | 1.46.0 | Major (bản 1.0 ổn định đầu tiên) | Thấp |
| `@testing-library/jest-dom` | ^6.9.1 | 7.0.1 | Major | Thấp |
| `@types/node` | ^22.10.2 | 26.5.1 | Major (theo Node LTS) | Thấp (chỉ ảnh hưởng type) |

### 1.2. Nhóm rủi ro thấp — minor/patch trong cùng major

| Package | Hiện tại | Latest |
|---|---|---|
| `react` / `react-dom` | ^19.2.1 | 19.3.0 |
| `@types/react` / `@types/react-dom` | ^19.2.7 / ^19.2.3 | 19.3.0 |
| `tailwindcss` / `@tailwindcss/vite` | ^4.0.6 | 4.3.3 |
| `@tanstack/react-router` (+ router-plugin, devtools, react-query...) | ^1.132.0 / ^0.7.0 | 1.170.x / 0.10.x |
| `zod` | ^4.1.11 | 4.6.5 |
| `@hookform/resolvers` | ^5.2.2 | 5.9.1 |
| `react-hook-form` | ^7.62.0 | 7.88.0 |
| `axios` | ^1.13.2 | 1.20.0 |
| `@biomejs/biome` | 2.2.4 | 2.5.13 |
| `zustand` | ^5.0.9 | 5.0.15 |
| `date-fns`, `dayjs`, `ethers`, `qs`, `bignumber.js`, `@faker-js/faker`, `react-number-format`, `plop` | — | chỉ lệch patch/minor |
| Toàn bộ `@radix-ui/react-*` (accordion, dialog, select, popover, tooltip...) | — | chỉ lệch patch/minor, API ổn định |

### 1.3. Không đổi hoặc gần như không đổi

`react-google-recaptcha-v3`, `react-top-loading-bar`, `vaul`, `next-themes`, `cmdk`, `class-variance-authority`, `clsx`, `qrcode`, `sonner` (patch nhỏ), `web-vitals`, `babel-plugin-react-compiler`.

## 2. Breaking Changes & Rủi ro chi tiết

### 2.1. TypeScript 5.x → 7.0 ("tsgo" — compiler native viết bằng Go)
TypeScript 7 không phải một bản nâng cấp thường: đây là **compiler mới hoàn toàn** (native, không còn chạy trên Node), nhanh hơn nhiều nhưng hệ sinh thái plugin/API nội bộ (programmatic API) **chưa ổn định tới bản 7.1 (~tháng 10/2026)**. Điểm đáng chú ý nhất: `typescript-eslint` hiện **chưa hỗ trợ** TS7 (team này chưa có lộ trình cụ thể). Dự án của bạn dùng **Biome** thay vì ESLint nên tránh được điểm nghẽn lớn nhất, nhưng Storybook, TanStack Router plugin (`@tanstack/router-plugin`), hay các addon Vite khác vẫn có thể phụ thuộc vào TS programmatic API chưa tương thích.
→ Khuyến nghị: **chưa nâng lên TS 7** ở đợt này, chỉ update trong nhánh 5.9.x (đã cài 5.9.3, khớp latest nhánh 5.x). Theo dõi lại sau khi TS 7.1 ổn định và các tool chính (Storybook, TanStack) xác nhận hỗ trợ.

### 2.2. Vite 7 → 8 (đổi bundler nền: esbuild/Rollup → Rolldown/Oxc)
- Target build mặc định nâng lên (Chrome 111+, Safari 16.4+...).
- `optimizeDeps.esbuildOptions` → `optimizeDeps.rolldownOptions`; `build.rollupOptions` → `build.rolldownOptions`; option `esbuild.*` → `oxc.*`.
- Oxc transformer **chưa hỗ trợ lowering native decorators** (dự án hiện không dùng decorator nên ít ảnh hưởng).
- Một số hook Rollup cũ (`shouldTransformCachedModule`, `resolveImportMeta`...) không còn hỗ trợ — ảnh hưởng tới **tác giả plugin**, không phải người dùng cuối, nhưng `@tanstack/router-plugin`, `@tanstack/devtools-vite`, `vite-plugin-svgr` đều cần xác nhận đã cập nhật tương thích Vite 8 trước khi bump.
- `@vitejs/plugin-react@6` và `vite-plugin-svgr@5` là bản đi kèm bắt buộc.
- Storybook 10 và Vitest 5 đều đã khai báo peer dependency hỗ trợ `vite@^8.0.0` (đã kiểm tra registry) nên nếu nâng Vite thì nên nâng cùng lúc 2 package này để tránh xung đột peer.

### 2.3. Storybook 9 → 10
- Bắt buộc cấu hình `.storybook/main.ts` phải **thuần ESM** (không CommonJS).
- Yêu cầu Node **20.19+ hoặc 22.12+** — máy bạn đang chạy Node 22.23.2 nên đã đạt yêu cầu.
- Có script tự động: `npx storybook@latest upgrade` để migrate + auto-fix phần lớn thay đổi.
- Nên cân nhắc chuyển sang `addon-vitest` thay vì test-runner cũ (khuyến nghị chính thức từ Storybook, phù hợp vì dự án đã dùng Vitest).

### 2.4. TanStack Table v8 → v9 (rủi ro cao nhất về khối lượng code phải sửa)
Đây là thay đổi **API lớn nhất** trong toàn bộ danh sách, và dự án bạn dùng khá sâu (8 file: `data-table.tsx`, `data-table-column-header.tsx`, `data-table-view-options.tsx`, và 3 container `use-payouts-container`, `use-payments-container`, `use-all-activity-container`, `create-columns.tsx`).
- `useReactTable` → `useTable`.
- Bắt buộc khai báo tường minh `features` qua `tableFeatures()` thay vì mọi feature được bundle sẵn như v8.
- `table.getState()` → `table.store.state` / `table.state`.
- Method trên row/cell/column **không còn dùng được khi destructure** — phải gọi trực tiếp qua instance (`row.getValue('name')` thay vì destructure `getValue`).
- Đổi tên: `sortingFn` → `sortFn`; pinning "left/right" → "start/end"; `columnSizingInfo` → `columnResizing`.
- Generic TypeScript cần thêm tham số `TFeatures` đầu tiên: `createColumnHelper<typeof features, Person>()`.
→ Đây là package nên làm **sau cùng**, tách riêng hẳn 1 PR, vì ảnh hưởng nhiều file nghiệp vụ nhất (module `transactions`).

### 2.5. Vitest 3 → 5 (bỏ qua v4) + @vitest/ui + jsdom v30
- `clearMocks` mặc định bật (mock bị clear trước mỗi test) — có thể làm lộ test đang ngầm phụ thuộc state mock giữa các test.
- `vi.mock/unmock/hoisted` bắt buộc ở module scope, gọi trong block/callback sẽ **lỗi** thay vì chỉ warn như trước.
- `@vitest/ui` yêu cầu token xác thực khi mở UI.
- Peer dependency: `vitest@5` cần `vite ^6.4 || ^7 || ^8` và `@types/node ^22 || >=24` — khớp nếu nâng cùng lúc với Vite 8.

### 2.6. Recharts v2 → v3 (ảnh hưởng trực tiếp `src/components/ui/chart.tsx`)
- Yêu cầu tối thiểu React 16.8+, TypeScript 5.x (đã thoả).
- Bỏ `recharts-scale` và `react-smooth` làm dependency riêng (đã gộp nội bộ).
- `CategoricalChartState` bị xoá hoàn toàn — nếu `chart.tsx` có custom `Customized` component hoặc đọc state qua object này thì phải viết lại dùng hook mới (chỉ còn `useActiveTooltipLabel`).
- `TooltipProps` đổi tên thành `TooltipContentProps`.
- Nhiều prop nội bộ từng "rò rỉ" ra ngoài bị xoá (`activeIndex`, Scatter `points`, Legend `payload`...).
→ Cần đọc kỹ `chart.tsx` hiện tại trước khi bump, khả năng cao phải sửa tay phần custom tooltip/legend.

### 2.7. react-day-picker v9 → v10 — RỦI RO RẤT CAO (đổi tên package)
Đây là thay đổi bất ngờ nhất trong danh sách: package **đổi tên từ `react-day-picker` sang `@daypicker/react`**, kèm đổi toàn bộ classNames (`table`→`month_grid`, `nav_button`→`button_previous`/`button_next`, `day_selected`→`selected`...) và đổi prop điều hướng (`fromYear/toYear` → `startMonth/endMonth`). Dự án đang dùng ở `calendar.tsx`, `date-range-picker.tsx` và 1 hook nghiệp vụ (`use-table-filter-container.ts`).
→ Bắt buộc phải viết lại component `Calendar` theo shadcn mới (shadcn đã cập nhật doc riêng cho việc này), test kỹ toàn bộ luồng chọn ngày/khoảng ngày trước khi merge.

### 2.8. react-resizable-panels v3 → v4 — có bug đã ghi nhận với shadcn/ui
Đã xác minh: shadcn/ui generate code resizable.tsx theo API v2/v3 (`PanelGroup`, `PanelResizeHandle`, prop `direction`), trong khi v4 đổi API thành `Group`, `Separator`, prop `orientation`. Đây là **breaking change đã có issue mở trên GitHub shadcn-ui/ui**, tính đến thời điểm nghiên cứu **chưa có bản fix chính thức** từ shadcn. Dự án bạn có `src/components/ui/resizable.tsx`.
→ Khuyến nghị **tạm hoãn** bump package này cho tới khi shadcn cập nhật template, hoặc tự sửa tay `resizable.tsx` theo API v4 (`Group`/`Panel`/`Separator`, đổi `direction`→`orientation`) rồi mới bump.

### 2.9. Nhóm còn lại (rủi ro thấp–trung bình, có thể gộp theo đợt nhỏ)
- `kbar` 0.1.0-beta.48 → 1.0.0: từ beta lên bản ổn định đầu tiên, nên đọc changelog và test lại toàn bộ command palette (`src/components/ui/kbar`).
- `i18next` v25→v26 / `react-i18next` v16→v17: theo migration guide chính thức, thường chỉ ảnh hưởng cấu hình khởi tạo (`src/integrations/i18n`), ít ảnh hưởng cách dùng hook `useTranslation`.
- `react-helmet-async` v2→v3, `html-react-parser` v5→v6, `uuid` v13→v14: API bề mặt hầu như giữ nguyên, rủi ro thấp nhưng vẫn nên chạy full test.
- `react-dropzone` v14→v20: thực chất các version major liên tiếp chủ yếu bổ sung tính năng (paste-to-upload, group MIME types...), điểm cần lưu ý duy nhất là **v20 yêu cầu Node ≥ 22** (máy bạn đã đạt) và một thay đổi hành vi ở v19 (`acceptedFiles/onDropAccepted` trả về file nằm trong giới hạn thay vì từ chối toàn bộ) — nên test lại `input-file-dropzone.tsx`.

### 2.10. Tổng hợp rủi ro peer dependency
Nếu nâng theo đúng roadmap dưới đây (đi theo cụm liên quan), rủi ro peer dependency conflict ở mức thấp vì:
- Storybook 10 + Vite 8 + Vitest 5 đã khai báo tương thích lẫn nhau (đã kiểm tra `peerDependencies` trên registry).
- React 19.3 không đổi major nên toàn bộ Radix UI, react-hook-form, zod, zustand... không bị ảnh hưởng.
Rủi ro chính không nằm ở version-mismatch giữa các tool, mà nằm ở **API tự viết trong `src/` phải sửa tay** để khớp API mới (Table v9, DayPicker v10, Recharts v3, Resizable v4) — đây là phần tốn thời gian nhất, không phải phần cài đặt package.

## 3. Kế hoạch nâng cấp theo từng bước (Upgrade Roadmap)

**Nguyên tắc chung:** mỗi phase là 1 nhánh + 1 PR riêng, chạy `pnpm test`, `pnpm lint`/`pnpm check` (Biome), `pnpm build`, `pnpm build-storybook` sau mỗi phase trước khi merge. Không gộp nhiều phase rủi ro cao vào cùng 1 PR.

1. **Phase 0 — Chuẩn bị:** tạo nhánh `chore/deps-upgrade`, chốt baseline (chạy toàn bộ test + build + storybook build hiện tại để có điểm so sánh), backup `pnpm-lock.yaml`.
2. **Phase 1 — Update an toàn (nhóm 1.2):** chạy update trong phạm vi hiện có (React 19.3, Tailwind 4.3, TanStack Router/Query patch, Radix UI, Biome 2.5, zod, react-hook-form...). Rủi ro thấp, làm gộp 1 PR.
3. **Phase 2 — Vite 8 + @vitejs/plugin-react 6 + vite-plugin-svgr 5:** nâng cùng lúc vì phụ thuộc lẫn nhau. Kiểm tra kỹ `@tanstack/router-plugin` và `@tanstack/devtools-vite` chạy được trên Vite 8 trước.
4. **Phase 3 — Vitest 5 + @vitest/ui 5 + jsdom 30:** làm ngay sau Phase 2 vì cùng yêu cầu Vite 8. Rà lại các chỗ gọi `vi.mock` trong block/callback (nếu có) để tránh lỗi cứng.
5. **Phase 4 — Storybook 10:** chạy `npx storybook@latest upgrade`, xác nhận `.storybook/main.ts` là ESM thuần, cân nhắc chuyển sang `addon-vitest`.
6. **Phase 5 — react-day-picker v10:** viết lại `calendar.tsx`, `date-range-picker.tsx` theo package mới `@daypicker/react`, đổi classNames/prop, test toàn bộ flow chọn ngày.
7. **Phase 6 — recharts v3:** rà lại `chart.tsx` (custom tooltip/legend/Customized nếu có), test lại toàn bộ màn hình có biểu đồ.
8. **Phase 7 — react-resizable-panels v4:** CHỈ làm sau khi đã tự patch `resizable.tsx` theo API mới (`Group`/`Separator`/`orientation`), hoặc hoãn tới khi shadcn có fix chính thức.
9. **Phase 8 — @tanstack/react-table v9:** phase nặng nhất, làm riêng 1 PR lớn, cập nhật toàn bộ `data-table*`, các container trong module `transactions`, khai báo `tableFeatures()` và generic `TFeatures`.
10. **Phase 9 — Nhóm dọn dẹp nhỏ:** kbar 1.0, i18next 26 / react-i18next 17, react-helmet-async 3, html-react-parser 6, react-dropzone 20, uuid 14 — mỗi cụm nhỏ 1 PR, test nhanh.
11. **Phase 10 — TypeScript 7:** KHÔNG làm ở đợt này. Giữ nguyên nhánh 5.9.x. Đặt lịch đánh giá lại sau khi TS 7.1 ra mắt (~10/2026) và Storybook/TanStack xác nhận hỗ trợ chính thức.

## 4. Bước tiếp theo
Báo cáo này chỉ dừng ở mức đánh giá — chưa có dòng code nào bị thay đổi. Khi bạn xác nhận, mình sẽ bắt đầu từ Phase 1 (nhóm rủi ro thấp) trước, từng PR một theo đúng thứ tự trên.
