![Diagrama de plugins](https://vfiles.gtimg.cn/wuji_dashboard/wupload/xy/test_wuji_damy/50LRt2ig.jpeg)

El sistema de plugins de Wujie sirve principalmente para que puedas modificar en tiempo de ejecución el código de la subaplicación, evitando tocar el código del repositorio. Ver la [API](/es/api/startApp.html#plugins).

## html-loader

Wujie ofrece un plugin para modificar en tiempo de ejecución el texto `html` de la subaplicación.

- **Ejemplo**

```javascript
const plugins = [
  {
    // sustituye aaa por bbb en el template de la subaplicación
    htmlLoader: (code) => {
      return code.replace('aaa', 'bbb');
    },
  }
];
```

## js-excludes

Si quieres que, al cargar la subaplicación, no se ejecuten determinados ficheros `js`, usa `js-excludes`.

- **Ejemplo**

```javascript
const plugins = [
  // los scripts http://xxxxx.js o los que casen con /test\.js/ no se ejecutarán en la subaplicación
  { jsExcludes: ["http://xxxxx.js", /test\.js/] },
];
```

## js-ignores

Si quieres que la propia subaplicación cargue ciertos ficheros `js` (mediante la etiqueta `script`) en lugar de que el framework intercepte la carga (lo que suele provocar errores de CORS), usa `js-ignores`.

- **Ejemplo**

```javascript
const plugins = [
  // los scripts http://xxxxx.js o los que casen con /test\.js/ los cargará la propia subaplicación
  { jsIgnores: ["http://xxxxx.js", /test\.js/] },
];
```

::: warning Advertencia
Como los ficheros de `jsIgnores` los carga la propia subaplicación, no se intercepta su `location`. Si alguno manipula o asigna `window.location.href`, cámbialo obligatoriamente por `window.$wujie.location.href`; de lo contrario el sandbox de la subaplicación quedará reemplazado.
:::

## js-before-loaders

Si quieres que, **antes** de todos los `js` del `html`, se haga alguna de estas cosas:

1. Ejecutar en la subaplicación un script con `src="http://xxxxx"`
2. Ejecutar un script inline `<script>content</script>`
3. Ejecutar una función de callback

usa `js-before-loaders`.

- **Ejemplo**

```javascript
const plugins = [
  {
    // antes de todos los js de la subaplicación
    jsBeforeLoaders: [
      // insertar un script externo
      { src: "http://xxxx.js" },
      // insertar un script inline
      { content: 'console.log("test")' },
      // ejecutar un callback que imprime el nombre de la subaplicación
      {
        callback(appWindow) {
          console.log("js-before-loader-callback", appWindow.__WUJIE.id);
        },
      },
    ],
  },
];
```

## js-loader

Si quieres reemplazar el código de algún script `js` de la subaplicación, hazlo aquí.

- **Ejemplo**

```javascript
const plugins = [
  {
    // en el script cuya url es aaa.js, sustituye aaa por bbb
    // code es el código del script, url su dirección ('' si es inline) y base la url actual de la subaplicación
    jsLoader: (code, url, base) => {
      if (url === "aaa.js") return code.replace("aaa", "bbb");
    },
  },
];
```

::: warning Advertencia
- Los scripts esm no pasan por el plugin js-loader.
- Los scripts de js-ignores tampoco pasan por js-loader.
:::

## js-after-loader

Si quieres que, **después** de todos los `js` del `html`, se haga alguna de estas cosas:

1. Ejecutar en la subaplicación un script con `src="http://xxxxx"`
2. Ejecutar un script inline `<script>content</script>`
3. Ejecutar una función de callback

usa `js-after-loaders`.

- **Ejemplo**

```javascript
const plugins = [
  {
    jsAfterLoaders: [
      // insertar un script externo
      { src: "http://xxxx.js" },
      // insertar un script inline
      { content: 'console.log("test")' },
      // ejecutar un callback que imprime el nombre de la subaplicación
      {
        callback(appWindow) {
          console.log("js-after-loader-callback", appWindow.__WUJIE.id);
        },
      },
    ],
  },
];
```

## css-excludes

Si quieres que, al cargar la subaplicación, no se carguen determinados ficheros `css`, usa `css-excludes`.

- **Ejemplo**

```javascript
const plugins = [
  // el http://xxxxx.css de la subaplicación no se cargará
  { cssExcludes: ["http://xxxxx.css" /test\.css/] },
];
```

## css-ignores

Si quieres que la propia subaplicación cargue ciertos ficheros `css` (mediante la etiqueta `link`) en lugar de que el framework intercepte la carga (lo que suele provocar errores de CORS), usa `css-ignores`.

- **Ejemplo**

```javascript
const plugins = [
  // los http://xxxxx.css o los que casen con /test\.css/ los cargará la propia subaplicación
  { cssIgnores: ["http://xxxxx.css", /test\.css/] },
];
```

## css-before-loaders

Si quieres que, **antes** de todos los `css` del `html`, se haga alguna de estas cosas:

1. Insertar una hoja de estilos externa con `src="http://xxxxx"`
2. Insertar un estilo inline `<style>content</style>`

usa `css-before-loaders`.

- **Ejemplo**

```javascript
const plugins = [
  {
    // antes de todos los css de la subaplicación
    cssBeforeLoaders: [
      // añadir un estilo externo antes de cargar los estilos del html
      { src: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" },
      // añadir un estilo inline antes de cargar los estilos del html
      { content: "img{width: 300px}" },
    ],
  },
];
```

## css-loader

Wujie ofrece un plugin para modificar en tiempo de ejecución el texto `css` de la subaplicación.

- **Ejemplo**

```javascript
const plugins = [
  {
    // sustitución dinámica del código de estilos
    // code es el código del estilo, url su dirección ('' si es inline) y base la url actual de la subaplicación
    cssLoader: (code, url, base) => {
      console.log("css-loader", url, code.slice(0, 50) + "...");
      return code;
    },
  },
];
```

## css-after-loaders

Si quieres que, **después** de todos los `css` del `html`, se haga alguna de estas cosas:

1. Insertar una hoja de estilos externa con `src="http://xxxxx"`
2. Insertar un estilo inline `<style>content</style>`

usa `css-after-loaders`.

- **Ejemplo**

```javascript
const plugins = [
  {
    cssAfterLoaders: [
      // añadir un estilo externo tras cargar todos los estilos del html
      { src: "https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css" },
      // añadir un estilo inline tras cargar todos los estilos del html
      { content: "img{height: 300px}" },
    ],
  },
];
```

## windowAddEventListenerHook

Callback que se ejecuta cuando la subaplicación registra un listener sobre su `window`.

- **Ejemplo**

En Wujie el `dom` de la subaplicación se renderiza en un webcomponent y su `js` se ejecuta en un `iframe`. Es habitual que el scroll ocurra en un contenedor externo, así que escuchar el evento `scroll` del `window` no sirve de nada; puedes redirigir ese listener al contenedor con scroll:

```javascript
const plugins = [
  {
    windowAddEventListenerHook(iframeWindow, type, handler, options) {
      container.addEventListener(type, handler, options);
    },
  },
];
```

## windowRemoveEventListenerHook

Callback que se ejecuta cuando la subaplicación elimina un listener de su `window`.

- **Ejemplo**

```javascript
const plugins = [
  {
    windowAddEventListenerHook(iframeWindow, type, handler, options) {
      container.addEventListener(type, handler, options);
    },
    windowRemoveEventListenerHook(iframeWindow, type, handler, options) {
      container.removeEventListener(type, handler, options);
    },
  },
];
```

## documentAddEventListenerHook

Callback que se ejecuta cuando la subaplicación registra un listener sobre su `document`.

- **Ejemplo**

Igual que antes: como el `dom` vive en el webcomponent y el `js` en el `iframe`, escuchar el `scroll` del `document` no sirve; puedes enlazarlo al contenedor con scroll:

```javascript
const plugins = [
  {
    documentAddEventListenerHook(iframeWindow, type, handler, options) {
      container.addEventListener(type, handler, options);
    },
  },
];
```

## documentRemoveEventListenerHook

Callback que se ejecuta cuando la subaplicación elimina un listener de su `document`.

- **Ejemplo**

```javascript
const plugins = [
  {
    documentAddEventListenerHook(iframeWindow, type, handler, options) {
      container.addEventListener(type, handler, options);
    },
    documentRemoveEventListenerHook(iframeWindow, type, handler, options) {
      container.removeEventListener(type, handler, options);
    },
  },
];
```

## appendOrInsertElementHook

Callback que se ejecuta después de que la subaplicación inserte un elemento en `body` o `head`.

- **Ejemplo**

```javascript
const plugins = [
  {
    // element es el elemento realmente insertado, iframeWindow el window de la subaplicación
    // y rawElement el elemento original
    appendOrInsertElementHook(element, iframeWindow, rawElement) {
      console.log(element, iframeWindow, rawElement)
    }
  },
];
```

## patchElementHook

Callback que se ejecuta después de que la subaplicación cree un elemento.

- **Ejemplo**

```javascript
const plugins = [
  {
    patchElementHook(element, iframeWindow ) {
      console.log(element, iframeWindow )
    }
  },
];
```

<!--
## windowPropertyOverride

Personalizar propiedades del `window` de la subaplicación.

- **Ejemplo**

```javascript
const plugins = [
  {
    // personaliza la propiedad property del window de la subaplicación
    windowPropertyOverride(iframeWindow) {
      iframeWindow.propKey = window.propKey;
    },
  },
];
```

## documentPropertyOverride

Personalizar propiedades del `document` de la subaplicación.

```javascript
const plugins = [
  {
    documentPropertyOverride(iframeWindow) {
      // personaliza la propiedad propKey del document de la subaplicación
      Object.defineProperty(iframeWindow.document, propKey, {
        enumerable: true,
        configurable: true,
        get: () => xxx,
        set: () => xxx,
      });
    },
  },
];
``` -->
