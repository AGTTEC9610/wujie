Wujie inyecta en la subaplicación un objeto `$wujie`, accesible como `$wujie` o `window.$wujie`.

# $wujie

- **Tipo:**

  ```typescript
  {
    bus: EventBus;
    shadowRoot?: ShadowRoot;
    props?: { [key: string]: any };
    location?: Object;
  }
  ```

## $wujie.bus

Igual que [bus](/es/api/bus.html).

## $wujie.shadowRoot

- **Tipo:** [ShadowRoot](https://developer.mozilla.org/es/docs/Web/API/ShadowRoot)

El contenedor de renderizado (`shadow DOM`) de la subaplicación.

## $wujie.props

- **Tipo:** `{ [key: string]: any }`

Los datos inyectados por la aplicación principal.

## $wujie.location

- **Tipo:** `Object`

- Como el `location.host` de la subaplicación devuelve el host de la aplicación principal, Wujie expone en `$wujie` un `location` correcto.

- Con frameworks compilados por `vite`, al ser el `type` del `script` igual a `module`, no se puede interceptar `location` mediante el [closure](/es/guide/information.html#interceptacion-iframe). Todo el código de la subaplicación que use `window.location.host` debe cambiarse por `$wujie.location.host`.

- Cuando la subaplicación entra en modo degradado, `proxy` no funciona y `location` no puede proxearse, así que todo el código que use `window.location.host` debe cambiarse por `$wujie.location.host`.

- Con frameworks no compilados por `vite`, `proxy` sí intercepta `window.location` y el código de la subaplicación no necesita ningún cambio.
