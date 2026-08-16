# preloadApp

- **Tipo:** `Function`

- **Parámetros:** `preOption`

```typescript
type lifecycle = (appWindow: Window) => any;
type loadErrorHandler = (url: string, e: Error) => any;

type preOptions  {
  /** el usuario debe garantizar que sea único */
  name: string;
  /** url a renderizar */
  url: string;
  /** html a renderizar; si ya lo tienes, no hace falta pedirlo a la url */
  html?: string;
  /** datos inyectados a la subaplicación */
  props?: { [key: string]: any };
  /** atributos personalizados del iframe de ejecución */
  attrs?: { [key: string]: any };
  /** atributos personalizados del iframe de renderizado en modo degradado */
  degradeAttrs?: { [key: string]: any };
  /** hook de sustitución de código */
  replace?: (code: string) => string;
  /** fetch personalizado para recursos y peticiones */
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  /** modo keep-alive: el state no se pierde */
  alive?: boolean;
  /** modo de preejecución */
  exec?: boolean;
  /** ejecutar el js en modo fiber */
  fiber?: boolean;
  /** la subaplicación usa el esquema degradado con iframe */
  degrade?: boolean;
  /** eventos que escucha el window de la subaplicación */
  iframeAddEventListeners?: Array<string>;
  /** eventos on del iframe de la subaplicación */
  iframeOnEvents?: Array<string>;
  /** plugins de la subaplicación */
  plugins: Array<plugin>;
  /** ciclos de vida de la subaplicación */
  beforeLoad?: lifecycle;
  /** no se llaman si la subaplicación no ha adaptado su ciclo de vida */
  beforeMount?: lifecycle;
  afterMount?: lifecycle;
  beforeUnmount?: lifecycle;
  afterUnmount?: lifecycle;
  /** no se llaman en subaplicaciones sin keep-alive */
  activated?: lifecycle;
  deactivated?: lifecycle;
  /** se llama cuando falla la carga de recursos de la subaplicación */
  loadError?: loadErrorHandler
};

```

- **Detalle:** la precarga mejora enormemente la velocidad de la primera apertura de la subaplicación.

  ::: warning Advertencia

  - La precarga de recursos ocupa el pool de conexiones de red de la aplicación principal.
  - La preejecución de recursos bloquea el hilo de renderizado de la aplicación principal.
  - Los parámetros `name`, `replace`, `fetch`, `alive` y `degrade` deben ser estrictamente iguales en `preloadApp` y `startApp`; de lo contrario el renderizado puede fallar.
    :::

## name

- **Tipo:** `String`

- **Detalle:** identificador único de la subaplicación.

  ::: tip Truco
  Si en la aplicación principal hay varias entradas de menú que usan páginas distintas de la misma subaplicación, conviene usar el mismo `name` al arrancarla en cada página para compartir una única instancia.
  :::

## url

- **Tipo:** `String`

- **Detalle:** dirección de la subaplicación.

## html

- **Tipo:** `String`

- **Detalle:** el `html` de la subaplicación. Si se define, se usa directamente ese valor; si no, se solicita a través de la `url`.

## props

- **Tipo:** `{ [key: string]: any }`

- **Detalle:** datos inyectados a la subaplicación.

  ::: warning Advertencia
  Con `exec` a `true` el código de la subaplicación se preejecuta. Si su ejecución depende de los datos de `props`, debes pasarlos aquí o hacer que la subaplicación tolere su ausencia; de lo contrario puede fallar.
  :::

## attrs

- **Tipo:** `{ [key: string]: any }`

- **Detalle:** atributos personalizados del `iframe`. Como la subaplicación se ejecuta dentro de un `iframe`, `attrs` permite definir sus atributos.

## replace

- **Tipo:** `(codeText: string) => string`

- **Detalle:** hook global de sustitución de código.

  ::: tip Truco
  La función `replace` permite procesar el código de la subaplicación en tiempo de ejecución. Si no es cómodo modificar el código de la subaplicación, puedes sustituirlo aquí: se aplica a su `html`, `js` y `css`.
  :::

