# bus

- **Tipo:** `EventBus`

```typescript
type callback = (...args: Array<any>) => any;

export declare class EventBus {
  private id;
  private eventObj;
  constructor(id: string);
  $on(event: string, fn: callback): EventBus;
  /** cualquier $emit dispara el listener; el primer argumento es el nombre del evento y el resto los de $emit */
  $onAll(fn: (event: string, ...args: Array<any>) => any): EventBus;
  $once(event: string, fn: callback): void;
  $off(event: string, fn: callback): EventBus;
  $offAll(fn: callback): EventBus;
  $emit(event: string, ...args: Array<any>): EventBus;
  $clear(): EventBus;
}
```

- **Detalle:** plataforma de eventos descentralizada, con una `api` similar a la de eventos de `Vue` y soporte para encadenar llamadas. [Ejemplo](/es/guide/communication.html#eventbus)

## $on

- **Tipo:** `(event: string, fn: callback) => EventBus`

- **Parámetros:**
  - `{string} event` nombre del evento
  - `{callback} fn` función de callback

- **Detalle:** escucha un evento y ejecuta el callback.

## $onAll

- **Tipo:** `(fn: (event: string, ...args: Array<any>) => any) => EventBus`

- **Parámetros:**
  - `{callback} fn` función de callback

- **Detalle:** escucha todos los eventos; el primer argumento del callback es el nombre del evento.


## $once

- **Tipo:** `(event: string, fn: callback) => void`

- **Parámetros:**
  - `{string} event` nombre del evento
  - `{callback} fn` función de callback

- **Detalle:** escucha un evento una sola vez.

## $off

- **Tipo:** `(event: string, fn: callback) => EventBus`

- **Parámetros:**
  - `{string} event` nombre del evento
  - `{callback} fn` función de callback

- **Detalle:** cancela la escucha de un evento.

## $offAll

- **Tipo:** `(fn: callback) => EventBus`

- **Parámetros:**
  - `{callback} fn` función de callback

- **Detalle:** cancela la escucha de todos los eventos.

## $emit

- **Tipo:** `(event: string, ...args: Array<any>) => EventBus`

- **Parámetros:**
  - `{string} event` nombre del evento
  - `{Array<any>} args` argumentos adicionales para el callback

- **Detalle:** dispara un evento.

## $clear

- **Tipo:** `Function`

- **Detalle:** vacía todas las suscripciones de la instancia de `EventBus`.

::: warning Advertencia

- Cuando una subaplicación se destruye o se vuelve a renderizar (sin keep-alive), el framework limpia automáticamente todas las suscripciones del renderizado anterior.
- El renderizado de los componentes internos de la subaplicación puede provocar suscripciones repetidas (por ejemplo, llamar a `$wujie.bus.$on` en el ciclo `mounted`); en ese caso hay que llamar manualmente a `$wujie.bus.$off` en el ciclo `unmount` para desuscribirse.
  :::
