# clearAssetsCache

- **Tipo:** `Function`

- **Parámetros:** `host?: string | string[]`

- **Valor de retorno:** `void`

Vacía la caché de recursos a nivel de módulo de Wujie: `styleCache`, `scriptCache` y `embedHTMLCache`. Al desmontar una subaplicación (`destroyApp`) esas cachés **no** se limpian automáticamente, así que en escenarios con subaplicaciones en varios hosts o con hot reload los recursos antiguos pueden seguir sirviéndose desde caché. Esta API permite invalidarlos manualmente.

::: tip Casos de uso

- Tras un hot reload de los recursos estáticos de la subaplicación, cuando hace falta forzar la descarga de html / js / css.
- Cuando bajo una misma aplicación principal se montan subaplicaciones de hosts distintos y, tras cambiar de una a otra, quieres limpiar la caché de un host concreto.
- Para diagnosticar problemas del tipo «la página no se actualiza» causados por la caché de recursos.

:::

## host

- **Tipo:** `string | string[]`

- **Detalle:**

  - Sin argumentos: vacía toda la caché de recursos.
  - Con un host (por ejemplo `"https://a.com"`): solo vacía las entradas cuya clave de caché empiece por ese prefijo.
  - Con un array de hosts: limpia varios prefijos de una vez.

## Ejemplo {#ejemplo}

```javascript
import { clearAssetsCache } from "@agttec9610/wujie";

// vaciar toda la caché
clearAssetsCache();

// limpiar solo un host
clearAssetsCache("https://a.com");

// limpiar varios
clearAssetsCache(["https://a.com", "https://b.com"]);
```

::: warning Atención

Esta API solo limpia la caché interna de carga de recursos de Wujie; no destruye la instancia de la subaplicación. Si necesitas reconstruirla por completo, usa [refreshApp](/es/api/refreshApp.html) o [destroyApp](/es/api/destroyApp.html) + [startApp](/es/api/startApp.html).

:::
