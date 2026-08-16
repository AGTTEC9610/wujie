# Navegación entre rutas

::: tip Sugerencia
Wujie permite navegar entre las rutas de distintas subaplicaciones. A continuación se explica cómo hacerlo según el escenario.
:::

## Aplicación principal en modo history {#modo-history}

### La subaplicación A quiere abrir la subaplicación B {#a-abre-b}

Tomando como ejemplo una aplicación principal en vue: la subaplicación A tiene `name` igual a `A` y su página en la aplicación principal está en `/pathA`; la subaplicación B tiene `name` igual a `B` y su página está en `/pathB`.

Página A de la aplicación principal:

```vue
<template>
  <!-- subaplicación A -->
  <wujie-vue name="A" url="//hostA.com" :props="{jump}" ></WujieVue>
</template>

<script>
export default {
  methods: {
    jump(location) {
      this.$router.push(location);
    }
}
</script>
```

La subaplicación A navega a la página de la subaplicación B llamando a la función `jump` que le pasó la aplicación principal:

```javascript
// manejador del clic en la subaplicación A
function handleJump() {
  window.$wujie?.props.jump({ path: "/pathB" });
}
```

### La subaplicación A quiere abrir una ruta concreta de B {#a-abre-ruta-de-b}

Con el método anterior, A solo puede llegar a la ruta por defecto de B dentro de la aplicación principal. Si necesitas ir a una ruta concreta de B, por ejemplo `/test`:

1. Activa la sincronización de rutas en la subaplicación B.

2. Función de navegación de la subaplicación:

```javascript
// manejador del clic en la subaplicación A
function handleJump() {
  window.$wujie?.props.jump({ path: "/pathB", query: { B: "/test" } });
}
```

Como el enlace resultante lleva en su query la información de ruta de B, y B tiene la sincronización activada, puede leer de la url la ruta a sincronizar. Ojo: esto solo funciona si B no se ha activado nunca antes.

### La subaplicación B está en keep-alive {#b-en-keep-alive}

Si B está en keep-alive y todavía no se ha abierto (es decir, no está instanciada), el método anterior funciona correctamente. Pero si B ya está instanciada, sus datos internos y el estado de su ruta se conservan y no se pierden al cambiar de subaplicación.

En ese caso, para abrir una ruta concreta de B hay que usar la comunicación:

Manejador del clic en la subaplicación A:

```javascript
// manejador del clic en la subaplicación A
function handleJump() {
  window.$wujie?.bus.$emit("routeChange", "/test");
}
```

Subaplicación B:

```javascript
// la subaplicación B escucha y navega
window.$wujie?.bus.$on("routeChange", (path) => this.$router.push({ path }));
```

## Aplicación principal en modo hash {#modo-hash}

Cuando la aplicación principal está en modo hash, sus parámetros de query se cuelgan detrás del valor del hash, mientras que la sincronización de rutas de Wujie lee los parámetros de query de la url. Por eso hay que colgar los parámetros manualmente.

### La subaplicación A quiere abrir la subaplicación B {#a-abre-b-hash}

[Igual que antes](#a-abre-b).

### La subaplicación A quiere abrir una ruta concreta de B {#a-abre-ruta-de-b-hash}

1. Modifica el `jump` de la aplicación principal:

```vue
<template>
  <wujie-vue name="A" url="//hostA.com" :props="{jump}" ></wujie-vue>
</template>

<script>
export default {
  methods: {
    jump(location, query) {
      // navegar a la página B de la aplicación principal
      this.$router.push(location);
      const url = new URL(window.location.href);
      url.search = query
      // colgar manualmente los parámetros de query en la url
      window.history.replaceState(null, "", url.href);
    }
}
</script>
```

2. Activa la sincronización de rutas en la subaplicación B.

3. Función de navegación de la subaplicación:

```javascript
function handleJump() {
  window.$wujie?.props.jump({ path: "/pathB" } , `?B=${window.encodeURIComponent("/test")}`);
}
```

### La subaplicación B está en keep-alive {#b-en-keep-alive-hash}

[Igual que antes](#b-en-keep-alive).
