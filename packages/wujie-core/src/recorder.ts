/**
 * 录屏脚本（如 Microsoft Clarity）兼容。
 *
 * 子应用的 <html> 渲染在 shadowRoot 里，但它的 parentNode / ownerDocument 被改写成
 * iframe 的 document，好让子应用代码以为自己在独立的文档中。录屏脚本在主应用里遍历 DOM，
 * 看到 ownerDocument !== document 时会把这个 <html> 当成某个 iframe 的根节点，
 * 再去找该 iframe；找不到就丢掉整棵子树，回放里子应用区域是空的。
 *
 * 声明录屏脚本后，只有调用栈来自这些脚本的读取才拿到真实值（shadowRoot / 主 document），
 * 子应用代码看到的仍是 iframe 的 document。未声明时不做任何改变。
 */

/** 只看调用栈最上面几帧：getter 被录屏脚本直接读取时，它的帧就在这里。 */
const RECORDER_STACK_FRAMES = 5;

let recorderScripts: RegExp[] = [];

/**
 * 声明会遍历主应用 DOM 的录屏脚本，按脚本 URL 匹配，例如 `[/clarity\.ms/]`。
 * 传空数组关闭。
 */
export function setRecorderScripts(patterns: RegExp[]): void {
  // 去掉 g / y：带状态的 RegExp.test 会因 lastIndex 时真时假
  recorderScripts = (patterns ?? []).map((re) => new RegExp(re.source, re.flags.replace(/[gy]/g, "")));
}

export function isRecorderAccess(): boolean {
  if (!recorderScripts.length) return false;
  const frames = (new Error().stack ?? "").split("\n").slice(0, RECORDER_STACK_FRAMES).join("\n");
  return recorderScripts.some((re) => re.test(frames));
}

/**
 * 给 shadowRoot 里的子应用 <html> 加上录屏脚本分支：parentNode 给 shadowRoot，
 * ownerDocument 给主 document；其余调用方保持原有的 iframe document 语义。
 */
export function patchShadowHtmlForRecorder(
  shadowHtml: HTMLElement,
  shadowRoot: ShadowRoot,
  iframeWindow: Window
): void {
  // patchElementEffect 已经给 <html> 装了 ownerDocument getter；没装上时退回原生的
  const ownerDocumentGetter =
    Object.getOwnPropertyDescriptor(shadowHtml, "ownerDocument")?.get ??
    Object.getOwnPropertyDescriptor(Node.prototype, "ownerDocument").get;
  Object.defineProperties(shadowHtml, {
    parentNode: {
      enumerable: true,
      configurable: true,
      get: () => (isRecorderAccess() ? shadowRoot : iframeWindow.document),
    },
    ownerDocument: {
      configurable: true,
      get() {
        if (isRecorderAccess()) return window.document;
        return ownerDocumentGetter.call(this);
      },
    },
  });
}
