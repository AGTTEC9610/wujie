# refreshApp

- **Tipo:** `Function`

- **Parámetros:** `startOptions` (los mismos que [startApp](/es/api/startApp.html))

- **Valor de retorno:** `Promise<Function | void>`

Refresca activamente una subaplicación: primero llama a [destroyApp](/es/api/destroyApp.html) para destruir la instancia actual y después llama a [startApp](/es/api/startApp.html) con la configuración recibida para reconstruirla por completo. Internamente espera a que `destroyApp` termine antes de ejecutar `startApp`, evitando la condición de carrera de rearrancar antes de haber terminado de destruir.

Equivale a encadenar manualmente `destroyApp(name)` + `startApp(startOptions)`, pero con el orden garantizado por el framework.

::: tip Casos de uso

- La subaplicación está en [modo rebuild](/es/guide/mode.html#modo-rebuild) y necesitas forzar una reconstrucción completa para vaciar el estado y recargar los recursos.
- El código o los recursos estáticos de la subaplicación se han actualizado y hay que destruir la instancia antigua para volver a descargarlos.
- Con los envoltorios de Vue / React también puedes llamar a [refresh()](/es/pack/#refresh) desde la ref del componente, **sin pasar argumentos**: reutiliza automáticamente las props actuales del componente para reconstruirlo.

:::

::: warning Atención

- Refrescar destruye la instancia actual: el `iframe` y el `shadowRoot` que alojan la subaplicación se destruyen, así que puede aparecer una breve pantalla en blanco.
- Los parámetros `name`, `replace`, `fetch`, `alive` y `degrade` deben coincidir con los del primer `startApp`; de lo contrario el renderizado puede fallar.
- Si la subaplicación se va a volver a abrir más adelante, normalmente no hace falta refrescarla; úsalo solo cuando necesites forzar la reconstrucción.

:::

## Ejemplo {#ejemplo}

```javascript
import { refreshApp } from "@agttec9610/wujie";

await refreshApp({
  name: "vue3",
  url: "https://xxx.com/",
  el: document.querySelector("#container"),
});
```

Con los envoltorios de Vue / React:

```javascript
// método estático refreshApp: mismos parámetros que startApp
import WujieVue from "@agttec9610/wujie-vue3";
await WujieVue.refreshApp({ name: "vue3", url: "...", el: "..." });

// método de instancia refresh(): sin argumentos, reutiliza las props actuales del componente
await this.$refs.wujie.refresh();
```
