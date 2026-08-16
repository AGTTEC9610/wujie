# Variables globales

Wujie inyecta algunas variables globales en el objeto `window` de la subaplicación:

```typescript
declare global {
  interface Window {
    // indica si Wujie está presente
    __POWERED_BY_WUJIE__?: boolean;
    // public path de la subaplicación
    __WUJIE_PUBLIC_PATH__: string;
    // querySelector nativo
    __WUJIE_RAW_DOCUMENT_QUERY_SELECTOR__: typeof Document.prototype.querySelector;
    // querySelectorAll nativo
    __WUJIE_RAW_DOCUMENT_QUERY_SELECTOR_ALL__: typeof Document.prototype.querySelectorAll;
    // objeto window nativo
    __WUJIE_RAW_WINDOW__: Window;
    // instancia del sandbox de la subaplicación
    __WUJIE: WuJie;
    // función mount de la subaplicación
    __WUJIE_MOUNT: () => void;
    // función unmount de la subaplicación
    __WUJIE_UNMOUNT: () => void | Promise<void>;
    // objeto inyectado
    $wujie: {
      bus: EventBus;
      shadowRoot?: ShadowRoot;
      props?: { [key: string]: any };
      location?: Object;
    };
  }
}
```

## `__POWERED_BY_WUJIE__`

- **Tipo:** `Boolean`

- **Descripción:** indica si la subaplicación se está ejecutando dentro de Wujie.

## `__WUJIE_PUBLIC_PATH__`

- **Tipo:** `string`

- **Descripción:** public path de carga de la subaplicación.

## `__WUJIE_RAW_DOCUMENT_QUERY_SELECTOR__`

- **Tipo:** `typeof Document.prototype.querySelector`

- **Descripción:** el `document.querySelector` de la subaplicación está interceptado hacia el webcomponent; usa esta variable si necesitas el `querySelector` sin interceptar.

## `__WUJIE_RAW_DOCUMENT_QUERY_SELECTOR_ALL__`

- **Tipo:** `typeof Document.prototype.querySelectorAll`

- **Descripción:** el `document.querySelectorAll` de la subaplicación está interceptado hacia el webcomponent; usa esta variable si necesitas el `querySelectorAll` sin interceptar.

## `__WUJIE_RAW_WINDOW__`

- **Tipo:** `Window`

- **Descripción:** el objeto `window` nativo de la subaplicación.


## `__WUJIE`

- **Tipo:** `Wujie`

- **Descripción:** instancia de Wujie de la subaplicación. No deberías usarla directamente.

## `__WUJIE_MOUNT`

- **Tipo:** `Function`

- **Descripción:** ciclo de vida `mount` definido por el usuario.

## `__WUJIE_UNMOUNT`

- **Tipo:** `Function`

- **Descripción:** ciclo de vida `unmount` definido por el usuario.

## $wujie

[Ver detalle](/es/api/wujie.html#wujie)
