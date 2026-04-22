import { setLocale, getLocale, t } from "../../src/i18n";

describe("i18n", () => {
  afterEach(() => {
    setLocale("zh-CN");
  });

  test("default locale is zh-CN and falls back to the key verbatim", () => {
    expect(getLocale()).toBe("zh-CN");
    expect(t("url参数为空")).toBe("url参数为空");
  });

  test("setLocale('es') translates known keys", () => {
    setLocale("es");
    expect(getLocale()).toBe("es");
    expect(t("url参数为空")).toBe("El parámetro url está vacío");
    expect(t("事件订阅数量为空")).toBe("No hay suscriptores para este evento");
  });

  test("setLocale('en') translates known keys", () => {
    setLocale("en");
    expect(t("脚本请求出现错误")).toBe("Script request failed");
  });

  test("unknown keys fall back to the original msg (upstream-added tips keep working)", () => {
    setLocale("es");
    expect(t("某个未知的错误")).toBe("某个未知的错误");
  });

  test("interpolates {placeholder} tokens", () => {
    setLocale("es");
    const out = t("Failed to removeChild: {child} is not a child of {parent}, try again with parentNode attribute.", {
      child: "div",
      parent: "body",
    });
    expect(out).toBe("removeChild falló: div no es hijo de body; se reintentará mediante el atributo parentNode.");
  });

  test("missing placeholder values are left intact", () => {
    setLocale("en");
    const out = t("Failed to removeChild: {child} is not a child of {parent}, try again with parentNode attribute.", {
      child: "div",
    });
    expect(out).toContain("div");
    expect(out).toContain("{parent}");
  });

  test("customMessages override / extend the dictionary for a locale", () => {
    setLocale("es", { "url参数为空": "URL vacía (custom)" });
    expect(t("url参数为空")).toBe("URL vacía (custom)");
    expect(t("事件订阅数量为空")).toBe("No hay suscriptores para este evento");
  });

  test("supports arbitrary new locales via customMessages", () => {
    setLocale("fr", { "url参数为空": "Le paramètre url est vide" });
    expect(getLocale()).toBe("fr");
    expect(t("url参数为空")).toBe("Le paramètre url est vide");
    expect(t("事件订阅数量为空")).toBe("事件订阅数量为空");
  });
});
