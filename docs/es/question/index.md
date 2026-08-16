---
sidebarDepth: 2
collapsable: false
---

## 1. Error al solicitar recursos {#p1}

El error es: `Access to fetch at *** from origin *** has been blocked by CORS policy: No 'Access-Control-Allow-Origin'`

**Causa:** la subaplicación está en otro origen, o la petición de sus recursos no lleva la cookie.

**Solución:**

1. Si el error es por CORS, consulta los [requisitos previos](/es/guide/start.html#requisitos-previos).

2. Si es porque la petición no lleva la cookie (normalmente el código de respuesta es un 302 que redirige a la página de login), define un [fetch](/es/api/startApp.html#fetch) personalizado con `credentials` a `include` para que se envíe la `cookie`.

::: warning Advertencia
Cuando `credentials` vale `include`, el `Access-Control-Allow-Origin` del servidor no puede ser `*`; [ver el motivo](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#credentialed_requests_and_wildcards). El servidor puede configurarlo así:

```javascript
ctx.set("Access-Control-Allow-Origin", ctx.headers.origin);
```

:::

## 2. Un paquete de terceros ya importado da error al usarlo {#p2}

**Causa:** el script se ejecutaba originalmente en el ámbito global, así que las variables globales que define el paquete (por ejemplo `var xxx`) quedaban colgadas directamente de `window`. Pero `wujie` envuelve todos los scripts en un closure para poder interceptar y modificar `location`, así que esas variables se quedan dentro del closure y no llegan a `window`; los scripts asíncronos de la subaplicación corren en otro closure y no pueden acceder a ellas.

**Solución:**

1. Opción A: colgar explícitamente en `window` las variables globales que define el paquete (por ejemplo `window.xxx`), o modificar el [`output.libraryTarget`](https://webpack.docschina.org/configuration/output/#outputlibrarytarget) de `webpack` del paquete.

2. Opción B: si no quieres tocar el código, usa un [plugin](/es/guide/plugin.html#js-loader) para sustituir en tiempo de ejecución `xxx=` por `window.xxx=`.

## 3. Las fuentes de la subaplicación no se aplican {#p3}

**Causa:** `@font-face` no se carga dentro del `shadow`, [ver detalle](https://github.com/mdn/interactive-examples/issues/887).

**Ya resuelto:** el framework ejecuta el `@font-face` de la subaplicación fuera del `shadow`. Ojo: los nombres de fuentes personalizadas de la subaplicación y de la aplicación principal no deben coincidir o podrían pisarse.

## 4. Los componentes flotantes (por ejemplo los desplegables) se posicionan mal {#p4}

**Causa:** por ejemplo, `element-plus` usa `popper.js` 2.0, que calcula la posición recorriendo elementos hacia arriba hasta `window.visualViewport`. Como el `dom` de la subaplicación está montado en el `shadowRoot`, ese desplazamiento de `window.visualViewport` no existe y el cálculo del offset falla.

**Solución:** poner `position: relative` en el `body` de la subaplicación.

## 5. Al tratar eventos de forma asíncrona, e.target pasa a ser wujie-app {#p5}

**Causa:** es el comportamiento nativo del navegador, [ver detalle](https://stackoverflow.com/questions/63607966/event-target-changed-in-settimeout-in-shadow-dom).

**Solución:** en el tratamiento asíncrono, obtén `e.target` así:
`(e.target.shadowRoot && e.composed) ? (e.composedPath()[0] || e.target) : e.target`

## 6. Las rutas relativas dentro del css se resuelven contra el dominio de la aplicación principal {#p6}

**Ya resuelto:** el framework lo gestiona y convierte por defecto las rutas relativas en absolutas.

## 7. Error al usar module federation para referenciar módulos remotos {#p7}

**Causa:** la misma que en el [punto 2](#p2): al ejecutar los scripts dentro de un closure, sus variables globales no son legibles desde otros scripts.

**Solución:** en el plugin `ModuleFederationPlugin`, pon el `type` de `library` a `window`:

```javascript
  library: { type: 'window', name: 'igual que el name' }
```

## 8. Al inicializar el iframe de la subaplicación se cargan y ejecutan recursos de la aplicación principal {#p8}

**Causa:** ver el [issue](https://github.com/Tencent/wujie/issues/54).

**Solución:**

- Que la aplicación principal exponga una ruta, por ejemplo `https://host/empty`, que devuelva contenido vacío, y que la subaplicación defina [attrs](/es/api/startApp.html#attrs) como `{src:'https://host/empty'}`, de forma que el `src` del iframe sea `https://host/empty`.
- Insertar como primer elemento del `head` del template principal una etiqueta `<script>if(window.parent !== window) {window.stop()}</script>`, lo que debería evitar la contaminación por el código de la aplicación principal.

## 9. El window de la subaplicación es un proxy: ¿cómo obtengo el objeto real? {#p9}

**Causa:** el motivo de usar un proxy está explicado en este [issue](https://github.com/Tencent/wujie/issues/63).

**Solución:**

- Usa `window.__WUJIE_RAW_WINDOW__` para obtener el objeto `window` real, [ver detalle](/es/guide/variable.html#wujie-raw-window).

## 10. Error «DOMException: Blocked a frame with origin from accessing a cross-origin frame» {#p10}

**Causas posibles:** el sandbox de la subaplicación ha sido reemplazado. Hay tres motivos:

1. La subaplicación corre en un `iframe` en blanco cuyo `src` apunta al `host` de la aplicación principal, y ese `host` hace una redirección (por ejemplo un 302) que se carga el sandbox.
2. La subaplicación es de `vite` y modificó `window.location.href`, lo que reemplazó el sandbox.
3. La subaplicación añadió un plugin [jsIgnores](/es/guide/plugin.html#js-ignores) y el fichero `js` correspondiente modificó `window.location.href`.

**Soluciones:**
1. Que la aplicación principal exponga una ruta, por ejemplo `https://host/empty`, que devuelva contenido vacío y no redirija, y que la subaplicación defina [attrs](/es/api/startApp.html#attrs) como `{src:'https://host/empty'}`.
2. En subaplicaciones `vite`, todas las operaciones sobre `location` deben usar `window.$wujie.location`.
3. En los ficheros `js` de `jsIgnores`, todas las operaciones sobre `location` deben usar `window.$wujie.location`.

## 11. Las imágenes con ruta relativa de la subaplicación no se convierten a ruta absoluta {#p11}

**Causa:** cuando la subaplicación usa `v-html`, `innerHTML` o añade `style` dinámicamente en el `template`, el plugin por defecto del framework no puede tratar ese escenario.

**Solución:** añade `import "./config"` al principio del fichero de entrada `main` de la subaplicación, con este contenido en `config`:

```javascript
if (window.__POWERED_BY_WUJIE__) {
  // eslint-disable-next-line
  window.__webpack_public_path__ = window.__WUJIE_PUBLIC_PATH__;
}
```

## 12. Los estilos de una subaplicación vite4 se pierden al cambiar de aplicación {#p12}

Causa y solución detalladas en este [issue](https://github.com/Tencent/wujie/issues/434#issuecomment-1614089196).
