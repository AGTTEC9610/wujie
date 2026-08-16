# setupApp

- **Tipo:** `Function`

- **Parámetros:** `cacheOptions`

- **Valor de retorno:** `void`

```typescript
type lifecycle = (appWindow: Window) => any;
type loadErrorHandler = (url: string, e: Error) => any;

type baseOptions = {
  /** el usuario debe garantizar que sea único */
  name: string;
  /** url a renderizar */
  url: string;
  /** html a renderizar; si ya lo tienes, no hace falta pedirlo a la url */
  html?: string;
  /** hook de sustitución de código */
  replace?: (code: string) => string;
  /** fetch personalizado */
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  /** propiedades inyectadas a la subaplicación */
  props?: { [key: string]: any };
  /** atributos personalizados del iframe de ejecución */
  attrs?: { [key: string]: any };
  /** atributos personalizados del iframe de renderizado en modo degradado */
  degradeAttrs?: { [key: string]: any };
  /** la subaplicación se ejecuta en modo fiber */
  fiber?: boolean;
  /** keep-alive de la subaplicación: el state no se pierde */
  alive?: boolean;
  /** la subaplicación usa el esquema degradado con iframe */
  degrade?: boolean;
  /** plugins de la subaplicación */
  plugins?: Array<plugin>;
  /** eventos que escucha el window de la subaplicación */
  iframeAddEventListeners?: Array<string>;
  /** eventos on del iframe de la subaplicación */
  iframeOnEvents?: Array<string>;
  /** ciclos de vida de la subaplicación */
  beforeLoad?: lifecycle;
  beforeMount?: lifecycle;
  afterMount?: lifecycle;
  beforeUnmount?: lifecycle;
  afterUnmount?: lifecycle;
  activated?: lifecycle;
  deactivated?: lifecycle;
  loadError?: loadErrorHandler;
};

type preOptions = baseOptions & {
  /** preejecución */
  exec?: boolean;
};

type startOptions = baseOptions & {
  /** contenedor de renderizado */
  el: HTMLElement | string;
  /**
   * interruptor de sincronización de rutas
   * si es false, la navegación de la subaplicación no cambia la ruta principal,
   * pero el history de la aplicación principal sigue creciendo
   * https://html.spec.whatwg.org/multipage/history.html#the-history-interface
   */
  sync?: boolean;
  /** rutas cortas de la subaplicación; solo aplica con la sincronización activada */
  prefix?: { [key: string]: string };
  /** elemento de loading mientras carga la subaplicación */
  loading?: HTMLElement;
};

type optionProperty = "url" | "el";

/**
 * Combina preOptions y startOptions, y hace opcionales url y el
 */
type cacheOptions = Omit<preOptions & startOptions, optionProperty> & Partial<Pick<startOptions, optionProperty>>;
```

- **Detalle:** `setupApp` define las propiedades por defecto de una subaplicación; no es obligatorio. [startApp](/es/api/startApp.html) y [preloadApp](/es/api/preloadApp.html) leen de aquí esos valores; si reciben la misma propiedad, la sobrescriben directamente.
