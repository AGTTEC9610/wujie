---
sidebarDepth: 2
collapsable: false
---

# Envoltorio para Vue

Wujie ofrece un envoltorio en forma de componente para `vue2` y `vue3`. Ver la [demo](https://wujie-micro.github.io/demo-main-vue/) y el [código de la demo](https://github.com/Tencent/wujie/tree/master/examples/main-vue/).

## Instalación {#instalacion}

```bash
# framework vue2
npm i @agttec9610/wujie-vue2 -S
# framework vue3
npm i @agttec9610/wujie-vue3 -S

```

## Importación {#importacion}

```javascript
// vue2
import WujieVue from "@agttec9610/wujie-vue2";
// vue3
import WujieVue from "@agttec9610/wujie-vue3";

const { bus, setupApp, preloadApp, destroyApp, refreshApp, clearAssetsCache } = WujieVue;

Vue.use(WujieVue);
```

## Uso {#uso}

```js
<WujieVue
  width="100%"
  height="100%"
  name="xxx"
  :url="xxx"
  :sync="true"
  :fetch="fetch"
  :props="props"
  :beforeLoad="beforeLoad"
  :beforeMount="beforeMount"
  :afterMount="afterMount"
  :beforeUnmount="beforeUnmount"
  :afterUnmount="afterUnmount"
></WujieVue>
```

Todos los eventos que la subaplicación emita con [$wujie.bus.$emit](/es/api/wujie.html#wujie-bus)`(event, args)` pueden escucharse directamente con `@event`.

### bus

[Igual que en la API](/es/api/bus.html)

### setupApp

[Igual que en la API](/es/api/setupApp.html)

### preloadApp

[Igual que en la API](/es/api/preloadApp.html)

### destroyApp

[Igual que en la API](/es/api/destroyApp.html)

### refreshApp

[Igual que en la API](/es/api/refreshApp.html)

### clearAssetsCache

[Igual que en la API](/es/api/clearAssetsCache.html)

### refresh

Método de instancia del componente, **sin argumentos**. Destruye la instancia actual de la subaplicación y la reconstruye por completo reutilizando automáticamente las props actuales del componente (`name`, `url`, `alive`, etc.). Devuelve la `Promise` correspondiente a `startAppQueue`, para poder continuar tras el refresco.

```javascript
// llamada directa, sin pasar ningún argumento
await this.$refs.wujie.refresh();
```

## Cómo funciona por dentro {#implementacion}

```javascript
import Vue from "vue";
import { bus, setupApp, preloadApp, startApp, destroyApp } from "@agttec9610/wujie";
import { createApp, h, defineComponent } from "vue";
const vue3Flag = !!createApp;

const wujieVueOptions = {
  name: "WujieVue",
  props: {
    width: { type: String, default: "" },
    height: { type: String, default: "" },
    name: { type: String, default: "" },
    loading: { type: HTMLElement, default: undefined },
    url: { type: String, default: "" },
    sync: { type: Boolean, default: false },
    prefix: { type: Object, default: undefined },
    alive: { type: Boolean, default: false },
    props: { type: Object, default: undefined },
    replace: { type: Function, default: undefined },
    fetch: { type: Function, default: undefined },
    fiber: { type: Boolean, default: true },
    degrade: { type: Boolean, default: false },
    plugins: { type: Array, default: null },
    beforeLoad: { type: Function, default: null },
    beforeMount: { type: Function, default: null },
    afterMount: { type: Function, default: null },
    beforeUnmount: { type: Function, default: null },
    afterUnmount: { type: Function, default: null },
    activated: { type: Function, default: null },
    deactivated: { type: Function, default: null },
    loadError: { type: Function, default: null },
    iframeAddEventListeners: { type: Array, default: null },
    iframeOnEvents: { type: Array, default: null },
  },
  data() {
    return {
      destroy: null,
      startAppQueue: Promise.resolve(),
    };
  },
  mounted() {
    bus.$onAll(this.handleEmit);
    this.execStartApp();
    this.$watch(
      () => this.name + this.url,
      () => this.execStartApp()
    );
  },
  methods: {
    handleEmit(event, ...args) {
      this.$emit(event, ...args);
    },
    execStartApp() {
      this.startAppQueue = this.startAppQueue.then(async () => {
        try {
          this.destroy = await startApp({
            name: this.name,
            url: this.url,
            el: this.$refs.wujie,
            loading: this.loading,
            alive: this.alive,
            fetch: this.fetch,
            props: this.props,
            replace: this.replace,
            sync: this.sync,
            prefix: this.prefix,
            fiber: this.fiber,
            degrade: this.degrade,
            plugins: this.plugins,
            beforeLoad: this.beforeLoad,
            beforeMount: this.beforeMount,
            afterMount: this.afterMount,
            beforeUnmount: this.beforeUnmount,
            afterUnmount: this.afterUnmount,
            activated: this.activated,
            deactivated: this.deactivated,
            loadError: this.loadError,
            iframeAddEventListeners: this.iframeAddEventListeners,
            iframeOnEvents: this.iframeOnEvents,
          });
        } catch (error) {
          console.log(error);
        }
      });
    },
  },
  beforeDestroy() {
    bus.$offAll(this.handleEmit);
  },
  render(c) {
    const createElement = vue3Flag ? h : c;
    return createElement("div", {
      style: {
        width: this.height,
        height: this.height,
      },
      ref: "wujie",
    });
  },
};

const WujieVue = vue3Flag ? defineComponent(wujieVueOptions) : Vue.extend(wujieVueOptions);

WujieVue.setupApp = setupApp;
WujieVue.preloadApp = preloadApp;
WujieVue.bus = bus;
WujieVue.destroyApp = destroyApp;
WujieVue.install = function (Vue) {
  Vue.component("WujieVue", WujieVue);
};

export default WujieVue;
```
