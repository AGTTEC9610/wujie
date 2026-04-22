/**
 * i18n para los mensajes internos de wujie (warn/error).
 *
 * Las claves del diccionario son los strings originales en chino tal como se
 * definen en `constant.ts` (más el mensaje inline en inglés de `iframe.ts`).
 * Mantener `constant.ts` y los call-sites intactos minimiza conflictos al
 * rebasar con upstream (Tencent/wujie).
 *
 * Uso:
 *   import { setLocale } from "wujie";
 *   setLocale("es");
 */

export type Locale = "zh-CN" | "es" | "en" | (string & {});

type Dict = Record<string, string>;

const STOP_APP_ZH = "此报错可以忽略，iframe主动中断主应用代码在子应用运行";
const STOP_APP_DETAIL_ZH = STOP_APP_ZH + "，详见：https://github.com/Tencent/wujie/issues/54";

const es: Dict = {
  url参数为空: "El parámetro url está vacío",
  子应用调用reload无法生效: "La llamada a reload desde la subaplicación no tiene efecto",
  [STOP_APP_ZH]:
    "Este error puede ignorarse: el iframe interrumpió deliberadamente la ejecución del código de la aplicación principal dentro de la subaplicación",
  [STOP_APP_DETAIL_ZH]:
    "Este error puede ignorarse: el iframe interrumpió deliberadamente la ejecución del código de la aplicación principal dentro de la subaplicación. Detalles: https://github.com/Tencent/wujie/issues/54",
  事件订阅数量为空: "No hay suscriptores para este evento",
  "window上不存在fetch属性，需要自行polyfill": "window.fetch no existe; debes proveer tu propio polyfill",
  "当前浏览器不支持无界，子应用将采用iframe方式渲染":
    "El navegador actual no es compatible con wujie; la subaplicación se renderizará como iframe",
  脚本请求出现错误: "Error al solicitar el script",
  样式请求出现错误: "Error al solicitar la hoja de estilos",
  html请求出现错误: "Error al solicitar el HTML",
  "无界组件短时间重复渲染了两次，可能存在性能问题请检查代码":
    "El componente wujie se renderizó dos veces en un intervalo breve; podría haber un problema de rendimiento, revisa el código",
  目标Script尚未准备好或已经被移除: "El script objetivo aún no está listo o ya fue removido",
  "不支持document.getElementById()传入特殊字符，请参考document.querySelector文档":
    "document.getElementById() no admite caracteres especiales; consulta la documentación de document.querySelector",
  "Failed to removeChild: {child} is not a child of {parent}, try again with parentNode attribute.":
    "removeChild falló: {child} no es hijo de {parent}; se reintentará mediante el atributo parentNode.",
};

const en: Dict = {
  url参数为空: "url parameter is empty",
  子应用调用reload无法生效: "Calling reload from the sub-application has no effect",
  [STOP_APP_ZH]:
    "This error can be ignored: the iframe intentionally interrupted the main application's code running inside the sub-application",
  [STOP_APP_DETAIL_ZH]:
    "This error can be ignored: the iframe intentionally interrupted the main application's code running inside the sub-application. Details: https://github.com/Tencent/wujie/issues/54",
  事件订阅数量为空: "No subscribers for this event",
  "window上不存在fetch属性，需要自行polyfill": "window.fetch is missing; please provide a polyfill",
  "当前浏览器不支持无界，子应用将采用iframe方式渲染":
    "The current browser does not support wujie; the sub-application will be rendered as an iframe",
  脚本请求出现错误: "Script request failed",
  样式请求出现错误: "Stylesheet request failed",
  html请求出现错误: "HTML request failed",
  "无界组件短时间重复渲染了两次，可能存在性能问题请检查代码":
    "The wujie component rendered twice in a short interval; this may indicate a performance issue — please review your code",
  目标Script尚未准备好或已经被移除: "The target script is not ready yet or has been removed",
  "不支持document.getElementById()传入特殊字符，请参考document.querySelector文档":
    "document.getElementById() does not support special characters; see the document.querySelector documentation",
};

const dictionaries: Record<string, Dict> = { es, en };

let currentLocale: Locale = "zh-CN";

export function setLocale(locale: Locale, customMessages?: Dict): void {
  currentLocale = locale;
  if (customMessages) {
    dictionaries[locale] = { ...(dictionaries[locale] || {}), ...customMessages };
  }
}

export function getLocale(): Locale {
  return currentLocale;
}

const PLACEHOLDER_RE = /\{(\w+)\}/g;

export function t(msg: string, vars?: Record<string, string | number>): string {
  const dict = dictionaries[currentLocale as string];
  const translated = (dict && dict[msg]) || msg;
  if (!vars) return translated;
  return translated.replace(PLACEHOLDER_RE, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}
