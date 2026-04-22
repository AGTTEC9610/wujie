// Smoke test against the BUILT package (lib/index.js) — the same entry consumers
// resolve. Complements i18n.test.ts (which exercises the source) by catching any
// regression introduced by the webpack/babel build pipeline.
// Skipped automatically when lib/ is missing (e.g. fresh checkout without `prepack`).
import * as fs from "fs";
import * as path from "path";

const libPath = path.resolve(__dirname, "../../lib/index.js");
const hasBuiltBundle = fs.existsSync(libPath);
const wujie: any = hasBuiltBundle ? require(libPath) : null;

const describeIfBuilt = hasBuiltBundle ? describe : describe.skip;

describeIfBuilt("built bundle i18n", () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    wujie.setLocale("zh-CN");
  });

  test("setLocale / getLocale are exported from the built package", () => {
    expect(typeof wujie.setLocale).toBe("function");
    expect(typeof wujie.getLocale).toBe("function");
  });

  test("default (zh-CN): warn emits the original Chinese string", () => {
    wujie.bus.$emit("built-bundle-smoke-zh");
    const out = warnSpy.mock.calls.map((c) => c.join(" ")).join("\n");
    expect(out).toContain("事件订阅数量为空");
  });

  test("setLocale('es'): warn emits the Spanish translation", () => {
    wujie.setLocale("es");
    wujie.bus.$emit("built-bundle-smoke-es");
    const out = warnSpy.mock.calls.map((c) => c.join(" ")).join("\n");
    expect(out).toContain("No hay suscriptores para este evento");
  });

  test("setLocale('en'): warn emits the English translation", () => {
    wujie.setLocale("en");
    wujie.bus.$emit("built-bundle-smoke-en");
    const out = warnSpy.mock.calls.map((c) => c.join(" ")).join("\n");
    expect(out).toContain("No subscribers for this event");
  });
});
