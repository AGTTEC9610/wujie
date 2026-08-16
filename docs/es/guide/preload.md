# Precarga

::: tip
La precarga mejora enormemente el tiempo de primera pintura al abrir una subaplicación.
:::

## Precarga de recursos {#precarga-de-recursos}

La precarga consiste en descargar de red a memoria los recursos estáticos necesarios cuando la aplicación está ociosa, usando `requestIdleCallback`. Más detalles en [preloadApp](/es/api/preloadApp.html).

## Preejecución {#preejecucion}

La preejecución consiste en renderizar la subaplicación por adelantado mientras la aplicación está ociosa, lo que acelera todavía más su apertura.

Basta con poner [exec](/es/api/preloadApp.html#exec) a `true` en `preloadApp`.

Como renderizar por adelantado puede bloquear el hilo de la aplicación principal, Wujie ofrece un mecanismo similar a [react-fiber](https://github.com/acdlite/react-fiber-architecture) para evitarlo. Ver [fiber](/es/api/startApp.html#fiber).

## Limpiar la caché de recursos {#limpiar-cache}

Wujie cachea a nivel de módulo el html, js y css de las subaplicaciones para acelerar la segunda apertura. Si los recursos de la subaplicación se han actualizado o necesitas forzar una nueva descarga, usa [clearAssetsCache](/es/api/clearAssetsCache.html) para invalidar la caché por host.
