---
sidebarDepth: 2
---

# ¿Qué es un micro frontend?

Un micro frontend es una técnica y una estrategia que permite que varios equipos construyan conjuntamente una aplicación web moderna publicando funcionalidades de forma independiente.

::: tip Cita
Techniques, strategies and recipes for building a modern web app with multiple teams that can ship features independently. -- [Micro Frontends](https://micro-frontends.org/)
:::

Dicho de forma sencilla: dentro de una aplicación `web` puede ejecutarse de manera independiente otra aplicación `web`.

¿En qué escenarios se usan los micro frontends?

::: tip Ejemplos

- Construir una plataforma de gestión empresarial e integrar en ella un sistema de compras y un sistema financiero ya existentes.

- Tener una aplicación enorme y, para reducir el coste de desarrollo y mantenimiento, dividirla en varias aplicaciones pequeñas que se desarrollan y despliegan por separado, integrándolas después en una plataforma.

- Una aplicación desarrollada con `vue` que contiene un módulo bastante independiente; el equipo quiere probar a desarrollarlo con `react` y, una vez desarrollado y desplegado por separado, volver a integrarlo.

:::

¿Qué capacidades debe tener un framework de micro frontends completo?

::: tip Capacidades

- **Cargar y descargar subaplicaciones**

  La página necesita cambiar de una subaplicación a otra, así que el framework debe poder cargar, renderizar y conmutar.

- **Ejecución independiente de las subaplicaciones**

  Al ejecutarse, una subaplicación contamina el objeto global `window` y sus estilos afectan a otras aplicaciones; hay que aislarlas de forma efectiva.

- **Persistencia del estado de rutas**

  Una vez activada la subaplicación, refrescar el navegador y usar atrás/adelante debe seguir funcionando correctamente sobre su ruta.

- **Comunicación entre aplicaciones**

  Las aplicaciones deben poder comunicarse de forma cómoda y rápida.
  :::

¿Qué se gana usando micro frontends? ([@referencia qiankun](https://qiankun.umijs.org/zh/guide))

::: tip Beneficios

- **Agnóstico al stack tecnológico**

  El framework principal no limita el stack de las aplicaciones integradas; cada microaplicación tiene autonomía total.

- **Desarrollo y despliegue independientes**

  Cada microaplicación tiene su propio repositorio, front y back se desarrollan por separado, y tras el despliegue el framework principal se actualiza automáticamente.

- **Actualización incremental**

  Ante escenarios complejos, rara vez es viable actualizar o reescribir por completo el stack de un sistema existente; los micro frontends son una excelente estrategia para hacer una refactorización progresiva.

- **Runtime independiente**

  El estado de cada microaplicación está aislado; el estado en tiempo de ejecución no se comparte.
  :::

Quizá alguien se pregunte: ¿no bastaría con usar un `iframe` directamente?

## La solución con iframe {#solucion-iframe}

Con `iframe` efectivamente se puede lograr, y sus ventajas son evidentes:

::: tip Ventajas

- Es muy simple, usarlo no supone ninguna carga mental.
- El aislamiento entre aplicaciones `web` es perfecto: `js`, `css` y `dom` quedan completamente separados.
  :::

Precisamente por ser un **aislamiento demasiado perfecto**, los inconvenientes también son muy notorios:
::: danger Inconvenientes

- Se pierde el estado de la ruta: al refrescar, la `url` del `iframe` se pierde.
- El `dom` queda muy fragmentado: los modales solo pueden mostrarse dentro del `iframe`, no pueden cubrir toda la página.
- La comunicación entre aplicaciones `web` es muy difícil.
- Cada apertura tarda demasiado en pintar (pantalla en blanco), algo inaceptable para una [aplicación SPA](https://es.wikipedia.org/wiki/Single-page_application).
  :::

## La solución single-spa {#solucion-single-spa}

[single-spa](https://zh-hans.single-spa.js.org/docs/getting-started-overview) es hoy una de las soluciones de micro frontends más extendidas. Su idea principal:

- Registrar previamente las subaplicaciones (ruta que las activa, recursos y funciones de ciclo de vida).
- Escuchar los cambios de ruta; cuando se hace match con una ruta activa, se cargan los recursos de la subaplicación, se llaman en orden las funciones de ciclo de vida y finalmente se renderiza en el contenedor.

La arquitectura de [qiankun](https://qiankun.umijs.org/zh/guide) mejora todavía más la solución de `single-spa`. Principales mejoras:

- Los recursos de la subaplicación pasan de ser una lista de `js` a una única `url`, lo que reduce muchísimo la complejidad del registro.
- Implementa aislamiento de aplicaciones: sandbox de `js` _(fábrica de `window`)_ y de `css` _(similar al `scoped` de `vue`)_.
- Añade precarga de recursos, cacheando por adelantado el `html`, `js` y `css` de la subaplicación para acelerar su apertura.

Resumen de pros y contras:

::: tip Ventajas

- Carga y descarga automáticamente la subaplicación correspondiente a la ruta actual.
- Sandbox completo: el sandbox de `js` ofrece tres esquemas de mejora progresiva (`SnapshotSandbox`, `LegacySandbox`, `ProxySandbox`) y el de `css` dos esquemas para escenarios distintos (`strictStyleIsolation`, `experimentalStyleIsolation`).
- Persistencia de rutas: refrescar, atrás y adelante afectan correctamente a la subaplicación.
- Comunicación sencilla entre aplicaciones mediante inyección global.
  :::

::: danger Inconvenientes

- Al basarse en el match de rutas, no puede activar varias subaplicaciones a la vez ni soporta keep-alive.
- El coste de adaptación es alto: hay que ajustar `webpack`, el código, las rutas, etc.
- El sandbox de `css` no aísla de forma absoluta y el de `js` degrada seriamente el rendimiento en algunos escenarios.
- No soporta scripts `ESM` como los de `vite`.
  :::

## La solución de Wujie {#solucion-wujie}

En los `issues` de qiankun hay un [hilo](https://github.com/umijs/qiankun/issues/286) muy interesante: un desarrollador propone usar el `iframe` para implementar el sandbox de `js`. Esa idea inspiró la solución de Wujie, que se detalla a continuación.

### Mecanismo de carga y sandbox de js {#carga-y-sandbox-js}

El `js` de la subaplicación se inyecta en un `iframe` del mismo dominio que la aplicación principal. El `iframe` es un sandbox nativo de `window`, con interfaces `history` y `location` completas. La instancia (`instance`) de la subaplicación se ejecuta dentro del `iframe` y su router queda totalmente desacoplado del principal, de modo que la aplicación puede arrancarse directamente desde un componente de negocio.

Con este enfoque se obtiene:
::: tip Beneficios

- **Micro frontends en forma de componente**

  Sin registro y sin modificar el router: se usa directamente el componente de Wujie.

- **Varias subaplicaciones activas a la vez en una misma página**

  Cada subaplicación usa el router de su propio iframe, así que no hay conflictos por ocupación de rutas.

- **Sandbox de js nativo, sin contaminar el entorno principal**

  No se modifica ninguna propiedad del `window` principal; los cambios ocurren dentro del `iframe`.

- **Cambiar de aplicación no tiene coste de limpieza**

  Como no se contamina la aplicación principal, destruir una subaplicación no requiere ninguna limpieza.
  :::

### Mecanismo de sincronización de rutas {#sincronizacion-de-rutas}

Al hacer `history.pushState` dentro del `iframe`, el navegador añade automáticamente el [session-history](https://html.spec.whatwg.org/multipage/history.html#session-history) del `iframe` al [joint session history](https://html.spec.whatwg.org/multipage/history.html#joint-session-history), por lo que atrás y adelante del navegador actúan sobre la subaplicación sin hacer nada más.

Interceptando `history.pushState` e `history.replaceState` del `iframe` se puede sincronizar la `url` de la subaplicación como parámetro `query` de la aplicación principal. Al refrescar el navegador e inicializar el `iframe`, se lee de vuelta la `url` de la subaplicación y se sincroniza con `history.replaceState` del `iframe`.

Con este enfoque se obtiene:

::: tip Beneficios

- **Refrescar, atrás y adelante actúan sobre la subaplicación**
- **Coste de implementación bajo: sin listeners complejos para resolver la sincronización**
- **La sincronización se mantiene aunque haya varias aplicaciones activas a la vez**

:::

### Mecanismo de conexión del iframe y sandbox de css {#conexion-iframe-y-sandbox-css}

Wujie usa [webcomponent](https://developer.mozilla.org/es/docs/Web/API/Web_components) para aislar los estilos: crea un elemento personalizado `wujie` y renderiza en su interior la estructura completa de la subaplicación.

La instancia de la subaplicación se ejecuta dentro del `iframe`, mientras que el `dom` vive en el webcomponent, bajo el contenedor de la aplicación principal. Ambos se conectan proxeando el `document` del `iframe` hacia el webcomponent.

Todas las interfaces de consulta del `document` —`getElementsByTagName`, `getElementsByClassName`, `getElementsByName`, `getElementById`, `querySelector`, `querySelectorAll`, `head`, `body`— se redirigen al webcomponent, de modo que la instancia y el webcomponent quedan enlazados con precisión.

Cuando se cambia de subaplicación, el `iframe` se conserva; el contenedor puede destruirse, pero el webcomponent también puede mantenerse. Así, al volver a la aplicación basta con montar de nuevo el webcomponent en el contenedor: la subaplicación obtiene una capacidad similar al `keep-alive` de `vue`.

Con este enfoque se obtiene:

::: tip Beneficios

- **Sandbox de css nativo**

  Aislamiento físico directo; la subaplicación no necesita ningún cambio.

- **Los modales funcionan de forma natural**

  `appendChild` o `insertBefore` sobre `document.body` se proxean e insertan directamente en el webcomponent, sin adaptaciones.

- **Keep-alive de subaplicaciones**

  Al conservar el `iframe` y el webcomponent, el `state` interno de la aplicación no se pierde.

- **Estructura DOM completa**

  El webcomponent conserva la estructura `html` íntegra de la subaplicación: estilos y estructura se corresponden exactamente, sin cambios.
  :::

### Mecanismo de comunicación {#mecanismo-de-comunicacion}

El `iframe` que aloja la subaplicación y la aplicación principal comparten dominio, así que ambas pueden comunicarse con facilidad de forma nativa. Wujie ofrece tres vías:

- **Inyección de props**

  La subaplicación obtiene sin esfuerzo los datos inyectados por la principal mediante `$wujie.props`.

- **Comunicación vía window.parent**

  El sandbox de la subaplicación tiene el mismo origen que la aplicación principal, por lo que puede comunicarse directamente con ella a través de `window.parent`.

- **Comunicación descentralizada**

  Wujie proporciona una instancia de `EventBus` inyectada tanto en la aplicación principal como en las subaplicaciones, de modo que todas pueden comunicarse de forma descentralizada.

### Ventajas {#ventajas}

Tras la explicación anterior, podemos resumir las ventajas de Wujie:
::: tip Ventajas

- **Varias aplicaciones activas simultáneamente**

  El framework puede activar varias aplicaciones a la vez manteniendo sus rutas sincronizadas.

- **Uso en forma de componente**

  Sin registro y sin adaptar el router: se usa dentro de un componente y se monta y desmonta con él.

- **keep-alive a nivel de aplicación**

  Al activar el [modo keep-alive](/es/api/startApp.html#alive), el estado completo de la subaplicación se conserva al cambiar de aplicación. Combinado con el [modo de preejecución](/es/api/preloadApp.html#exec) se logra una experiencia de apertura similar a `ssr`.

- **Limpio y sin contaminación**

  - Wujie usa `iframe` y webcomponent para construir sandboxes nativos de `js` y `css`.
  - Aprovecha que el `history` del `iframe` y el de la aplicación principal comparten el mismo [top-level browsing context](https://html.spec.whatwg.org/multipage/browsers.html#top-level-browsing-context) para sincronizar rutas de forma natural.
  - Los efectos secundarios quedan confinados dentro del sandbox: cambiar de subaplicación no requiere limpieza ni tiene coste extra.

- **Rendimiento y tamaño equilibrados**

  - El rendimiento de ejecución es idéntico al nativo: la instancia corre en el contexto `window` del `iframe`, evitando la penalización de `with(proxyWindow){code}`. A cambio hay un coste puntual de instanciar el `iframe`, que puede adelantarse con [preload](/es/api/preloadApp.html).
  - El tamaño es reducido: apoyarse en `iframe` y webcomponent para el sandbox recorta mucho código.

- **Listo para usar**

  Compatibilidad de estilos, gestión de rutas, modales, hot reload… todo funciona en cuanto se integra la subaplicación, sin trabajo adicional. El [coste de integración](./start.html#adaptar-el-ciclo-de-vida) es mínimo.
  :::
