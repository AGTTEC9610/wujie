---
sidebarDepth: 2
collapsable: false
---

# Empezar

::: tip Sobre este fork
Esta documentación corresponde al fork **`@agttec9610/wujie`**. Los ejemplos usan los nombres de paquete con ese scope. Si trabajas con el paquete original de Tencent, sustituye `@agttec9610/wujie` por `wujie`, `@agttec9610/wujie-vue3` por `wujie-vue3`, etc.
:::

## Aplicación principal {#aplicacion-principal}

### Importar {#importar}

```javascript
import { bus, setupApp, preloadApp, startApp, destroyApp, refreshApp, clearAssetsCache } from "@agttec9610/wujie";
```

::: tip Sugerencia
Si la aplicación principal usa `vue`, puedes usar directamente [wujie-vue](/es/pack/); si usa `react`, [wujie-react](/es/pack/react.html).
:::

### Configurar la subaplicación {#configurar-la-subaplicacion}

No es obligatorio. Como `preloadApp` y `startApp` comparten parámetros, `setupApp` permite definir valores por defecto y evitar repetirlos.

```javascript
setupApp({ name: "id único", url: "url de la subaplicación", exec: true, el: "contenedor", sync: true })
```

### Precargar {#precargar}

```javascript
preloadApp({ name: "id único" });
```

### Arrancar la subaplicación {#arrancar-la-subaplicacion}

```javascript
startApp({ name: "id único" });
```

## Adaptación de la subaplicación {#adaptacion-de-la-subaplicacion}

Wujie es muy poco intrusivo: si se cumplen las condiciones de CORS, la subaplicación puede no necesitar ningún cambio.

### Requisitos previos {#requisitos-previos}

Las peticiones de recursos y de API de la subaplicación se lanzan desde el dominio principal, así que habrá problemas de origen cruzado: la subaplicación **debe** tener la [configuración CORS](https://developer.mozilla.org/es/docs/Web/HTTP/CORS) adecuada.

Suponiendo que la subaplicación se despliegue con `node.js`, una configuración CORS sencilla del servidor sería:

```javascript
app.use((req, res, next) => {
  // comprobaciones de ruta, etc.
  res.set({
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": req.headers.origin || "*",
    "Access-Control-Allow-Headers": "X-Requested-With,Content-Type",
    "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  });
  // otras operaciones
});
```

::: warning Atención

Esto es solo un ejemplo básico; adáptalo a tu escenario concreto.
:::

### Modos de ejecución {#modos-de-ejecucion}

Wujie tiene tres modos de ejecución: [modo singleton](/es/guide/mode.html#modo-singleton), [modo keep-alive](/es/guide/mode.html#modo-keep-alive) y [modo rebuild](/es/guide/mode.html#modo-rebuild).

En [modo keep-alive](/es/guide/mode.html#modo-keep-alive) y [modo rebuild](/es/guide/mode.html#modo-rebuild) la subaplicación no necesita ningún cambio. El [modo singleton](/es/guide/mode.html#modo-singleton) sí requiere adaptar el ciclo de vida.

### Adaptar el ciclo de vida {#adaptar-el-ciclo-de-vida}

Modifica la función de entrada:

- Mueve la creación del router y la creación/renderizado de la instancia a la función `window.__WUJIE_MOUNT`.
- Mueve la destrucción de la instancia a `window.__WUJIE_UNMOUNT`.
- Si la instanciación de la subaplicación ocurre dentro de una función asíncrona, después de definir los ciclos de vida llama explícitamente a la función de renderizado de Wujie `window.__WUJIE.mount()` (ver el ejemplo de vite).

A continuación tienes ejemplos concretos.

::: details vue2

```javascript
if (window.__POWERED_BY_WUJIE__) {
  let instance;
  window.__WUJIE_MOUNT = () => {
    const router = new VueRouter({ routes });
    instance = new Vue({ router, render: (h) => h(App) }).$mount("#app");
  };
  window.__WUJIE_UNMOUNT = () => {
    instance.$destroy();
  };
} else {
  new Vue({ router: new VueRouter({ routes }), render: (h) => h(App) }).$mount("#app");
}
```

:::
::: details vue3

```javascript
if (window.__POWERED_BY_WUJIE__) {
  let instance;
  window.__WUJIE_MOUNT = () => {
    const router = createRouter({ history: createWebHistory(), routes });
    instance = createApp(App);
    instance.use(router);
    instance.mount("#app");
  };
  window.__WUJIE_UNMOUNT = () => {
    instance.unmount();
  };
} else {
  createApp(App).use(createRouter({ history: createWebHistory(), routes })).mount("#app");
}
```

:::
::: details vite

```javascript
declare global {
  interface Window {
    // indica si Wujie está presente
    __POWERED_BY_WUJIE__?: boolean;
    // función mount de la subaplicación
    __WUJIE_MOUNT: () => void;
    // función unmount de la subaplicación
    __WUJIE_UNMOUNT: () => void | Promise<void>;
    // instancia de Wujie de la subaplicación
    __WUJIE: { mount: () => void };
  }
}

if (window.__POWERED_BY_WUJIE__) {
  let instance: any;
  window.__WUJIE_MOUNT = () => {
    const router = createRouter({ history: createWebHistory(), routes });
    instance = createApp(App)
    instance.use(router);
    instance.mount("#app");
  };
  window.__WUJIE_UNMOUNT = () => {
    instance.unmount();
  };
  /*
    Como vite carga de forma asíncrona y Wujie puede usar el modo fiber,
    no se puede saber cuándo se llamará a mount: es posible que cuando el
    framework lo invoque vite todavía no haya terminado de cargar. Por eso
    se llama activamente aquí. La función mount de Wujie lleva una marca
    interna, así que no hay riesgo de montar dos veces.
  */
  window.__WUJIE.mount()
} else {
  createApp(App).use(createRouter({ history: createWebHistory(), routes })).mount("#app");
}

```

:::
::: details react

```javascript
if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = () => {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById("root")
    );
  };
  window.__WUJIE_UNMOUNT = () => {
    ReactDOM.unmountComponentAtNode(document.getElementById("root"));
  };
} else {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}
```

:::
::: details angular

```typescript
declare global {
  interface Window {
    // indica si Wujie está presente
    __POWERED_BY_WUJIE__?: boolean;
    // función mount de la subaplicación
    __WUJIE_MOUNT: () => void;
    // función unmount de la subaplicación
    __WUJIE_UNMOUNT: () => void | Promise<void>;
  }
}

if (window.__POWERED_BY_WUJIE__) {
  let instance: any;
  window.__WUJIE_MOUNT = async () => {
    instance = await platformBrowserDynamic().bootstrapModule(AppModule);
  };
  window.__WUJIE_UNMOUNT = () => {
    instance.destroy?.();
  };
} else {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
}
```

:::

### Otros casos {#otros-casos}

Los proyectos antiguos que no se empaquetan con `webpack` no necesitan ningún cambio, pero al cambiar de subaplicación puede aparecer pantalla en blanco.

::: warning Atención

- En proyectos legacy, usa en lo posible el [modo keep-alive](/es/guide/mode.html#modo-keep-alive) para reducir el tiempo de pantalla en blanco.
  :::
