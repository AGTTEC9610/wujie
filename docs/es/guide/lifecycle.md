
# Ciclo de vida

::: tip Sugerencia
Wujie ofrece un conjunto completo de hooks de ciclo de vida.
:::

::: warning Advertencia
Si la subaplicación no ha hecho la [adaptación del ciclo de vida](/es/guide/start.html#adaptar-el-ciclo-de-vida), los hooks `beforeMount`, `afterMount`, `beforeUnmount` y `afterUnmount` no se llamarán.
:::

## beforeLoad

- Tipo: `type lifecycle = (appWindow: Window) => any;`

Se dispara antes de que la subaplicación empiece a cargar sus recursos estáticos.

## beforeMount

- Tipo: `type lifecycle = (appWindow: Window) => any;`

Se dispara antes de renderizar la subaplicación (antes de llamar a `window.__WUJIE_MOUNT`).

## afterMount

- Tipo: `type lifecycle = (appWindow: Window) => any;`

Se dispara después de renderizar la subaplicación (tras llamar a `window.__WUJIE_MOUNT`).

## beforeUnmount

- Tipo: `type lifecycle = (appWindow: Window) => any;`

Se dispara antes de desmontar la subaplicación (antes de llamar a `window.__WUJIE_UNMOUNT`).

## afterUnmount

- Tipo: `type lifecycle = (appWindow: Window) => any;`

Se dispara después de desmontar la subaplicación (tras llamar a `window.__WUJIE_UNMOUNT`).

## activated

- Tipo: `type lifecycle = (appWindow: Window) => any;`

En [modo keep-alive](/es/api/startApp.html#alive), se dispara al entrar en la subaplicación.

## deactivated

- Tipo: `type lifecycle = (appWindow: Window) => any;`

En [modo keep-alive](/es/api/startApp.html#alive), se dispara al salir de la subaplicación.

## loadError

- Tipo: `type loadErrorHandler = (url: string, e: Error) => any;`

Se dispara cuando falla la carga de un recurso de la subaplicación.
