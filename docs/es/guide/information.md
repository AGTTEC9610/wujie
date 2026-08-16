---
sidebarDepth: 2
collapsable: false
---

## Diagrama de principios {#diagrama-de-principios}

![Principios](https://vfiles.gtimg.cn/vupload/20211118/f050281637240979027.png)

## Diagrama de ejecución {#diagrama-de-ejecucion}

![Framework](https://vfiles.gtimg.cn/vupload/20211118/f273b01637241117989.png)

Como se ve en el diagrama anterior, el `shadowRoot` y el `iframe` de la subaplicación están desacoplados del componente que la aloja; dentro del `iframe` corre la instancia (`instance`) de la subaplicación.

- Cuando la subaplicación usa **modo keep-alive** y la aplicación principal cambia de ruta, el componente se destruye:

  - El `shadowRoot`, el `iframe` y la `instance` de la subaplicación se conservan.

  - Cuando el componente se vuelve a renderizar, Wujie simplemente reinserta el `shadowRoot` en el contenedor: es un "enchufar y desenchufar" del `shadowRoot`.

- Cuando la subaplicación **no** usa keep-alive y la aplicación principal cambia de ruta, el componente se destruye:

  - Se llama a `window.__WUJIE_UNMOUNT` para destruir la `instance` y se vacían todos los elementos internos del `shadowRoot`, pero tanto el `shadowRoot` como el `iframe` se conservan.

  - Cuando la subaplicación se vuelve a renderizar:

    - Wujie llama a `window.__WUJIE_MOUNT` para crear una nueva `instance`.
    - Wujie vuelve a rellenar el `html` de la subaplicación dentro del `shadowRoot`.
    - La nueva `instance` hace `mount` sobre el `shadowRoot`.

  - Si el usuario no ha definido `window.__WUJIE_UNMOUNT` ni `window.__WUJIE_MOUNT`, cada vez que el componente se re-renderice se destruirá por completo la instancia de `wujie` (incluidos `shadowRoot` e `iframe`) y se creará de nuevo, con el consiguiente tiempo de pantalla en blanco.

Para reflexionar: ¿por qué hay que definir los ciclos de vida `window.__WUJIE_UNMOUNT` y `window.__WUJIE_MOUNT`?

## Interfaces internas {#interfaces-internas}

### Extensiones del objeto `window` de la subaplicación {#extensiones-window}

```typescript
interface Window {
  // indica si Wujie está presente
  __POWERED_BY_WUJIE__?: boolean;
  // public path de la subaplicación
  __WUJIE_PUBLIC_PATH__: string;
  // instancia del sandbox de la subaplicación
  __WUJIE: WuJie;
  // función mount de la subaplicación
  __WUJIE_MOUNT: () => void;
  // función unmount de la subaplicación
  __WUJIE_UNMOUNT: () => void | Promise<void>;
}
```

### El sandbox de Wujie {#sandbox}

```typescript
/**
 * Sandbox de la subaplicación
 * @author damyxu
 * @since 2021-07-14
 */
export default class Wujie {
  id: string;
  /** ruta activa */
  url: string;
  /** keep-alive de la subaplicación */
  alive: boolean;
  /** proxy de window */
  proxy: WindowProxy;
  /** proxy de document */
  proxyDocument: Object;
  /** proxy de location */
  proxyLocation: Object;
  /** centro de eventos */
  bus: EventBus;
  /** contenedor */
  el: HTMLElement;
  /** sandbox de js */
  iframe: HTMLIFrameElement;
  /** sandbox de css */
  shadowRoot: ShadowRoot;
  /** template de la subaplicación */
  template: string;
  /** hook de sustitución de código */
  replace: (code: string) => string;
  /** fetch personalizado de la subaplicación */
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  /** estado ready del sandbox de js */
  iframeReady: Promise<void>;
  /** estado de precarga de la subaplicación */
  preload: Promise<void>;
  /** cola de ejecución de js de la subaplicación */
  execQueue: Array<Function>;
  /** marca de ejecución */
  execFlag: boolean;
  /** marca de mount */
  mountFlag: boolean;
  /** marca de sincronización de rutas */
  sync: boolean;
  /** marca de navegación de la subaplicación */
  hrefFlag: boolean;
  /** la subaplicación se ejecuta en modo fiber */
  fiber: boolean;
  /** elementos styleSheet de la subaplicación */
  styleSheetElements: Array<HTMLLinkElement | HTMLStyleElement>;
  /** objeto $wujie: la interfaz que se ofrece a la subaplicación */
  provide: {
    bus: EventBus;
    shadowRoot?: ShadowRoot;
    props?: {
      [key: string]: any;
    };
    location?: Object;
  };
  /** Activar la subaplicación
   * 1. sincronizar la ruta
   * 2. modificar dinámicamente el fetch del iframe
   * 3. preparar el shadow
   * 4. preparar la inyección de la subaplicación
   */
  active(options: {
    url: string;
    sync?: boolean;
    template?: string;
    el?: string | HTMLElement;
    props?: {
      [key: string]: any;
    };
    alive?: boolean;
    fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
    replace?: (code: string) => string;
  }): Promise<void>;
  /** Arrancar la subaplicación
   * 1. ejecutar el js
   * 2. tratar los estilos de compatibilidad
   */
  start(getExternalScripts: () => ScriptResultList): Promise<void>;
  mount(): void;
  /** Destruir la subaplicación */
  destroy(): void;
  /** Cuando la subaplicación se reactiva solo se ejecuta mount: hay que restaurar los estilos */
  rebuildStyleSheets(): void;
  /** Adapta los estilos del selector :root al selector :host */
  attachHostCssRules(): void;
  /**
   * @param id identificador único de la subaplicación
   * @param url url de la subaplicación; puede incluir protocol, host, path, query y hash
   */
  constructor(
    name: string,
    url: string,
    attrs: {
      [key: string]: any;
    },
    fiber: boolean
  );
}
```

## Detalles de implementación {#detalles}

### Construir un iframe limpio {#iframe-limpio}

La subaplicación se ejecuta en un `iframe` del mismo dominio que la aplicación principal, con el `src` apuntando a la url de la subaplicación pero con el `host` del dominio principal; de la ruta de la subaplicación solo se toman el `pathname` y el `hash` de la `location`.

Ahora bien, en cuanto se asigna el `src`, como el `iframe` es del mismo dominio, cargaría el `html` y el `js` de la aplicación principal. Por eso hay que interrumpir la carga en cuanto el `iframe` esté instanciado pero antes de que termine de cargar el `html`, para no contaminar la subaplicación.

::: warning Recordatorio

- Si se hace `stop` antes de que el `iframe` termine de instanciarse, el `origin` de `location` será `about:blank` y el router de la subaplicación no funcionará.
- Si se borra el contenido con `document.write` durante la instanciación del `iframe`, la sincronización de rutas dejará de funcionar.

:::

Implementación concreta:

```typescript
/**
 * Evita que se ejecute el código js de la aplicación principal,
 * que causaría muchos efectos secundarios en la subaplicación.
 */
// TODO: detectar con más precisión el momento de parada
function stopIframeLoading(iframeWindow: Window) {
  iframeWindow.__WUJIE.iframeReady = new Promise<void>((resolve) => {
    function loop() {
      setTimeout(() => {
        // location ready
        if (iframeWindow.location.href === "about:blank") {
          loop();
        } else {
          iframeWindow.stop();
          initIframeDom(iframeWindow);
          resolve();
        }
      }, 0);
    }
    loop();
  });
}
```

### Interceptación e inyección de datos en el iframe {#interceptacion-iframe}

Cuando el código de la subaplicación accede a `window` o `location` dentro del `iframe`, esos accesos se redirigen a los `proxy` correspondientes. Ojo: este closure solo existe para poder modificar `location`; los objetos `window` y `document` y sus prototipos ya se han modificado directamente.

Cuando el `type` del `script` es `module`, el closure desaparece y hay que acceder a `$wujie.location` para obtener la `location` modificada.

```typescript
const script = `(function(window, self, global, location) {
    ${code}\n
  }).bind(window.__WUJIE.proxy)(
    window.__WUJIE.proxy,
    window.__WUJIE.proxy,
    window.__WUJIE.proxy,
    window.__WUJIE.proxy.location,
  );`;
```

### Tratamiento de los efectos secundarios del iframe y del shadowRoot {#efectos-secundarios}

Los efectos secundarios del `iframe` se tratan durante su inicialización, principalmente en estos pasos:

```javascript
/**
 * 1. Restaura los datos modificados tras interceptar location, para evitar errores de cross-origin
 * 2. Sincroniza la ruta con la aplicación principal
 */
patchIframeHistory(iframeWindow, appPublicPath, mainPublicPath);
/**
 * Intercepta window.addEventListener: por ejemplo, el evento resize debe escucharse en la aplicación principal
 */
patchIframeEvents(iframeWindow);
/**
 * Inyecta variables privadas
 */
patchIframeVariable(iframeWindow, appPublicPath);
/**
 * Centraliza aquí todo lo que tiene efectos secundarios sobre el DOM:
 * por ejemplo, mutationObserver debe usar el de la aplicación principal
 */
patchIframeDomEffect(iframeWindow);
/**
 * Atrás/adelante en la subaplicación: sincroniza la ruta con la aplicación principal
 */
syncIframeUrlToWindow(iframeWindow);
```

Los efectos secundarios dentro del `ShadowRoot` también deben tratarse; sobre todo los del `head` y el `body`:

```javascript
  shadowRoot.head.appendChild = getOverwrittenAppendChildOrInsertBefore({
    rawDOMAppendOrInsertBefore: rawHeadAppendChild
  }) as typeof rawHeadAppendChild
  shadowRoot.head.insertBefore = getOverwrittenAppendChildOrInsertBefore({
    rawDOMAppendOrInsertBefore: rawHeadInsertBefore as any
  }) as typeof rawHeadInsertBefore
  shadowRoot.body.appendChild = getOverwrittenAppendChildOrInsertBefore({
    rawDOMAppendOrInsertBefore: rawBodyAppendChild
  }) as typeof rawBodyAppendChild
  shadowRoot.body.insertBefore = getOverwrittenAppendChildOrInsertBefore({
    rawDOMAppendOrInsertBefore: rawBodyInsertBefore as any
  }) as typeof rawBodyInsertBefore
```

`getOverwrittenAppendChildOrInsertBefore` trata principalmente cuatro tipos de etiquetas:

- **Etiquetas `link`/`style`**

  Recopila los `stylesheetElement` para reconstruir los estilos cuando la subaplicación se reactiva.

- **Etiqueta `script`**

  Las etiquetas `script` insertadas dinámicamente deben moverse del `ShadowRoot` al interior del `iframe` para ejecutarse.

- **Etiqueta `iframe`**

  Corrige el `iframe` para que apunte al `window` del `iframe` de la subaplicación correspondiente.

::: tip Beneficios

- **El framework gestiona todos los efectos secundarios a nivel de js, css y dom: integrar una aplicación no tiene coste de adaptación.**
- **Los efectos secundarios quedan confinados dentro del iframe y del ShadowRoot, sin desbordarse.**
  :::

### Adaptación del document del iframe {#document-del-iframe}

```typescript
new Proxy(
  {},
  {
    get: function (_fakeDocument, propKey) {
      const document = window.document;
      const shadowRoot = iframe.contentWindow.__WUJIE.shadowRoot;
      // need fix
      if (propKey === "createElement" || propKey === "createTextNode") {
        return new Proxy(document[propKey], {
          apply(createElement, _ctx, args) {
            const element = createElement.apply(iframe.contentDocument, args);
            patchElementEffect(element, iframe.contentWindow);
            return element;
          },
        });
      }
      if (propKey === "documentURI" || propKey === "URL") {
        return (iframe.contentWindow.__WUJIE.proxyLocation as Location).href;
      }

      // from shadowRoot
      if (
        propKey === "getElementsByTagName" ||
        propKey === "getElementsByClassName" ||
        propKey === "getElementsByName"
      ) {
        return new Proxy(shadowRoot.querySelectorAll, {
          apply(querySelectorAll, _ctx, args) {
            let arg = args[0];
            if (propKey === "getElementsByClassName") arg += ".";
            if (propKey === "getElementsByName") arg = `[name="${arg}"]`;
            return querySelectorAll.call(shadowRoot, arg);
          },
        });
      }
      if (propKey === "getElementById") {
        return new Proxy(shadowRoot.querySelector, {
          apply(querySelector, _ctx, args) {
            return querySelector.call(shadowRoot, `#${args[0]}`);
          },
        });
      }
      if (propKey === "querySelector" || propKey === "querySelectorAll") {
        return shadowRoot[propKey].bind(shadowRoot);
      }
      if (propKey === "documentElement" || propKey === "scrollingElement") return shadowRoot.firstElementChild;
      if (propKey === "forms") return shadowRoot.querySelectorAll("form");
      if (propKey === "images") return shadowRoot.querySelectorAll("img");
      if (propKey === "links") return shadowRoot.querySelectorAll("a");
      const { ownerProperties, shadowProperties, shadowMethods, documentProperties, documentMethods } =
        documentProxyProperties;
      if (ownerProperties.concat(shadowProperties).includes(propKey.toString())) {
        return shadowRoot[propKey];
      }
      if (shadowMethods.includes(propKey.toString())) {
        return getTargetValue(shadowRoot, propKey) ?? getTargetValue(document, propKey);
      }
      // from window.document
      if (documentProperties.includes(propKey.toString())) {
        return document[propKey];
      }
      if (documentMethods.includes(propKey.toString())) {
        return getTargetValue(document, propKey);
      }
    },
  }
);
```

### Adaptación de la location del iframe {#location-del-iframe}

```typescript
new Proxy(
  {},
  {
    get: function (fakeLocation, propKey) {
      const location = target.location;
      if (propKey === "host" || propKey === "hostname" || propKey === "protocol" || propKey === "port") {
        return urlElement[propKey];
      }
      if (propKey === "href") {
        return target.location[propKey].replace(mainPublicPath, appPublicPath);
      }
      if (propKey === "reload") {
        warn("la llamada a reload desde la subaplicación no tiene efecto");
        return () => null;
      }
      return getTargetValue(location, propKey);
    },
    set: function (location, propKey, value, receiver) {
      // si es una navegación, se abre un nuevo iframe
      if (propKey === "href") {
        const { shadowRoot, id } = target.__WUJIE;
        let url = value;
        if (!/^http/.test(url)) {
          let hrefElement = anchorElementGenerator(url);
          url = appPublicPath + hrefElement.pathname + hrefElement.search + hrefElement.hash;
          hrefElement = null;
        }
        target.__WUJIE.hrefFlag = true;
        renderIframeReplaceShadowRoot(url, shadowRoot);
        pushUrlToWindow(id, url);
        return true;
      }
      return Reflect.set(location, propKey, value, receiver);
    },
  }
);
```
