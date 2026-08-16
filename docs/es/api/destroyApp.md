# destroyApp

- Tipo: `Function`

- Parámetros: `string`, el `name` de la subaplicación

- Valor de retorno: `void`

Destruye manualmente una subaplicación. Se destruyen el `iframe` y el `shadowRoot` que la alojan, así como la instancia de Wujie, lo que equivale a vaciar toda la caché. Salvo que no vayas a volver a usar la subaplicación, no deberías destruirla activamente.
