# Modo degradado

Wujie ofrece un mecanismo de degradación transparente.

Fuera del escenario degradado, el `dom` de la subaplicación vive en un webcomponent y su entorno de ejecución en un `iframe`; las operaciones sobre el `dom` desde el `iframe` se proxean al webcomponent mediante `proxy`. Como `IE` no soporta ni webcomponent ni `proxy`, en ese caso se sustituye el webcomponent por otro `iframe` y el `proxy` por `Object.defineProperty`.

::: warning Atención

Wujie no aplica polyfills al código es6, porque cada usuario tiene un objetivo de compatibilidad distinto y los polyfills necesarios varían. Si necesitas ejecutar en navegadores antiguos, añade tú mismo los polyfills mediante babel.

:::

## Ventajas {#ventajas}

1. La degradación la decide el framework: cuando el navegador no lo soporta, degrada automáticamente.

2. Tras degradar, el aislamiento entre aplicaciones sigue siendo absoluto.

3. No hay que cambiar nada del código: la precarga, el keep-alive y la comunicación siguen funcionando, así que no ejecutas un código distinto antes y después de degradar.

4. También se puede forzar la degradación: si el navegador soporta webcomponent y proxy pero aun así quieres que el dom se ejecute dentro de un iframe, pon [degrade](/es/api/startApp.html#degrade) a `true`.

## Inconvenientes {#inconvenientes}

1. Los modales solo pueden mostrarse dentro de la subaplicación.

2. Al no poder usar `proxy`, no se puede interceptar la `location` de la subaplicación: al acceder a `window.location.host` se obtiene el host de la aplicación principal. La subaplicación puede obtener su host correcto desde [$wujie.location](/es/api/wujie.html#wujie-location).
