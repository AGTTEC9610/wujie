
# Compartir dependencias entre aplicaciones

Un sistema de micro frontends puede ejecutar varias subaplicaciones a la vez, y distintas subaplicaciones pueden depender de los mismos paquetes. Esa dependencia se empaqueta y se ejecuta varias veces, desperdiciando rendimiento y memoria.

Aquí se propone una estrategia de ingeniería que, combinada con el sistema de plugins de Wujie, resuelve el problema de forma efectiva.

Escenario de ejemplo: la aplicación principal usa `lodash` y la subaplicación A usa la misma versión de `lodash`.

::: warning Advertencia
Compartir aplicaciones se apoya en que la aplicación principal y el sandbox iframe de la subaplicación comparten dominio y, por tanto, memoria. Para paquetes de terceros con efectos secundarios —como las librerías de componentes— puede que no sea posible compartir.
:::


## La subaplicación solo se ejecuta dentro del micro frontend {#solo-microfrontend}

Aplicación principal:

1. Modifica su `index.js` para colgar el paquete compartido en el objeto `window`:

```javascript
// index.js
import lodash from "lodash";

// exponer globalmente el paquete que se quiere compartir
window.lodash = lodash;
```

2. Al cargar la subaplicación, inyecta un plugin que asigne el `lodash` de la aplicación principal al `window` de la subaplicación:

```vue
<WujieVue
  name="A"
  url="xxxxx"
  :plugins="[{ jsBeforeLoaders: [{ content: 'window.lodash = window.parent.lodash' }] }]"
></WujieVue>
```

Subaplicación: configura `externals` en `webpack`.

```javascript
module.exports = {
  externals: {
    "lodash": {
      root: "lodash",
      commonjs: "lodash",
      commonjs2: "lodash",
      amd: "lodash",
    },
  },
};
```

## La subaplicación también debe poder ejecutarse sola {#ejecucion-independiente}

Si la subaplicación necesita ejecutarse por su cuenta, con el paso anterior fallará porque `lodash` está en `externals`. Para que funcione de forma independiente:

1. Empaqueta aparte los paquetes que quedaron en `externals` (por ejemplo `A.bundle.js`); ese bundle debe incluir `lodash` e inyectarlo en `window`.

2. Añade `A.bundle.js` al `head` del `html` de la subaplicación:

```html
<head>
  <script src="xxxx/A.bundle.js" ignore >
<head>
```

Gracias a la marca `ignore`, Wujie ignora esa etiqueta al ejecutar la subaplicación, pero cuando esta corre por su cuenta la marca no le afecta y el script sí se ejecuta. También puedes prescindir de `ignore` y excluir el script con un plugin de Wujie:

```vue
<WujieVue
  name="A"
  url="xxxxx"
  :plugins="[
    { jsExcludes: ['xxxx/A.bundle.js'], jsBeforeLoaders: [{ content: 'window.lodash = window.parent.lodash' }] },
  ]"
></WujieVue>
```
