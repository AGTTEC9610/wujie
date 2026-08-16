Wujie soporta el anidamiento de aplicaciones. Las aplicaciones anidadas se comportan igual que las normales: soportan precarga, keep-alive, sincronización de rutas, comunicación, etc.

[bus](/es/api/bus.html#bus) permite comunicación descentralizada entre todas las aplicaciones (incluidas las subaplicaciones anidadas), y [destroyApp](/es/api/destroyApp.html#destroyapp) puede destruir cualquier subaplicación (también las anidadas).

::: warning Advertencia
En principio, el `name` de las aplicaciones anidadas también debe ser único, salvo que quieras reutilizar deliberadamente una subaplicación ya renderizada.
:::
