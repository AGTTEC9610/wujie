# Crear un proyecto nuevo

### Introducción {#introduccion}

`create-wujie` sirve para arrancar rápidamente proyectos de ejemplo y facilitar los primeros pasos.

- Permite elegir una o varias subaplicaciones para crear un proyecto nuevo, cómodo para desarrollar y probar sobre un framework concreto.
- Permite elegir el modo de router (`hash`, `history`) tanto de la aplicación principal como de las subaplicaciones.

Más adelante se añadirán más funciones, frameworks y versiones para agilizar la puesta en marcha con `wujie`.

Si encuentras algún problema, coméntalo en los [issues](https://github.com/wujie-micro/create-wujie/issues).

### Inicio rápido {#inicio-rapido}

Configuración del entorno de desarrollo:

- [Node.js](https://nodejs.org/en/) versión < 18.0.0
- [pnpm](https://pnpm.io/) — la plantilla del andamiaje se gestiona con pnpm + [turborepo](https://turborepo.org/docs/getting-started)

Si necesitas cambiar de versión de Node.js, puedes instalar [nvm](https://github.com/nvm-sh/nvm) o [fnm](https://github.com/Schniz/fnm).

Ejemplo de instalación de Node.js 16 LTS con nvm:

```bash
# Instalar la versión LTS de Node.js 16
nvm install 16 --lts

# Fijar Node.js 16 como versión por defecto
nvm alias default 16

# Cambiar a la versión recién instalada
nvm use 16
```

### Instalación {#instalacion}

Abre un terminal y crea un nuevo ejemplo `wujie demo` con:

```bash
# Instalar la skill de Cursor para wujie
npx skills add wujie-micro/wujie-skill
```

### Lista de plantillas {#lista-de-plantillas}

- Aplicaciones principales

| Framework de la app principal |     |
| ----------------------------- | --- |
| Webpack + Vue2                | ✅  |
| Webpack + React17             | ✅  |
| Vite + Vue3                   | 🚧  |

- Subaplicaciones

| Framework de la subaplicación |     |
| ----------------------------- | --- |
| Vite + Vue3                   | ✅  |
| Webpack + Vue2                | ✅  |
| Webpack + Vue3                | ✅  |
| Webpack + React16             | ✅  |
| Webpack + React17             | ✅  |
| Angular12                     | ✅  |
