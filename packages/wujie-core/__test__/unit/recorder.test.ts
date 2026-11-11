/**
 * 录屏脚本兼容：只有录屏脚本读到子应用 <html> 的真实 parentNode / ownerDocument，
 * 子应用代码看到的仍是 iframe 的 document。
 */

export {};

import { patchElementEffect } from "../../src/iframe";
import { patchShadowHtmlForRecorder, setRecorderScripts } from "../../src/recorder";
import { readAsRecorder } from "./fixtures/fake-recorder";

function mountHtmlInShadow() {
  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  const iframeWindow: any = iframe.contentWindow;
  iframeWindow.__WUJIE = { id: "recorder-test", plugins: [], proxyLocation: null };

  const host = document.createElement("div");
  document.body.appendChild(host);
  const shadowRoot = host.attachShadow({ mode: "open" });
  const html = document.createElement("html");
  shadowRoot.appendChild(html);
  patchElementEffect(html, iframeWindow);
  patchShadowHtmlForRecorder(html, shadowRoot, iframeWindow);
  return { html, shadowRoot, iframeWindow };
}

describe("patchShadowHtmlForRecorder", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    setRecorderScripts([]);
  });

  afterAll(() => setRecorderScripts([]));

  test("未声明录屏脚本：所有读取都保持 iframe document 语义", () => {
    const { html, iframeWindow } = mountHtmlInShadow();

    expect(html.parentNode).toBe(iframeWindow.document);
    expect(html.ownerDocument).toBe(iframeWindow.document);
    expect(readAsRecorder(html)).toEqual({
      parentNode: iframeWindow.document,
      ownerDocument: iframeWindow.document,
    });
  });

  test("录屏脚本读取：parentNode 给 shadowRoot，ownerDocument 给主 document", () => {
    setRecorderScripts([/fake-recorder/]);
    const { html, shadowRoot } = mountHtmlInShadow();

    const seen = readAsRecorder(html);
    expect(seen.parentNode).toBe(shadowRoot);
    expect(seen.ownerDocument).toBe(document);
  });

  test("子应用代码读取：声明了录屏脚本也不受影响", () => {
    setRecorderScripts([/fake-recorder/]);
    const { html, iframeWindow } = mountHtmlInShadow();

    expect(html.parentNode).toBe(iframeWindow.document);
    expect(html.ownerDocument).toBe(iframeWindow.document);
  });

  test("带 g 标志的正则：连续读取结果一致", () => {
    setRecorderScripts([/fake-recorder/g]);
    const { html, shadowRoot } = mountHtmlInShadow();

    expect(readAsRecorder(html).parentNode).toBe(shadowRoot);
    expect(readAsRecorder(html).parentNode).toBe(shadowRoot);
  });

  test("沙箱销毁后 ownerDocument 仍按原逻辑降级为主 document", () => {
    const { html, iframeWindow } = mountHtmlInShadow();
    iframeWindow.__WUJIE = null;

    expect(html.ownerDocument).toBe(document);
  });
});