## fetch

- **Tipo:** `(input: RequestInfo, init?: RequestInit) => Promise<Response>`

- **Detalle:**
  `fetch` personalizado. Al definirlo, tanto las peticiones de recursos estáticos de la subaplicación como las peticiones de API que usen `fetch` pasarán por él.

  ::: tip Truco
  Para peticiones que deban llevar cookies, usa un `fetch` personalizado: `(url, options) => window.fetch(url, { ...options, credentials: "include" })`
  :::

## alive

- **Valor por defecto:** `false`

- **Tipo:** `Boolean`

- **Detalle:**

  Modo keep-alive: ni la instancia de la subaplicación ni el webcomponent se destruyen, así que no se pierden ni su estado ni su ruta; cambiar de subaplicación es solo conectar y desconectar el webcomponent y el contenedor.

  Si no quieres adaptar el ciclo de vida de la subaplicación y tampoco quieres pantalla en blanco al cambiar, usa el modo keep-alive.

  Si en la aplicación principal hay varias entradas de menú que llevan a páginas distintas de la subaplicación, no se recomienda keep-alive: en ese estado `startApp` no puede cambiar la ruta de la subaplicación. Usa mejor el [modo singleton](/es/guide/mode.html#modo-singleton).

  ::: tip Truco
  Combinar el [modo de preejecución](/es/api/preloadApp.html#exec) con el keep-alive consigue un efecto parecido a `ssr`: tanto las peticiones de datos como el renderizado se completan por adelantado y la subaplicación se abre al instante.
  :::

## exec

- **Valor por defecto:** `false`

- **Tipo:** `Boolean`

- **Detalle:** modo de preejecución. Con `false` solo se precargan los recursos de la subaplicación; con `true` también se preejecuta su código, lo que acelera enormemente su apertura.

## fiber

- **Valor por defecto:** `true`

- **Tipo:** `Boolean`

- **Detalle:**

  Modo de ejecución del js. Como la ejecución de la subaplicación bloquea el hilo de renderizado de la aplicación principal, con `true` el `js` se ejecuta de forma intermitente al estilo de `react fiber`: la ejecución de cada fichero js se envuelve en un `requestIdleCallback`, de modo que entre fichero y fichero se puede responder a la entrada del usuario. La granularidad es el fichero `js`, así que si la subaplicación tiene un fichero muy grande conviene dividirlo para aprovechar mejor el modo `fiber`.

  ::: tip Truco

  - Para subaplicaciones que deben cargarse nada más abrir la aplicación principal, pon `fiber` a `false` para acelerar la carga.

  - En el resto de escenarios, usa el valor por defecto.

  :::

## degrade

- **Valor por defecto:** `false`

- **Tipo:** `Boolean`

- **Detalle:**

  Degradación manual. Wujie usa técnicas como `proxy` y webcomponent que pueden no ser compatibles con algunos navegadores; en ese caso degrada automáticamente sustituyendo el webcomponent por un `iframe` y el `proxy` por `Object.defineProperty`, lo que en teoría permite llegar hasta IE 9. También puedes poner `degrade` a `true` para degradar manualmente.

  ::: warning Advertencia
  Con el esquema degradado, los modales quedan dentro del iframe y no pueden cubrir toda la aplicación.
  :::

## plugins

- **Tipo:** `Array<plugin>`

```typescript
interface ScriptObjectLoader {
  /** dirección del script; vacío si es inline */
  src?: string;
  /** si el script es un módulo */
  module?: boolean;
  /** si el script se ejecuta como async */
  async?: boolean;
  /** si el script define crossorigin */
  crossorigin?: boolean;
  /** tipo de crossorigin del script */
  crossoriginType?: "anonymous" | "use-credentials" | "";
  /** código del script inline */
  content?: string;
  /** hook de callback de ejecución */
  callback?: (appWindow: Window) => any;
}

interface StyleObjectLoader {
  /** dirección del estilo; vacío si es inline */
  src?: string;
  /** código del estilo */
  content?: string;
}

type eventListenerHook = (
  iframeWindow: Window,
  type: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
) => void;

interface plugin {
  /** loader para procesar el html */
  htmlLoader?: (code: string) => string;
  /** lista de exclusión de js */
  jsExcludes?: Array<string | RegExp>;
  /** lista de js ignorados */
  jsIgnores?: Array<string | RegExp>;
  /** loader previo a la carga del js */
  jsBeforeLoaders?: Array<ScriptObjectLoader>;
  /** loader para procesar el js */
  jsLoader?: (code: string, url: string, base: string) => string;
  /** loader posterior a la carga del js */
  jsAfterLoaders?: Array<ScriptObjectLoader>;
  /** lista de exclusión de css */
  cssExcludes?: Array<string | RegExp>;
  /** lista de css ignorados */
  cssIgnores?: Array<string | RegExp>;
  /** loader previo a la carga del css */
  cssBeforeLoaders?: Array<StyleObject>;
  /** loader para procesar el css */
  cssLoader?: (code: string, url: string, base: string) => string;
  /** loader posterior a la carga del css */
  cssAfterLoaders?: Array<StyleObject>;
  /** hook de window addEventListener de la subaplicación */
  windowAddEventListenerHook?: eventListenerHook;
  /** hook de window removeEventListener de la subaplicación */
  windowRemoveEventListenerHook?: eventListenerHook;
  /** hook de document addEventListener de la subaplicación */
  documentAddEventListenerHook?: eventListenerHook;
  /** hook de document removeEventListener de la subaplicación */
  documentRemoveEventListenerHook?: eventListenerHook;
  /** hook tras insertar un elemento en body o head */
  appendOrInsertElementHook?: <T extends Node>(element: T, iframeWindow: Window) => void;
  /** hook de interceptación de elementos de la subaplicación */
  patchElementHook?: <T extends Node>(element: T, iframeWindow: Window) => void;
  /** sobrescritura personalizada de propiedades del window de la subaplicación */
  windowPropertyOverride?: (iframeWindow: Window) => void;
  /** sobrescritura personalizada de propiedades del document de la subaplicación */
  documentPropertyOverride?: (iframeWindow: Window) => void;
}
```

- **Detalle:** plugins de Wujie, que modifican dinámicamente el proxy de la subaplicación en tiempo de ejecución. Uso detallado en el [ejemplo](/es/guide/plugin.html).

## beforeLoad

- **Tipo:** `(appWindow: Window) => any`

- **Detalle:** hook de ciclo de vida, se llama antes de cargar la subaplicación.

## beforeMount

- **Tipo:** `(appWindow: Window) => any`

- **Detalle:** hook de ciclo de vida, se llama antes del `mount` de la subaplicación.

## afterMount

- **Tipo:** `(appWindow: Window) => any`

- **Detalle:** hook de ciclo de vida, se llama después del `mount` de la subaplicación.

## beforeUnmount

- **Tipo:** `(appWindow: Window) => any`

- **Detalle:** hook de ciclo de vida, se llama antes del `unmount` de la subaplicación.

## afterUnmount

- **Tipo:** `(appWindow: Window) => any`

- **Detalle:** hook de ciclo de vida, se llama después del `unmount` de la subaplicación.

## activated

- **Tipo:** `(appWindow: Window) => any`

- **Detalle:** hook de ciclo de vida, se dispara al entrar en una subaplicación en keep-alive.

## deactivated

- **Tipo:** `(appWindow: Window) => any`

- **Detalle:** hook de ciclo de vida, se dispara al salir de una subaplicación en keep-alive.

## loadError

- **Tipo:** `(url: string, e: Error) => any`

- **Detalle:** hook de ciclo de vida, se dispara cuando falla la carga de un recurso de la subaplicación.

::: warning Atención
Si la subaplicación no ha hecho la [adaptación del ciclo de vida](/es/guide/start.html#adaptar-el-ciclo-de-vida), los hooks `beforeMount`, `afterMount`, `beforeUnmount` y `afterUnmount` no se llamarán; en subaplicaciones sin keep-alive tampoco se llamarán `activated` ni `deactivated`.
:::
