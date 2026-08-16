# startApp

- **Tipo:** `Function`

- **Parámetros:** `startOption`

- **Valor de retorno:** `Promise<Function>`

```typescript
type lifecycle = (appWindow: Window) => any;
type loadErrorHandler = (url: string, e: Error) => any;

type startOption  {
  /** el usuario debe garantizar que sea único */
  name: string;
  /** url a renderizar */
  url: string;
  /** html a renderizar; si ya lo tienes, no hace falta pedirlo a la url */
  html?: string;
  /** contenedor de renderizado */
  el: HTMLElement | string;
  /** elemento de loading mientras carga la subaplicación */
  loading?: HTMLElement;
  /** interruptor de sincronización de rutas; con false refrescar no sirve, pero atrás/adelante sí */
  sync?: boolean;
  /** rutas cortas de la subaplicación; solo aplica con la sincronización activada */
  prefix?: { [key: string]: string };
  /** modo keep-alive: el state no se pierde */
  alive?: boolean;
  /** datos inyectados a la subaplicación */
  props?: { [key: string]: any };
  /** ejecutar el js en modo fiber */
  fiber?: boolean;
  /** la subaplicación usa el esquema degradado con iframe */
  degrade?: boolean;
  /** atributos personalizados del iframe de ejecución */
  attrs?: { [key: string]: any };
  /** atributos personalizados del iframe de renderizado en modo degradado */
  degradeAttrs?: { [key: string]: any };
  /** hook de sustitución de código */
  replace?: (codeText: string) => string;
  /** fetch personalizado para recursos y peticiones */
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
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

- **Detalle:** `startApp` arranca la subaplicación y devuelve de forma asíncrona una función **destroy** que la destruye. En general no se recomienda llamarla salvo que entiendas bien sus consecuencias.

  ::: warning Advertencia

  - Normalmente no hace falta llamar a `destroy` para destruir la subaplicación, salvo que la aplicación principal no vaya a volver a abrirla nunca; destruirla provoca pantalla en blanco la próxima vez que se abra.
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
  - En [modo singleton](/es/guide/mode.html#modo-singleton), cambiar la `url` hace que la subaplicación navegue a la subruta correspondiente.
  - En [modo keep-alive](/es/guide/mode.html#modo-keep-alive), cambiar la `url` no tiene efecto: hay que usar la [comunicación](/es/guide/communication.html) para navegar dentro de la subaplicación.
  - En [modo rebuild](/es/guide/mode.html#modo-rebuild), cambiar la `url` navega a la ruta correspondiente, salvo en el escenario de [sincronización de rutas](/es/guide/sync.html) cuando el parámetro sincronizado ya está en la `url` principal: al cambiar la `url` la subaplicación se destruye y se vuelve a renderizar, y entonces el parámetro sincronizado tiene la máxima prioridad.

## html

- **Tipo:** `String`

- **Detalle:** el `html` de la subaplicación. Si se define, se usa directamente ese valor; si no, se solicita a través de la `url`.

## el

- **Tipo:** `HTMLElement | string`

- **Detalle:** contenedor de renderizado de la subaplicación. Conviene fijarle ancho y alto para evitar problemas de renderizado. Wujie añade además la clase `wujie_iframe` al elemento webcomponent para facilitar los estilos personalizados.

## loading

- **Tipo:** `HTMLElement`

- **Detalle:** elemento de `loading` personalizado. Si no quieres que aparezca el de por defecto, asígnale un elemento vacío: `document.createElement('span')`.

## sync

- **Valor por defecto:** `false`

- **Tipo:** `Boolean`

- **Detalle:** modo de sincronización de rutas. Al activarlo, Wujie usa el `name` de la subaplicación como parámetro de consulta de la `url` y sincroniza en tiempo real la ruta de la subaplicación como valor de ese parámetro, de modo que al compartir la URL o refrescar el navegador no se pierde la ruta.

  ::: warning Advertencia
  La sincronización es unidireccional: la subaplicación solo lee la ruta desde la URL al abrirla o al refrescar el navegador. Si desactivas la sincronización, atrás y adelante siguen funcionando sobre la subaplicación, pero al refrescar se pierde su ruta.
  :::

## prefix

- **Tipo:** `{[key: string]: string }`

- **Detalle:** rutas cortas. Con la sincronización activada, si el enlace de la subaplicación es demasiado largo puedes acortarlo mediante sustitución. Uso detallado en el [ejemplo](/es/guide/sync.html#rutas-cortas).

## alive

- **Valor por defecto:** `false`

- **Tipo:** `Boolean`

- **Detalle:**

  Modo keep-alive: ni la instancia de la subaplicación ni el webcomponent se destruyen, así que no se pierden ni su estado ni su ruta; cambiar de subaplicación es solo conectar y desconectar el webcomponent.

  Si no quieres adaptar el ciclo de vida de la subaplicación y tampoco quieres pantalla en blanco al cambiar, usa el modo keep-alive.

  Si en la aplicación principal hay varias entradas de menú que llevan a páginas distintas de la subaplicación, no se recomienda keep-alive: en ese estado `startApp` no puede cambiar la ruta de la subaplicación, así que los distintos menús no podrán llevar a la ruta deseada. Usa mejor el [modo singleton](/es/guide/mode.html#modo-singleton).

  ::: tip Truco
  Combinar el [modo de preejecución](/es/api/preloadApp.html#exec) con el keep-alive consigue un efecto parecido a `ssr`: tanto las peticiones de datos como el renderizado se completan por adelantado y la subaplicación se abre al instante.
  :::

## props

- **Tipo:** `{ [key: string]: any }`

- **Detalle:** datos inyectados a la subaplicación.

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

## iframeAddEventListeners

- **Tipo:** `Array<string>`

- **Detalle:** eventos que debe escuchar el `window` de la subaplicación.

## iframeOnEvents

- **Tipo:** `Array<string>`

- **Detalle:** eventos `on` que debe escuchar el `window` de la subaplicación.

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
