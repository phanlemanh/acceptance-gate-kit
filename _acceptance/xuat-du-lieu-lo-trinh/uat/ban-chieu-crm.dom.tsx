// Thước Cổng Giá trị của hồ sơ kit `xuat-du-lieu-lo-trinh` (hàng X1) — chạy TRONG một bản trích crm
// (chép tệp này vào `apps/app/test/`, chạy bằng bộ kiểm DOM của chính LT1:
//   cd apps/app && TZ=Asia/Ho_Chi_Minh bun test --preload ../../packages/ui/test/setup-dom.ts ./test/x1-ban-chieu-crm.dom.tsx
// ). Không sửa gì ở crm, không commit vào crm.
//
// Dựng trang «Lộ trình» bằng ĐÚNG đường của route `apps/app/app/(app)/[slug]/lo-trinh/page.tsx`:
// `docTepLoTrinh()` → `docTrangLoTrinh()` → `<NoiDungLoTrinh>` (bỏ phần đăng nhập + bộ đệm Next), rồi
// đọc trạng thái ĐÃ HIỆN của từng việc ở hai chỗ người xem thấy: dòng bảng (mọi trang, vòng đời «tất
// cả») và khung chi tiết của việc. Ghi JSON ra `$X1_RA`. `$X1_TEP` (tuỳ) thay tệp đọc — dùng cho chiều
// đỏ (bản sao khối bị tiêm). `$X1_LUAT_NGAY` (tuỳ) trỏ tài liệu kit `lo-trinh-du-lieu.md`: chạy luật so
// ngày của tài liệu cạnh hàm của trang trên mọi ngày quanh các mốc, ghi cả hai kết quả.
import { afterEach, mock, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";

mock.module("@/lib/trpc/client", () => ({
	useTRPC: () =>
		new Proxy({}, { get: () => new Proxy({}, { get: () => () => ({}) }) }),
}));
mock.module("next/navigation", () => ({
	useRouter: () => ({ push: () => {}, replace: () => {}, prefetch: () => {} }),
	useParams: () => ({ slug: "ws" }),
	useSearchParams: () => new URLSearchParams(),
	usePathname: () => "/ws/lo-trinh",
}));

const { NoiDungLoTrinh } = await import("@/components/lo-trinh/noi-dung");
const { docTrangLoTrinh } = await import("@/lib/lo-trinh/doc-trang");
const { docTepLoTrinh, duongTepLoTrinh } = await import(
	"@/lib/lo-trinh/doc-tep"
);
const { mocQuaConViec, viecTre } = await import("@/lib/lo-trinh/ngay");
const { LocaleProvider } = await import("@crm/ui/components/locale-provider");
const { TooltipProvider } = await import("@crm/ui/components/tooltip");

type DauVao = ReturnType<typeof docTrangLoTrinh>;

let root: Root | null = null;
afterEach(() => {
	act(() => root?.unmount());
	root = null;
	document.body.innerHTML = "";
});

async function mo(dv: DauVao, thamSo: string): Promise<void> {
	act(() => root?.unmount());
	document.body.innerHTML = "";
	const o = document.createElement("div");
	document.body.appendChild(o);
	root = createRoot(o);
	await act(async () =>
		root?.render(
			<NuqsTestingAdapter hasMemory searchParams={thamSo}>
				<LocaleProvider locale="vi">
					<TooltipProvider>
						<NoiDungLoTrinh dauVao={dv} />
					</TooltipProvider>
				</LocaleProvider>
			</NuqsTestingAdapter>,
		),
	);
	for (let i = 0; i < 4; i++)
		await act(async () => {
			await new Promise((r) => setTimeout(r, 0));
		});
}

const tham = (o: Record<string, string>) => new URLSearchParams(o).toString();
const chu = (e: Element | null | undefined) =>
	e ? (e.textContent ?? "").replace(/\s+/g, " ").trim() : null;
// Chấm trạng thái của CHÍNH việc — bỏ chấm của việc liên quan («Cần xong trước» · «Đang chờ») trong
// khung chi tiết (lượt thử đầu 11/10 gom cả chúng và đỏ giả 24 hàng).
const LIEN_QUAN = "[data-lo-trinh-can-truoc],[data-lo-trinh-dang-cho]";
const cham = (goc: Element) =>
	[...goc.querySelectorAll("[data-nhom-trang-thai]")]
		.filter((c) => c.closest(LIEN_QUAN) === null)
		.map((c) => ({
			nhom: c.getAttribute("data-nhom-trang-thai"),
			chu: chu(c),
		}));

test("x1: trạng thái đã hiện của từng việc trên trang Lộ trình", async () => {
	const tepThay = process.env.X1_TEP;
	const duong = tepThay ?? duongTepLoTrinh();
	const html = tepThay ? readFileSync(tepThay, "utf8") : docTepLoTrinh();
	if (html === null) throw new Error(`không có tệp ${duong}`);
	const dv = docTrangLoTrinh(html);
	const ra: Record<string, unknown> = {
		tep_doc: duong,
		duong_route: tepThay ? "X1_TEP (bản sao)" : "docTepLoTrinh() mặc định",
		sha256: createHash("sha256").update(html).digest("hex"),
		kieu: dv.kieu,
	};
	if (dv.kieu !== "co-du-lieu") {
		writeFileSync(String(process.env.X1_RA), JSON.stringify(ra, null, 1));
		throw new Error(`trang không dựng được dữ liệu: ${dv.kieu}`);
	}
	ra.canh_bao = dv.canhBao;

	// Bảng: lật mọi trang ở vòng đời «tất cả» cho tới khi một trang rỗng.
	const bang = new Map<string, unknown>();
	let dem: Record<string, string | null> = {};
	let soTrang = 0;
	for (let trang = 1; trang < 100; trang++) {
		await mo(dv, tham({ vongDoi: "tat-ca", page: String(trang) }));
		if (trang === 1)
			dem = Object.fromEntries(
				[...document.body.querySelectorAll("[data-vong-doi]")].map((e) => [
					e.getAttribute("data-vong-doi") ?? "",
					e.getAttribute("data-dem"),
				]),
			);
		const dong = [...document.body.querySelectorAll("tbody [data-viec-khoa]")];
		if (dong.length === 0) break;
		soTrang = trang;
		for (const el of dong) {
			const tr = el.closest("tr");
			if (!tr) continue;
			const khoa = el.getAttribute("data-viec-khoa") ?? "";
			if (bang.has(khoa)) throw new Error(`dòng ${khoa} hiện hai lần`);
			bang.set(khoa, {
				khoa,
				lo_ten: chu(tr.querySelector("[data-lo-trinh-ten]")),
				cham: cham(tr),
				phu: chu(tr.querySelector("[data-lo-trinh-trang-thai-phu]")),
			});
		}
	}
	ra.so_trang_bang = soTrang;
	ra.dem_vong_doi = dem;
	ra.bang = [...bang.values()];

	// Khung chi tiết: mở từng việc bằng tham số `viec` của trang.
	const chiTiet: unknown[] = [];
	for (const khoa of bang.keys()) {
		await mo(dv, tham({ vongDoi: "tat-ca", viec: khoa }));
		const k = document.body.querySelector("[data-lo-trinh-chi-tiet-viec]");
		if (!k) {
			chiTiet.push({ khoa, mo_duoc: false });
			continue;
		}
		const lech = k.querySelector("[data-lo-trinh-lech]");
		chiTiet.push({
			khoa,
			mo_duoc: true,
			ma: k.getAttribute("data-lo-trinh-chi-tiet-viec"),
			cham: cham(k),
			phu: chu(k.querySelector("[data-lo-trinh-trang-thai-phu]")),
			theo_loi: k.querySelector("[data-lo-trinh-theo-loi]") !== null,
			lech: lech
				? chu(lech.querySelector('[data-slot="alert-description"]'))
				: null,
		});
	}
	ra.chi_tiet = chiTiet;

	// Luật so ngày: hàm của trang cạnh hàm trong tài liệu kit, mọi ngày quanh các mốc.
	const tl = process.env.X1_LUAT_NGAY;
	if (tl) {
		const doc = readFileSync(tl, "utf8");
		const khoi = doc.match(
			/<!-- <<<LO-TRINH-DU-LIEU-LUAT-NGAY -->\s*```js\n([\s\S]*?)```/,
		)?.[1];
		if (!khoi) throw new Error("tài liệu kit không có khối LUAT-NGAY");
		const kit = new Function(
			`${khoi}\nreturn { mocQuaConViec, viecTre };`,
		)() as {
			mocQuaConViec: (m: unknown, d: string) => boolean;
			viecTre: (l: unknown, d: string) => string[];
		};
		const ngayMoc = dv.duLieu.lo_trinh.flatMap((l) =>
			l.moc.map((m) => m.ngay),
		);
		const ngay = new Set<string>();
		for (const n of ngayMoc) {
			const t = Date.parse(`${n}T00:00:00Z`);
			if (Number.isNaN(t)) continue;
			for (let d = -2; d <= 2; d++)
				ngay.add(new Date(t + d * 86_400_000).toISOString().slice(0, 10));
		}
		const so: unknown[] = [];
		for (const d of [...ngay].sort())
			for (const l of dv.duLieu.lo_trinh)
				so.push({
					ngay: d,
					tep: l.tep,
					trang: {
						moc: l.moc.filter((m) => mocQuaConViec(m, d)).map((m) => m.ten),
						tre: viecTre(l, d),
					},
					kit: {
						moc: l.moc
							.filter((m) => kit.mocQuaConViec(m, d))
							.map((m) => m.ten),
						tre: kit.viecTre(l, d),
					},
				});
		ra.luat_ngay = so;
	}
	writeFileSync(String(process.env.X1_RA), JSON.stringify(ra, null, 1));
}, 300_000);
