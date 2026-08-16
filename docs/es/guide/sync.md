# Sincronización de rutas

## Funcionamiento {#funcionamiento}

La sincronización de rutas cuelga el `path + query + hash` de la subaplicación, codificado con `window.encodeURIComponent`, como parámetro de consulta de la `url` de la aplicación principal. La clave (`key`) es el [name](/es/api/startApp.html#name) de la subaplicación.

Con la sincronización activada, refrescar el navegador o compartir la `url` no pierde el estado de la ruta de la subaplicación. Cuando una página tiene varias subaplicaciones, Wujie sincroniza las rutas de todas ellas, y refrescar, atrás y adelante tampoco pierden ese estado.

Parámetro para activarla: [sync](/es/api/startApp.html#sync).

::: warning Atención
Solo se lee la información de ruta desde la `url` en la primera instanciación de Wujie. Una vez instanciado, la sincronización pasa a ser unidireccional: de la subaplicación hacia la `url` de la aplicación principal.
:::

## Rutas cortas {#rutas-cortas}

Wujie permite acortar rutas: cuando la `url` de la subaplicación es demasiado larga, se puede configurar [prefix](/es/api/startApp.html#prefix) para reducir la ruta que se sincroniza hacia la aplicación principal. Wujie elige la ruta corta aplicando el criterio de coincidencia más larga.

Tras el match, la ruta se cuelga en la `url` principal como `{ruta corta} + resto de la ruta`. Ojo: al definir las rutas a comparar no incluyas el dominio.

**Ejemplo**

```vue
<WujieVue
  width="100%"
  height="100%"
  name="xxx"
  :url="xxx"
  :sync="true"
  :prefix="{
    prod: '/example/prod',
    test: '/example/test'
    prodId: '/example/prod/debug?id=',
  }"
></WujieVue>

```

Con esa configuración, las rutas de la subaplicación se transforman así:

```
/example/prod/hello  => {prod}/hello

/example/test/name => {test}/name

/example/prod/debug?id=5&age=10 => {prodId}5&age=10
```
