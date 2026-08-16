---
sidebarDepth: 2
collapsable: false
---

# Envoltorio para React

Wujie ofrece un envoltorio en forma de componente para `react`. Ver la [demo](https://wujie-micro.github.io/demo-main-react/) y el [código de la demo](https://github.com/Tencent/wujie/tree/master/examples/main-react/).

## Instalación {#instalacion}

```bash
npm i @agttec9610/wujie-react -S
```

## Importación {#importacion}

```javascript
import WujieReact from "@agttec9610/wujie-react";

const { bus, setupApp, preloadApp, destroyApp, refreshApp, clearAssetsCache } = WujieReact;
```

## Uso {#uso}

```jsx
<WujieReact
  width="100%"
  height="100%"
  name="xxx"
  url={xxx}
  sync={true}
  fetch={fetch}
  props={props}
  beforeLoad={beforeLoad}
  beforeMount={beforeMount}
  afterMount={afterMount}
  beforeUnmount={beforeUnmount}
  afterUnmount={afterUnmount}
></WujieReact>
```

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

Método de instancia del componente, **sin argumentos**. Destruye la instancia actual de la subaplicación y la reconstruye por completo reutilizando automáticamente las props actuales del componente. Devuelve la `Promise` correspondiente a `startAppQueue`.

```javascript
// llamada directa, sin pasar ningún argumento
await this.wujieRef.current.refresh();
```

## Cómo funciona por dentro {#implementacion}

```javascript
import React from "react";
import PropTypes from "prop-types";
import { bus, setupApp ,preloadApp, startApp, destroyApp } from "@agttec9610/wujie";

export default class WujieReact extends React.PureComponent {
  static propTypes = {
    height: PropTypes.string,
    width: PropTypes.string,
    name: PropTypes.string,
    loading: PropTypes.element;
    url: PropTypes.string,
    alive: PropTypes.bool,
    fetch: PropTypes.func,
    props: PropTypes.object,
    replace: PropTypes.func,
    sync: PropTypes.bool,
    prefix: PropTypes.object,
    fiber: PropTypes.bool,
    degrade: PropTypes.bool,
    plugins: PropTypes.array,
    beforeLoad: PropTypes.func,
    beforeMount: PropTypes.func,
    afterMount: PropTypes.func,
    beforeUnmount: PropTypes.func,
    afterUnmount: PropTypes.func,
    activated: PropTypes.func,
    deactivated: PropTypes.func,
    loadError: PropTypes.func,
    iframeAddEventListeners: PropTypes.array,
    iframeOnEvents: PropTypes.array,
  };
  static bus = bus;
  static setupApp = setupApp;
  static preloadApp = preloadApp;
  static destroyApp = destroyApp;

  state = {
    myRef: React.createRef(),
  };

  destroy = null;

  startAppQueue = Promise.resolve();

  execStartApp = () => {
    const {
      name,
      url,
      loading,
      alive,
      fetch,
      props,
      replace,
      sync,
      prefix,
      fiber,
      degrade,
      plugins,
      beforeLoad,
      beforeMount,
      afterMount,
      beforeUnmount,
      afterUnmount,
      activated,
      deactivated,
      loadError,
    } = this.props;
    this.startAppQueue = this.startAppQueue.then(async () => {
      try {
        this.destroy = await startApp({
          name,
          url,
          el: this.state.myRef.current,
          loading,
          alive,
          fetch,
          props,
          replace,
          sync,
          prefix,
          fiber,
          degrade,
          plugins,
          beforeLoad,
          beforeMount,
          afterMount,
          beforeUnmount,
          afterUnmount,
          activated,
          deactivated,
          loadError,
          iframeAddEventListeners,
          iframeOnEvents,
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  render() {
    this.execStartApp();
    return React.createElement("div", {
      style: {
        width: this.props.width,
        height: this.props.height,
      },
      ref: this.state.myRef,
    });
  }
}
```
