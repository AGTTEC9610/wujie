---
sidebarDepth: 2
collapsable: false
---

# Modos de ejecución

![Diagrama de flujo de Wujie](https://vfiles.gtimg.cn/wuji_dashboard/xy/test_wuji_damy/F0NYfpHl.jpeg)

En un framework de micro frontends, las subaplicaciones se colocan en las páginas de la aplicación principal y se activan y destruyen repetidamente a medida que esas páginas se abren y se cierran. En Wujie, el flujo de tratamiento cambia por completo según si la subaplicación está en keep-alive y según si se ha adaptado su ciclo de vida.

## Modo keep-alive {#modo-keep-alive}

Cuando [alive](/es/api/startApp.html#alive) vale `true`, la subaplicación entra en modo keep-alive: ni sus datos internos ni el estado de su ruta se pierden al cambiar de página.

En este modo la subaplicación solo se renderiza una vez. Al cambiar de página, el webcomponent que aloja el `dom` de la subaplicación permanece en memoria, y al reactivarla Wujie vuelve a montar ese webcomponent en el contenedor.

En modo keep-alive, cambiar la [url](/es/api/startApp.html#url) **no** cambia la ruta de la subaplicación: hay que usar la [comunicación](/es/guide/communication.html) para navegar dentro de ella.

::: warning Atención

La instancia de una subaplicación en keep-alive no se destruye, así que sigue respondiendo a los eventos del bus aunque se haya salido de ella. En cambio, en una subaplicación sin keep-alive, al salir se destruyen todos sus listeners y hay que volver a registrarlos en el siguiente `mount`.

:::

## Modo singleton {#modo-singleton}

Cuando `alive` es `false` y se ha hecho la [adaptación del ciclo de vida](/es/guide/start.html#adaptar-el-ciclo-de-vida), la subaplicación entra en modo singleton.

Al salir de la página, se llama a `window.__WUJIE_UNMOUNT` para destruir la instancia actual; al volver, se llama a `window.__WUJIE_MOUNT` para crear y renderizar una instancia nueva.

En modo singleton, cambiar la [url](/es/api/startApp.html#url) sí hace que la subaplicación navegue a la ruta correspondiente.

Si en la aplicación principal hay varias entradas de menú que apuntan a páginas distintas de la misma subaplicación, conviene usar el mismo `name` al arrancarla en cada página: así se comparte una única instancia de `wujie` y también el `iframe` que aloja su `js`. Con `url` distintas por página, cambiar entre ellas equivale a: destruir la instancia actual ⇒ sincronizar la nueva ruta ⇒ crear una instancia nueva.

## Modo rebuild {#modo-rebuild}

Si la subaplicación no está en keep-alive y tampoco ha adaptado su ciclo de vida, entra en modo rebuild. Cada cambio de página destruye no solo el webcomponent que aloja el `dom`, sino también el `iframe` que aloja el `js`; en consecuencia se destruyen tanto la instancia de `wujie` como la de la subaplicación.

En modo rebuild, cambiar la [url](/es/api/startApp.html#url) hace navegar a la ruta correspondiente, salvo en el escenario de [sincronización de rutas](/es/guide/sync.html) cuando el parámetro de sincronización ya está en la `url` de la aplicación principal: al cambiar la `url` la subaplicación se destruye y se vuelve a renderizar, y en ese momento el parámetro sincronizado tiene la máxima prioridad.

Cuando necesites forzar una reconstrucción completa, usa [refreshApp](/es/api/refreshApp.html).
