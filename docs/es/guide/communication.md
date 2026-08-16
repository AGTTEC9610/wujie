# Wujie ofrece tres formas de comunicación

## Comunicación por props {#props}

La aplicación principal puede inyectar datos y métodos mediante [props](/es/api/startApp.html#props):

```vue
<WujieVue name="xxx" url="xxx" :props="{ data: xxx, methods: xxx }"></WujieVue>
```

La subaplicación los obtiene a través de [$wujie](/es/api/wujie.html#wujie-props):

```javascript
const props = window.$wujie?.props; // {data: xxx, methods: xxx}
```

## Comunicación por window {#window}

Como el `src` del `iframe` en el que corre la subaplicación comparte dominio con la aplicación principal, ambas pueden comunicarse directamente.

La aplicación principal accede a datos globales de la subaplicación:

```javascript
window.document.querySelector("iframe[name=id-de-la-subaplicacion]").contentWindow.xxx;
```

La subaplicación accede a datos globales de la aplicación principal:

```javascript
window.parent.xxx;
```

## Comunicación por eventBus {#eventbus}

Wujie ofrece un esquema de comunicación descentralizado: la aplicación principal y las subaplicaciones, y las subaplicaciones entre sí, pueden comunicarse cómodamente por esta vía. Ver la [API](/es/api/bus.html#bus).

Uso en la aplicación principal:

```javascript
// si usas wujie
import { bus } from "@agttec9610/wujie";

// si usas wujie-vue
import WujieVue from "@agttec9610/wujie-vue3";
const { bus } = WujieVue;

// si usas wujie-react
import WujieReact from "@agttec9610/wujie-react";
const { bus } = WujieReact;

// escuchar un evento
bus.$on("nombre del evento", function (arg1, arg2, ...) {});
// emitir un evento
bus.$emit("nombre del evento", arg1, arg2, ...);
// cancelar la escucha
bus.$off("nombre del evento", function (arg1, arg2, ...) {});
```

Uso en la subaplicación:

```javascript
// escuchar un evento
window.$wujie?.bus.$on("nombre del evento", function (arg1, arg2, ...) {});
// emitir un evento
window.$wujie?.bus.$emit("nombre del evento", arg1, arg2, ...);
// cancelar la escucha
window.$wujie?.bus.$off("nombre del evento", function (arg1, arg2, ...) {});
```
